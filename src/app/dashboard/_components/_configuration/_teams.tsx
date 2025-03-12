import React, { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/core/Input";
import { Button } from "@/components/ui/core/Button";
import { Label } from "@/components/ui/core/Label";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/core/Card";
import { Checkbox } from "@/components/ui/core/Checkbox";
import { useConfigStore } from "@/store/config-store";
import { useActions, MANDATORY_CATEGORIES } from "@/store/action-store";
import { useProfileStore } from "@/store/user-store";

// Define the types for the teams we're working with
interface ExtendedTeam {
  id: string;
  name: string;
  functions: string[];
  categories: string[];
  teamFunctionId?: string;
  customFields?: any;
}

// Define interfaces for profile team data structure
interface ProfileTeam {
  id: string;
  name: string;
  teamFunctionId?: string;
  customFields?: any;
}

const TeamSetup = () => {
  const config = useConfigStore((state) => state.config);
  const selectedActivities = config.activities.selected;
  const selectedByCategory = config.activities.selectedByCategory || {};
  const updateTeams = useConfigStore((state) => state.updateTeams);
  const configTeams = config.teams;
  
  // Get profile data
  const { profile } = useProfileStore();
  
  // Use state to track the combined teams data
  const [teams, setTeams] = useState<ExtendedTeam[]>([]);

  // Create ref for input focus
  const teamNameRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Get action categories data using React Query
  const { data: actionCategories, isLoading: isLoadingCategories } = useActions();

  // Get all selected category IDs
  const selectedCategoryIds = Object.entries(selectedByCategory)
    .filter(([_, actions]) => (actions as any[]).length > 0)
    .map(([categoryId, _]) => categoryId);

  // Helper function to extract category IDs from function names
  const getFunctionCategoryIds = (functionNames: string[]) => {
    if (!actionCategories) return [];
    
    return actionCategories
      .filter(category => functionNames.includes(category.name))
      .map(category => category.id);
  };

  // Initialize teams data from profile or config
  useEffect(() => {
    if (profile?.teams && profile.teams.length > 0) {
      // Transform profile teams to match the expected format
      const profileTeams = profile.teams.map(team => {
        // Extract custom fields safely
        const customFields = (team as any).customFields || {};
        
        // Get functions from customFields or create an empty array
        let functions = customFields.functions || [];
        
        // If teamFunctionId exists and functions is empty, try to get function name from categories
        if ((team as any).teamFunctionId && functions.length === 0 && actionCategories) {
          const teamFunction = actionCategories.find(cat => cat.id === (team as any).teamFunctionId);
          if (teamFunction) {
            functions = [teamFunction.name];
          }
        }
        
        // Get category IDs from customFields or derive from functions
        const categories = customFields.categories || getFunctionCategoryIds(functions);
        
        return {
          id: team.id,
          name: team.name,
          functions: functions,
          categories: categories,
          teamFunctionId: (team as any).teamFunctionId
        } as ExtendedTeam;
      });
      
      setTeams(profileTeams);
    } else if (configTeams.length > 0) {
      // When opening from the TeamsSummary, ensure we properly map the data
      const mappedTeams = configTeams.map(team => {
        // Make sure we have both functions and categories
        const functions = team.functions || [];
        const categories = team.categories || getFunctionCategoryIds(functions);
        
        return {
          ...team,
          functions,
          categories
        };
      });
      
      setTeams(mappedTeams);
    } else if (selectedCategoryIds.length > 0) {
      // If no teams exist and we have categories, create a default team
      const defaultTeam: ExtendedTeam = {
        id: "temp-" + Date.now(),
        name: "",
        functions: [...selectedCategoryIds],
        categories: selectedCategoryIds,
      };
      setTeams([defaultTeam]);
    }
  }, [profile, configTeams, selectedCategoryIds.length, actionCategories]);

  // Separate effect to sync with the config store
  useEffect(() => {
    // Only update the config store if teams are initialized and different
    if (teams.length > 0 && JSON.stringify(teams) !== JSON.stringify(configTeams)) {
      updateTeams(teams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teams, updateTeams]);

  // Initial focus on first team input
  useEffect(() => {
    // Focus the first team input when component loads
    if (teams.length > 0 && teamNameRefs.current[teams[0].id]) {
      setTimeout(() => {
        teamNameRefs.current[teams[0].id]?.focus();
      }, 100);
    }
  }, [teams.length]);

  // Log whenever teams or categories change to debug
  useEffect(() => {
    console.log("TeamSetup: state updated", {
      teams,
      selectedCategoryIds,
      teamsWithFunctions: teams.filter(
        (t) => t.functions && t.functions.length > 0
      ).length,
      teamsWithCategories: teams.filter(
        (t) => t.categories && t.categories.length > 0
      ).length,
    });
  }, [teams, selectedCategoryIds]);

  // Sync categories when moving to team step
  useEffect(() => {
    if (selectedCategoryIds.length > 0 && teams.length > 0) {
      // Update teams with categories - use functional update to avoid stale state
      setTeams(prevTeams => {
        const updatedTeams = prevTeams.map((team) => {
          // Keep existing categories if they exist
          if (team.categories && team.categories.length > 0) {
            return team;
          }
          // Otherwise, add all selected categories
          return {
            ...team,
            categories: selectedCategoryIds,
          };
        });

        // Only return new teams array if there's a change
        return JSON.stringify(updatedTeams) !== JSON.stringify(prevTeams)
          ? updatedTeams
          : prevTeams;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryIds, teams.length]);

  // Handle team name change
  const handleTeamNameChange = (teamId: string, name: string) => {
    console.log("Team name change:", { teamId, name });
    setTeams(prevTeams => 
      prevTeams.map((team) => {
        if (team.id === teamId) {
          return { ...team, name };
        }
        return team;
      })
    );
  };

  // Simplified category toggle that updates both categories and functions simultaneously
  const handleCategoryToggle = (teamId: string, categoryId: string) => {
    setTeams(prevTeams => 
      prevTeams.map((team) => {
        if (team.id === teamId) {
          const categories = [...(team.categories || [])];
          const isSelected = categories.includes(categoryId);

          let updatedCategories;
          if (isSelected) {
            // Remove this category
            updatedCategories = categories.filter((c) => c !== categoryId);
          } else {
            // Add this category
            updatedCategories = [...categories, categoryId];
          }

          // For functions, add or remove the category name instead of ID
          const categoryName = getCategoryNameById(categoryId);
          let updatedFunctions = [...(team.functions || [])];
          
          if (isSelected) {
            // Remove this function
            updatedFunctions = updatedFunctions.filter(fn => fn !== categoryName);
          } else {
            // Add this function
            if (!updatedFunctions.includes(categoryName)) {
              updatedFunctions.push(categoryName);
            }
          }

          console.log("Updated state:", {
            categories: updatedCategories,
            functions: updatedFunctions,
          });

          return {
            ...team,
            categories: updatedCategories,
            functions: updatedFunctions,
          };
        }
        return team;
      })
    );
  };

  const addTeam = () => {
    // Always include all categories (and copy to functions) when adding a team
    const newTeamId = "temp-" + Date.now();
    const categoryFunctions = selectedCategoryIds.map(id => getCategoryNameById(id));
    
    const newTeam: ExtendedTeam = {
      id: newTeamId,
      name: "",
      functions: categoryFunctions, // Use category names for functions
      categories: selectedCategoryIds, // Use category IDs for categories
    };
    
    // Update local state
    setTeams(prevTeams => [...prevTeams, newTeam]);
    
    // Important: Also update the config store directly for immediate sync
    updateTeams([...teams, newTeam]);
  
    // Focus the new team's input field after adding
    setTimeout(() => {
      teamNameRefs.current[newTeamId]?.focus();
    }, 100);
  };

  const removeTeam = (teamId: string) => {
    if (teams.length <= 1) {
      return; // Don't remove the last team
    }
    setTeams(prevTeams => prevTeams.filter((team) => team.id !== teamId));
  };

  // Get category name by ID
  const getCategoryNameById = (categoryId: string) => {
    if (!actionCategories) return "Loading...";

    const category = actionCategories.find((cat) => cat.id === categoryId);
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
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {teams.map((team) => (
        <Card data-slot="card" key={team.id}>
          <CardHeader data-slot="card-header" className="relative">
            <CardTitle data-slot="card-title">
              {team.name ? `Team ${team.name}` : "Team"}
            </CardTitle>
            {teams.length > 1 && (
              <Button
                data-slot="button"
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeTeam(team.id)}
              >
                <X />
              </Button>
            )}
          </CardHeader>
          <CardContent data-slot="card-content" className="pt-2">
            <div className="space-y-4">
              <div className="">
                <div className="w-full space-y-1.5">
                  <Label data-slot="label" htmlFor={`team-name-${team.id}`}>
                    Team Name
                  </Label>
                  <Input
                    data-slot="input"
                    id={`team-name-${team.id}`}
                    value={team.name || ""}
                    onChange={(e) =>
                      handleTeamNameChange(team.id, e.target.value)
                    }
                    placeholder="Enter a fun or descriptive name"
                    className="max-w-copy-sm"
                    ref={(el) => {
                      teamNameRefs.current[team.id] = el;
                    }}
                  />
                </div>
              </div>

              {/* Category selection section */}
              {selectedCategoryIds.length > 0 && (
                <div className="space-y-2.5 my-4">
                  <h3 className="heading-4">
                    Function{" "}
                    <span className="text-sm font-normal text-foreground-weak">
                      (# actions)
                    </span>
                  </h3>
                  <div className="space-y-4">
                    {selectedCategoryIds
                      .filter((categoryId) => {
                        // Filter out general responsibility categories
                        const categoryName = getCategoryNameById(categoryId);

                        // console.log(categoryName, '-----------------categoryname')

                        return !MANDATORY_CATEGORIES.includes(categoryName);
                      })
                      .map((categoryId) => {
                        const categoryName = getCategoryNameById(categoryId);
                        const isChecked = (team.categories || []).includes(
                          categoryId
                        );

                        return (
                          <div
                            key={categoryId}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              id={`${team.id}-category-${categoryId}`}
                              checked={isChecked}
                              onCheckedChange={() =>
                                handleCategoryToggle(team.id, categoryId)
                              }
                            />
                            <Label
                              data-slot="label"
                              htmlFor={`${team.id}-category-${categoryId}`}
                            >
                              {categoryName} (
                              {getActionCountForCategory(categoryId)})
                            </Label>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        data-slot="button"
        type="button"
        variant="secondary"
        onClick={addTeam}
        className="w-full h-full"
      >
        <Plus className="mr-2" />
        Add another team
      </Button>

      {/* Debug info */}
      {process.env.NODE_ENV !== "production" && (
        <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-md">
          <h3 className="font-bold text-sm text-yellow-800 mb-2">Debug Info</h3>
          <div className="text-xs font-mono">
            <div>
              <span className="font-bold">Team Count:</span> {teams.length}
            </div>
            <div>
              <span className="font-bold">Selected Categories:</span>{" "}
              {selectedCategoryIds.length}
            </div>
            <div>
              <span className="font-bold">Teams with Categories:</span>{" "}
              {
                teams.filter((t) => t.categories && t.categories.length > 0)
                  .length
              }
            </div>
            <div>
              <span className="font-bold">Teams with Functions:</span>{" "}
              {
                teams.filter((t) => t.functions && t.functions.length > 0)
                  .length
              }
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