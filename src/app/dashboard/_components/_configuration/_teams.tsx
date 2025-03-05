import React, { useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/core/Input';
import { Button } from '@/components/ui/core/Button';
import { Label } from '@/components/ui/core/Label';
import { Card } from '@/components/ui/core/Card';
import { Checkbox } from '@/components/ui/core/Checkbox';
import { useConfigStore } from '@/store/config-store';
import { useActions } from '@/store/action-store';

const TeamSetup = () => {
  const config = useConfigStore((state) => state.config);
  const selectedActivities = config.activities.selected;
  const selectedByCategory = config.activities.selectedByCategory || {};
  const updateTeams = useConfigStore((state) => state.updateTeams);
  const teams = config.teams;
  
  // Get action categories data using React Query
  const { data: actionCategories, isLoading: isLoadingCategories } = useActions();
  
  // Get all selected category IDs
  const selectedCategoryIds = Object.keys(selectedByCategory);

  // Log whenever teams or categories change to debug
  useEffect(() => {
    console.log('TeamSetup: state updated', {
      teams,
      selectedCategoryIds,
      teamsWithFunctions: teams.filter(t => t.functions && t.functions.length > 0).length,
      teamsWithCategories: teams.filter(t => t.categories && t.categories.length > 0).length
    });
  }, [teams, selectedCategoryIds]);

  // Initialize teams with default values
  useEffect(() => {
    if (isLoadingCategories || !actionCategories) {
      return; // Don't process until data is loaded
    }
    
    console.log('TeamSetup: checking team initialization', {
      teamsLength: teams.length,
      selectedCategoryIds
    });
    
    // If no teams exist and we have categories, create a default team
    if (teams.length === 0 && selectedCategoryIds.length > 0) {
      console.log('Creating default team with categories', {
        categories: selectedCategoryIds
      });
      
      updateTeams([{ 
        id: 'temp-' + Date.now(), 
        name: '', 
        functions: [...selectedCategoryIds], // Copy selected categories to functions
        categories: selectedCategoryIds
      }]);
    } 
    // If teams exist but they don't have functions or categories, update them
    else if (teams.length > 0) {
      const needsUpdate = teams.some(team => 
        !team.functions || 
        team.functions.length === 0 ||
        !team.categories ||
        (selectedCategoryIds.length > 0 && team.categories.length === 0)
      );
      
      if (needsUpdate) {
        console.log('Updating teams with missing functions or categories');
        const updatedTeams = teams.map(team => {
          // Start with current team
          let updatedTeam = { ...team };
          
          // If no categories, add all selected categories
          if (!team.categories || team.categories.length === 0) {
            updatedTeam.categories = selectedCategoryIds;
          }
          
          // Copy categories to functions
          if (!team.functions || team.functions.length === 0) {
            updatedTeam.functions = [...updatedTeam.categories];
          }
          
          return updatedTeam;
        });
        
        // Only update if there's an actual change
        if (JSON.stringify(updatedTeams) !== JSON.stringify(teams)) {
          console.log('Updating teams with categories and functions', updatedTeams);
          updateTeams(updatedTeams);
        }
      }
    }
  }, [teams.length, selectedCategoryIds.length, isLoadingCategories, actionCategories]);

  const handleTeamNameChange = (teamId: string, name: string) => {
    console.log('Team name change:', { teamId, name });
    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        return { ...team, name };
      }
      return team;
    });
    
    updateTeams(updatedTeams);
  };

  // Simplified category toggle that updates both categories and functions simultaneously
  const handleCategoryToggle = (teamId: string, categoryId: string) => {
    updateTeams(teams.map(team => {
      if (team.id === teamId) {
        const categories = team.categories || [];
        const isSelected = categories.includes(categoryId);
        
        let updatedCategories;
        
        if (isSelected) {
          // Remove this category
          updatedCategories = categories.filter(c => c !== categoryId);
        } else {
          // Add this category
          updatedCategories = [...categories, categoryId];
        }
        
        // Always synchronize functions with categories
        const updatedFunctions = [...updatedCategories];
        
        console.log('Updated state:', {
          categories: updatedCategories,
          functions: updatedFunctions
        });
        
        return { 
          ...team, 
          categories: updatedCategories,
          functions: updatedFunctions
        };
      }
      return team;
    }));
  };

  const addTeam = () => {
    // Always include all categories (and copy to functions) when adding a team
    updateTeams([...teams, { 
      id: 'temp-' + Date.now(), 
      name: '', 
      functions: [...selectedCategoryIds], // Copy selected categories to functions
      categories: selectedCategoryIds
    }]);
  };

  const removeTeam = (teamId: string) => {
    if (teams.length <= 1) {
      return; // Don't remove the last team
    }
    updateTeams(teams.filter(team => team.id !== teamId));
  };

  // Get category name by ID
  const getCategoryNameById = (categoryId: string) => {
    if (!actionCategories) return 'Loading...';
    
    const category = actionCategories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Get action count for a category
  const getActionCountForCategory = (categoryId: string) => {
    return selectedByCategory[categoryId]?.length || 0;
  };

  // Loading state while waiting for data
  if (isLoadingCategories) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
        <span className="ml-3">Loading team data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {teams.map((team) => (
        <Card key={team.id} className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-full space-y-1">
                <Label htmlFor={`team-name-${team.id}`}>Team name</Label>
                <Input
                  id={`team-name-${team.id}`}
                  value={team.name || ''}
                  onChange={(e) => handleTeamNameChange(team.id, e.target.value)}
                  placeholder="Enter a fun or descriptive name"
                  className="max-w-copy-sm"
                />
              </div>
              {teams.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeTeam(team.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Category selection section */}
            {selectedCategoryIds.length > 0 && (
              <div className="space-y-1.5 border-t pt-4 mt-4">
                <Label>Action Categories</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedCategoryIds.map((categoryId) => {
                    // The category checkbox should directly reflect if it's in the team's categories list
                    const isChecked = (team.categories || []).includes(categoryId);
                    
                    return (
                      <div key={categoryId} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${team.id}-category-${categoryId}`}
                          checked={isChecked}
                          onCheckedChange={() => handleCategoryToggle(team.id, categoryId)}
                        />
                        <label
                          htmlFor={`${team.id}-category-${categoryId}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {getCategoryNameById(categoryId)} ({getActionCountForCategory(categoryId)})
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}

      <Button
        type="button"
        variant="secondary"
        onClick={addTeam}
        className="w-full"
      >
        <Plus className="mr-2" />
        Add another team
      </Button>
      
      {/* Debug info */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mt-8 p-4 border border-yellow-300 bg-yellow-50 rounded-md">
          <h3 className="font-bold text-sm text-yellow-800 mb-2">Debug Info</h3>
          <div className="text-xs font-mono">
            <div>
              <span className="font-bold">Team Count:</span> {teams.length}
            </div>
            <div>
              <span className="font-bold">Selected Categories:</span> {selectedCategoryIds.length}
            </div>
            <div>
              <span className="font-bold">Teams with Categories:</span> {teams.filter(t => t.categories && t.categories.length > 0).length}
            </div>
            <div>
              <span className="font-bold">Teams with Functions:</span> {teams.filter(t => t.functions && t.functions.length > 0).length}
            </div>
            <div className="mt-2">
              <span className="font-bold">Teams Data:</span>
              <pre className="mt-1 p-2 bg-gray-100 rounded overflow-auto max-h-40">
                {JSON.stringify(teams, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamSetup;