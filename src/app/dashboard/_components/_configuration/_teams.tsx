import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/core/Input';
import { Button } from '@/components/ui/core/Button';
import { Label } from '@/components/ui/core/Label';
import { Card } from '@/components/ui/core/Card';
import { Checkbox } from '@/components/ui/core/Checkbox';
import { actionsCategories, activityData } from "@/data/org-actions-data";
import { useConfigStore } from '@/store/config-store';
import { useActions } from '@/store/action-store';

interface Team {
  id: string;
  name: string;
  functions: string[];
  categories: string[]; // Add categories to team interface
}

const TeamSetup = () => {
  const selectedActivities = useConfigStore((state) => state.config.activities.selected);
  const selectedByCategory = useConfigStore((state) => state.config.activities.selectedByCategory || {});
  const updateTeams = useConfigStore((state) => state.updateTeams);
  const teams = useConfigStore((state) => state.config.teams);
  
  // Get action categories data
  const { data: actionCategories, isLoading } = useActions();

  // Get all selected category IDs
  const selectedCategoryIds = Object.keys(selectedByCategory);

  // Get function categories from your existing data structure
  const selectedFunctions = [...new Set(
    Object.entries(activityData)
      .filter(([key, activities]) => 
        activities.some(activity => selectedActivities.includes(activity)) &&
        actionsCategories.core.some(category => category.key === key)
      )
      .map(([key]) => key)
  )];

  useEffect(() => {
    if (teams.length === 0) {
      updateTeams([{ 
        id: '1', 
        name: '', 
        functions: selectedFunctions,
        categories: selectedCategoryIds // Initialize with all selected categories
      }]);
    } else {
      // Update existing teams to have the categories property if they don't already
      const updatedTeams = teams.map(team => {
        if (!team.categories) {
          return {
            ...team,
            categories: selectedCategoryIds
          };
        }
        return team;
      });
      
      if (JSON.stringify(updatedTeams) !== JSON.stringify(teams)) {
        updateTeams(updatedTeams);
      }
    }
  }, [selectedCategoryIds.length]);

  const handleTeamNameChange = (teamId: string, name: string) => {
    updateTeams(teams.map(team => 
      team.id === teamId ? { ...team, name } : team
    ));
  };

  const handleFunctionToggle = (teamId: string, functionName: string) => {
    updateTeams(teams.map(team => {
      if (team.id === teamId) {
        const functions = team.functions.includes(functionName)
          ? team.functions.filter(f => f !== functionName)
          : [...team.functions, functionName];
        return { ...team, functions };
      }
      return team;
    }));
  };

  const handleCategoryToggle = (teamId: string, categoryId: string) => {
    updateTeams(teams.map(team => {
      if (team.id === teamId) {
        const categories = team.categories || [];
        const updatedCategories = categories.includes(categoryId)
          ? categories.filter(c => c !== categoryId)
          : [...categories, categoryId];
        return { ...team, categories: updatedCategories };
      }
      return team;
    }));
  };

  const addTeam = () => {
    updateTeams([...teams, { 
      id: String(Date.now()), 
      name: '', 
      functions: selectedFunctions,
      categories: selectedCategoryIds // Initialize with all selected categories
    }]);
  };

  const removeTeam = (teamId: string) => {
    updateTeams(teams.filter(team => team.id !== teamId));
  };

  // Get category name by ID
  const getCategoryNameById = (categoryId: string) => {
    if (!actionCategories) return 'Loading...';
    
    const category = actionCategories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  // Get action count for a category
  const getActionCountForCategory = (categoryId: string) => {
    return selectedByCategory[categoryId]?.length || 0;
  };

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
                  value={team.name}
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

            {/* Function selection section */}
            {selectedFunctions.length === 1 ? (
              <div className="text-sm text-foreground-muted">
                Team function: {selectedFunctions[0]}
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label>Team functions</Label>
                <div className="flex gap-6">
                  {selectedFunctions.map((func) => {
                    const functionActivities = activityData[func].filter(activity => 
                      selectedActivities.includes(activity)
                    );
                    return (
                      <div key={func} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${team.id}-${func}`}
                          checked={team.functions.includes(func)}
                          onCheckedChange={() => {
                            const willUncheck = team.functions.includes(func);
                            const remainingFunctions = team.functions.filter(f => f !== func);
                            if (willUncheck && remainingFunctions.length === 0) {
                              return; // Prevent unchecking if it's the last function
                            }
                            handleFunctionToggle(team.id, func);
                          }}
                        />
                        <label
                          htmlFor={`${team.id}-${func}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {func} ({functionActivities.length})
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Category selection section */}
            {!isLoading && selectedCategoryIds.length > 0 && (
              <div className="space-y-1.5 border-t pt-4 mt-4">
                <Label>Action Categories</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedCategoryIds.map((categoryId) => (
                    <div key={categoryId} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${team.id}-category-${categoryId}`}
                        checked={(team.categories || []).includes(categoryId)}
                        onCheckedChange={() => handleCategoryToggle(team.id, categoryId)}
                      />
                      <label
                        htmlFor={`${team.id}-category-${categoryId}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {getCategoryNameById(categoryId)} ({getActionCountForCategory(categoryId)})
                      </label>
                    </div>
                  ))}
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
        <Plus />
        Add another team
      </Button>
    </div>
  );
};

export default TeamSetup;