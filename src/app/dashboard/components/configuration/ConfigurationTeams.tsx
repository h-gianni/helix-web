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
import { useTeamActivities } from "@/store/team-activities-store";
import { useUserTeams } from "@/store/user-store";

// Define the types for the teams we're working with
interface ExtendedTeam {
  id: string;
  name: string;
  functions: string[];
  categories: string[];
  teamFunctionId?: string;
  customFields?: any;
}

const TeamSetup = () => {
  const config = useConfigStore((state) => state.config);
  const selectedByCategory = config.activities.selectedByCategory || {};
  const updateTeams = useConfigStore((state) => state.updateTeams);
  const { data: teamsData, isLoading } = useUserTeams();
  const configTeams = config.teams;

  // Get profile data
  const { profile } = useProfileStore();

  // Use state to track the combined teams data
  const [teams, setTeams] = useState<ExtendedTeam[]>([]);
  // Track if initial data load has completed
  const [isInitialized, setIsInitialized] = useState(false);

  // Create ref for input focus
  const teamNameRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Get action categories data using React Query
  const { data: actionCategories, isLoading: isLoadingCategories } =
    useActions();

  // Get all selected category IDs
  const selectedCategoryIds = Object.entries(selectedByCategory)
    .filter(([_, actions]) => (actions as any[]).length > 0)
    .map(([categoryId, _]) => categoryId);

  // Helper function to extract category IDs from function names
  const getFunctionCategoryIds = (functionNames: string[]) => {
    if (!actionCategories) return [];

    return actionCategories
      .filter((category) => functionNames.includes(category.name))
      .map((category) => category.id);
  };

  // Load team activities from the database for each team
  useEffect(() => {
    // Skip if we're not initialized yet or if categories are still loading
    if (!isInitialized || isLoadingCategories) return;

    // Only fetch data for non-temporary teams
    const existingTeams = teams.filter((team) => !team.id.startsWith("temp-"));

    if (existingTeams.length === 0) return;

    const loadTeamActivities = async () => {
      for (const team of existingTeams) {
        try {
          // Using the useTeamActivities hook directly won't work in an effect,
          // so we'd need to fetch the data here or use a custom hook approach
          // For now, we'll rely on the config store which should already be synchronized
          // Placeholder for API call if needed:
          // const activities = await teamActivitiesApi.getTeamActivities(team.id);
          // For non-temporary teams, we could update their functions and categories
          // based on actual database data if needed
        } catch (error) {
          console.error(`Error loading activities for team ${team.id}:`, error);
        }
      }
    };

    loadTeamActivities();
  }, [teams, isInitialized, isLoadingCategories]);

  // Initialize teams data from profile or config - ONCE
  useEffect(() => {
    // Skip if already initialized or if data isn't ready
    if (isInitialized || isLoadingCategories) return;

    let initialTeams: ExtendedTeam[] = [];

    if (teamsData?.owned && teamsData?.owned.length > 0) {
      // Transform profile teams to match the expected format
      initialTeams = teamsData?.owned.map((team) => {
        // Extract custom fields safely
        const customFields = (team as any).customFields || {};

        // Get functions from customFields or create an empty array
        let functions = customFields.functions || [];

        // If teamFunctionId exists and functions is empty, try to get function name from categories
        if (
          (team as any).teamFunctionId &&
          functions.length === 0 &&
          actionCategories
        ) {
          const teamFunction = actionCategories.find(
            (cat) => cat.id === (team as any).teamFunctionId
          );
          if (teamFunction) {
            functions = [teamFunction.name];
          }
        }

        // Get category IDs from customFields or derive from functions
        const categories =
          customFields.categories || getFunctionCategoryIds(functions);

        return {
          id: team.id,
          name: team.name,
          functions: functions,
          categories: categories,
          teamFunctionId: (team as any).teamFunctionId,
        } as ExtendedTeam;
      });
    } else if (configTeams.length > 0) {
      // When opening from the TeamsSummary, ensure we properly map the data
      initialTeams = configTeams.map((team) => {
        // Make sure we have both functions and categories
        const functions = team.functions || [];
        const categories = team.categories || getFunctionCategoryIds(functions);

        return {
          ...team,
          functions,
          categories,
        };
      });
    } else if (selectedCategoryIds.length > 0) {
      // If no teams exist and we have categories, create a default team
      initialTeams = [
        {
          id: "temp-" + Date.now(),
          name: "",
          functions: [],
          categories: [],
        },
      ];
    }

    if (initialTeams.length > 0) {
      setTeams(initialTeams);
      // Mark as initialized to prevent future re-initialization
      setIsInitialized(true);
    }
  }, [
    profile,
    configTeams,
    selectedCategoryIds.length,
    actionCategories,
    isLoadingCategories,
    isInitialized,
  ]);

  // Sync with config store - carefully!
  // Use a ref to track the previous teams value to avoid unnecessary updates
  const prevTeamsRef = useRef<string>("");
  useEffect(() => {
    // Only update if teams have been initialized and changed
    if (teams.length > 0) {
      const teamsJSON = JSON.stringify(teams);
      // Only update if the teams data has actually changed
      if (teamsJSON !== prevTeamsRef.current) {
        prevTeamsRef.current = teamsJSON;
        updateTeams(teams);
      }
    }
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

  // Handle team name change
  const handleTeamNameChange = (teamId: string, name: string) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) => {
        if (team.id === teamId) {
          return { ...team, name };
        }
        return team;
      })
    );
  };

  // Fixed category toggle function with proper state handling
  const handleCategoryToggle = (
    teamId: string,
    categoryId: string,
    checked: boolean
  ) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) => {
        if (team.id === teamId) {
          let updatedCategories = [...(team.categories || [])];

          const categoryName = getCategoryNameById(categoryId);
          let updatedFunctions = [...(team.functions || [])];
          console.log(checked, "checked");
          if (checked) {
            // Add category and function when checked
            if (!updatedCategories.includes(categoryId)) {
              updatedCategories.push(categoryId);
            }
            if (!updatedFunctions.includes(categoryName)) {
              updatedFunctions.push(categoryName);
            }
          } else {
            // Remove category and function when unchecked
            updatedCategories = updatedCategories.filter(
              (id) => id !== categoryId
            );
            updatedFunctions = updatedFunctions.filter(
              (fn) => fn !== categoryName
            );
          }

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
    const newTeamId = "temp-" + Date.now();

    const newTeam: ExtendedTeam = {
      id: newTeamId,
      name: "",
      functions: [],
      categories: [],
    };

    // Update state with the new team
    setTeams((prevTeams) => [...prevTeams, newTeam]);

    // Focus the new team's input field after adding
    setTimeout(() => {
      teamNameRefs.current[newTeamId]?.focus();
    }, 100);
  };

  const removeTeam = (teamId: string) => {
    if (teams.length <= 1) {
      return; // Don't remove the last team
    }
    setTeams((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
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
      {teamsData?.owned.map((team) => (
        <Card data-slot="card" key={team.id}>
          <CardHeader data-slot="card-header" className="relative">
            <CardTitle data-slot="card-title">
              {team.name ? `Team ${team.name}` : "Team"}
            </CardTitle>
            {teamsData?.owned.length > 1 && (
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
                    Function
                    <span className="text-sm font-normal text-foreground-weak">
                      (# actions) {JSON.stringify(team.teamFunction)}
                    </span>
                  </h3>
                  <div className="space-y-4">
                    {selectedCategoryIds
                      .filter((categoryId) => {
                        // Filter out general responsibility categories
                        const categoryName = getCategoryNameById(categoryId);
                        return !MANDATORY_CATEGORIES.includes(categoryName);
                      })
                      .map((categoryId) => {
                        const categoryName = getCategoryNameById(categoryId);
                        const isChecked = (selectedCategoryIds || []).includes(
                          categoryId
                        );

                        return (
                          <div
                            key={`${team.id}-${categoryId}`}
                            className="flex items-center gap-2 group"
                          >
                            {/* {JSON.stringify(selectedCategoryIds)} */}
                            <Checkbox
                              id={`${team.id}-category-${categoryId}`}
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                // Direct onCheckedChange handler
                                if (typeof checked === "boolean") {
                                  handleCategoryToggle(
                                    team.id,
                                    categoryId,
                                    checked
                                  );
                                }
                              }}
                            />
                            <Label
                              data-slot="label"
                              htmlFor={`${team.id}-category-${categoryId}`}
                              className="cursor-pointer flex-1"
                              onClick={(e) => {
                                e.preventDefault();
                                handleCategoryToggle(
                                  team.id,
                                  categoryId,
                                  !isChecked
                                );
                              }}
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
    </div>
  );
};

export default TeamSetup;
