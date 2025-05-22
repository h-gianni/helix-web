// data/config-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Configuration } from "./config-types";
import { apiClient } from "@/lib/api/api-client";
import type { ApiResponse } from "@/lib/types/api";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ActionCategory } from "@/lib/types/api/action";
import { useActions, MANDATORY_CATEGORIES } from "@/store/action-store";
import { useFavoritesStore, useToggleFavorite, useFavorites } from "@/store/favorites-store";

// Update Configuration type to include actions
interface ExtendedConfiguration extends Configuration {
  actions: ActionCategory[];
}

const defaultConfig: ExtendedConfiguration = {
  organization: {
    name: "",
    siteDomain: "",
  },
  activities: {
    selected: [],
    selectedByCategory: {},
    favorites: {} as Record<string, string[]>,
    hidden: {} as Record<string, string[]>,
  },
  teams: [],
  teamActions: [],
  teamMembers: [],
  selectedActionCategory: [],
  actions: [] // Add default empty actions array
};

// Helper function to extract unique category IDs from team actions
function extractCategoryIds(teamActions: {id: string;
  name: string;
  description: string;
  categoryId?: string;
  isEnabled: boolean;}[]): string[] {
  if (!Array.isArray(teamActions)) return [];
  
  // Create a Set to ensure uniqueness
  const categoryIdsSet = new Set<string>();
  
  teamActions.forEach(action => {
    if (action && action.categoryId && typeof action.categoryId === 'string') {
      categoryIdsSet.add(action.categoryId);
    } else if (action && action.categoryId && typeof action.categoryId === 'object' && action.categoryId) {
      categoryIdsSet.add(action.categoryId);
    }
  });
  
  return Array.from(categoryIdsSet);
}

// React Query mutation hook for organization name
export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  const updateOrgInStore = useConfigStore((state) => state.updateOrganization);

  return useMutation({
    mutationFn: async (organization: { name: string; siteDomain: string }) => {
      try {
        // Check if organization exists
        const checkResponse = await apiClient.get<ApiResponse<{ id: string; name: string; siteDomain: string }>>("/org/name");
        
        // If GET succeeds, organization exists - use PATCH
        if (checkResponse.data.success) {
          const response = await apiClient.patch<ApiResponse<{ id: string; name: string; siteDomain: string }>>(
            "/org/name",
            organization
          );
          if (!response.data.success) {
            throw new Error(response.data.error || "Failed to update organization name");
          }
          return response.data.data;
        }
      } catch (error) {
        // If GET fails with 404, organization doesn't exist - use POST
        if (error instanceof Error && error.message.includes("404")) {
          const response = await apiClient.post<ApiResponse<{ id: string; name: string; siteDomain: string }>>(
            "/org/name",
            organization
          );
          if (!response.data.success) {
            throw new Error(response.data.error || "Failed to create organization name");
          }
          return response.data.data;
        }
        // If any other error, throw it
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Organization update success data:', data);
      // Update Zustand store with the ID from the response
      if (data) {
        updateOrgInStore({
          name: data.name,
          siteDomain: data.siteDomain,
          id: data.id
        });
      }
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["organization"] });
    },
  });
};

// React Query mutation hook for global functions
export const useUpdateGlobalFunctions = () => {
  const queryClient = useQueryClient();
  const updateGlobalFunctionsInStore = useConfigStore((state) => state.updateGlobalFunctions);

  return useMutation({
    mutationFn: async ({ functions, orgId }: { functions: { id: string; name: string; description: string; isEnabled: boolean }[], orgId: string }) => {
      const uniqueFunctions = Array.from(
        new Map(functions.map(f => [f.id, f])).values()
      );

      const actions = uniqueFunctions.map(func => ({
        actionId: func.id,
        status: func.isEnabled ? "ACTIVE" : "ARCHIVED"
      }));

      const response = await apiClient.post<ApiResponse<{ actions: any[] }>>(
        "/org/actions",
        {
          orgId,
          actions
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to update global functions");
      }

      // Update the store with the response data
      updateGlobalFunctionsInStore(uniqueFunctions);

      return response.data.data;
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["global-functions"] });
      queryClient.invalidateQueries({ queryKey: ["org-actions"] });
    },
  });
};

// React Query hook for fetching global functions
export const useGlobalFunctions = (orgId: string) => {
  return useQuery({
    queryKey: ["global-functions", orgId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<{ actions: any[] }>>(
        `/org/actions?orgId=${orgId}`
      );
      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to fetch global functions");
      }
      if (!response.data.data?.actions) {
        throw new Error("No actions data received");
      }
      return response.data.data.actions;
    },
    staleTime: Infinity, // Prevent refetching
  });
};

// React Query mutation hook for team actions
export const useUpdateTeamActions = () => {
  const queryClient = useQueryClient();

  const updateTeamActionsInStore = useConfigStore((state) => state.updateTeamActions);
  //const globalFunctions = useConfigStore((state) => state.config.globalFunctions || []);
  const globalFunctions = useConfigStore((state) => state.config.activities.selected || []);

  return useMutation({
    mutationFn: async ({ functions, orgId }: { functions: { id: string; name: string; description: string; isEnabled: boolean }[], orgId: string }) => {
      // First update local store
      updateTeamActionsInStore(functions);

      // Get all actions with their categories
      const actionsResponse = await apiClient.get<ApiResponse<{ actions: any[] }>>(
        `/org/actions?orgId=${orgId}`
      );

      if (!actionsResponse.data.success || !actionsResponse.data.data) {
        throw new Error("Failed to fetch actions");
      }

      const actionsWithCategories = actionsResponse.data.data.actions;

      // Create a Map to deduplicate actions by actionId
      const actionMap = new Map<string, { actionId: string; status: string }>();

      // Add global actions
      globalFunctions.forEach(func => {
        actionMap.set(func.id, {
          actionId: func.id,
          status: func.isEnabled ? "ACTIVE" : "ARCHIVED"
        });
      });

      // Add function actions (will override global actions if same ID)
      functions.forEach(func => {
        actionMap.set(func.id, {
          actionId: func.id,
          status: func.isEnabled ? "ACTIVE" : "ARCHIVED"
        });
      });

      // Convert Map values to array
      const uniqueActions = Array.from(actionMap.values());

      // Then push to database
      const response = await apiClient.post<ApiResponse<{ actions: any[] }>>(
        "/org/actions",
        {
          orgId,
          actions: uniqueActions
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to update function actions");
      }
      return response.data.data;
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["org-actions"] });
    },
  });
};

// React Query hook for fetching organization data
export const useOrganizationData = () => {
  const updateOrgInStore = useConfigStore((state) => state.updateOrganization);

  return useQuery({
    queryKey: ["organization"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<{ id: string; name: string; siteDomain: string }>>("/org/name");
      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to fetch organization data");
      }
      
      // Update Zustand store with fetched data
      if (response.data.data) {
        updateOrgInStore({
          name: response.data.data.name,
          siteDomain: response.data.data.siteDomain,
          id: response.data.data.id
        });
      }
      
      return response.data.data;
    },
  });
};

// React Query hook for fetching team actions
export const useTeamActions = (orgId: string) => {
  return useQuery({
    queryKey: ["team-actions", orgId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<{ actions: any[] }>>(
        `/org/team-actions/?orgId=${orgId}`
      );
      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to fetch team actions");
      }
      if (!response.data.data?.actions) {
        throw new Error("No team actions data received");
      }
      return response.data.data.actions;
    },
  });
};

// React Query mutation hook for team members
export const useUpdateTeamMembers = () => {
  const queryClient = useQueryClient();
  const updateTeamMembersInStore = useConfigStore((state) => state.updateTeamMembers);
  
  // return useMutation({
  //   mutationFn: async ({ members, orgId }: { members: { id: string; fullName: string; email: string; jobTitle: string }[], orgId: string }) => {
  //     // First update in DB
  //     const response = await apiClient.post<ApiResponse<{ members: any[] }>>(
  //       "/org/members",
  //       {
  //         orgId,
  //         members
  //       }
  //     );

  //     if (!response.data.success) {
  //       throw new Error(response.data.error || "Failed to update team members");
  //     }

  //     // Then update local store
  //     updateTeamMembersInStore(members);
  //     return response.data.data;
  //   },
  //   onSuccess: (data) => {
  //     // Invalidate relevant queries
  //     queryClient.invalidateQueries({ queryKey: ["org-members"] });
  //   },
  // });
};

// React Query mutation hook for saving members to database
export const useSaveMembersToDatabase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ members, orgId }: { members: { fullName: string; email: string }[], orgId: string }) => {
      const response = await apiClient.post<ApiResponse<{ members: any[] }>>(
        "/org/members",
        {
          orgId,
          members: members.map(member => ({
            firstName: member.fullName.split(' ')[0],
            lastName: member.fullName.split(' ').slice(1).join(' '),
            email: member.email,
            status: 'ACTIVE',
            user: {
              connectOrCreate: {
                where: {
                  email: member.email
                },
                create: {
                  email: member.email,
                  name: member.fullName
                }
              }
            }
          })),
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to save members");
      }

      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["org-members"] });
    },
  });
};

// Add new mutation for storing global actions
export const useStoreGlobalActions = () => {
  const queryClient = useQueryClient();
  const configStore = useConfigStore();

  return useMutation({
    mutationFn: async () => {
      const selectedActivities = configStore.config.activities.selected;
      const orgId = configStore.config.organization.id;

      if (!orgId) {
        throw new Error("Organization ID is required");
      }

      // Transform selected activities into the required format
      const actions = selectedActivities.map(actionId => ({
        actionId,
        status: "ACTIVE"
      }));

      // Store in database
      const response = await apiClient.post<ApiResponse<{ actions: any[] }>>(
        "/org/actions",
        {
          orgId,
          actions
        }
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || "Failed to store global actions");
      }

      return response.data.data;
    },
    onSuccess: (data) => {
      if (!data?.actions) return;
      
      // Update the global functions in the store
      const globalFunctions = data.actions.map(action => ({
        id: action.actionId,
        name: action.name || action.actionId,
        description: action.description || "",
        isEnabled: action.status === "ACTIVE"
      }));

      // Update both Zustand store and localStorage
      configStore.updateGlobalFunctions(globalFunctions);

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["global-functions"] });
      queryClient.invalidateQueries({ queryKey: ["org-actions"] });
    },
  });
};

// Add a new function to sync selected activities with global functions
export const useSyncSelectedActivitiesWithGlobalFunctions = () => {
  const configStore = useConfigStore();
  const storeGlobalActions = useStoreGlobalActions();

  const syncActivities = async () => {
    try {
      await storeGlobalActions.mutateAsync();
    } catch (error) {
      console.error("Failed to sync activities with global functions:", error);
      throw error;
    }
  };

  return {
    syncActivities,
    isLoading: storeGlobalActions.isPending,
    error: storeGlobalActions.error
  };
};

// Add new types for action selection
interface ActionSelectionState {
  hasPreselected: boolean;
  hasInteracted: boolean;
  filteredCategories: ActionCategory[];
}

interface ActionSelectionOptions {
  minRequired?: number;
  autoSelect?: boolean;
  showMandatoryOnly?: boolean;
}

// Update ConfigStore interface with ExtendedConfiguration
export interface ConfigStore {
  isHydrated: boolean;
  setHydrated: (state: boolean) => void;
  config: ExtendedConfiguration;
  setConfig: (config: ExtendedConfiguration) => void;
  updateOrganization: (organization: Configuration["organization"]) => void;
  updateGlobalFunctions: (functions: Configuration["globalFunctions"]) => void;
  updateTeamActions: (functions: Configuration["teamActions"]) => void;
  updateActivities: (activities: string[]) => void;
  updateActivitiesByCategory: (categoryId: string, activities: string[]) => void;
  updateFavorites: (category: string, activities: string[]) => void;
  updateHidden: (category: string, activities: string[]) => void;
  updateTeams: (teams: Configuration["teams"]) => void;
  updateTeamMembers: (teamMembers: Configuration["teamMembers"]) => void;
  updateSelectedActionCategory: (categoryIds: string[]) => void; // Add this new function
  syncSelectedActivitiesWithGlobalFunctions: () => Promise<void>;
  actionSelection: ActionSelectionState;
  setHasPreselected: (value: boolean) => void;
  setHasInteracted: (value: boolean) => void;
  setFilteredCategories: (categories: ActionCategory[]) => void;
  getFilteredCategories: () => ActionCategory[];
  countSelectedActionsByType: (options: ActionSelectionOptions) => number;
  canContinue: (options: ActionSelectionOptions) => boolean;
  autoSelectActions: (options: ActionSelectionOptions) => void;
}

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set, get) => ({
      isHydrated: false,
      setHydrated: (state) => set({ isHydrated: state }),
      config: defaultConfig,
      setConfig: (config) => set({ config }),
      updateOrganization: (organization) => set((state) => ({
        config: {
          ...state.config,
          organization,
        },
      })),
      updateGlobalFunctions: (functions) => set((state) => ({
        config: {
          ...state.config,
          globalFunctions: functions,
        },
      })),
      updateTeamActions: (teamActions) => {
        console.log('Updating team actions:', teamActions);
        if(!Array.isArray(teamActions)) {
          console.warn('Expected teamActions to be an array, got:', teamActions);
          teamActions = [];
        }
        
        // Extract unique category IDs from team actions
        const categoryIds = extractCategoryIds(teamActions);
        
        set((state) => ({
          config: { 
            ...state.config, 
            teamActions,
            selectedActionCategory: categoryIds // Update selectedActionCategory when teamActions changes
          },
        }));  
      },
      updateSelectedActionCategory: (categoryIds) => set((state) => ({
        config: {
          ...state.config,
          selectedActionCategory: categoryIds,
        },
      })),
      updateActivities: (activities) =>
        set((state) => {
          return {
            config: {
              ...state.config,
              activities: {
                ...state.config.activities,
                selected: activities,
              },
            },
          };
        }),
      updateActivitiesByCategory: (categoryId: string, activities: string[]) =>
        set((state) => {
          if (!categoryId) {
            console.error(
              "No categoryId provided to updateActivitiesByCategory"
            );
            return state; // Return state unchanged if no categoryId
          }

          // Get current selected activities and selected by category
          const selectedByCategory = { ...state.config.activities.selectedByCategory };
          
          // Update the category-specific selection
          selectedByCategory[categoryId] = activities;

          // Rebuild the global selected activities from all categories
          const allSelected = new Set<string>();
          Object.entries(selectedByCategory).forEach(([catId, categoryActivities]) => {
            // Only include activities from this category if they are in the current selection
            if (catId === categoryId) {
              activities.forEach(activity => allSelected.add(activity));
            } else {
              categoryActivities.forEach(activity => allSelected.add(activity));
            }
          });

          // Debug log
          console.log('Updating activities state:', {
            categoryId,
            newCategoryActivities: activities,
            newGlobalSelected: Array.from(allSelected),
            selectedByCategory
          });

          return {
            config: {
              ...state.config,
              activities: {
                ...state.config.activities,
                selected: Array.from(allSelected),
                selectedByCategory,
              },
              selectedActionCategory: activities.length > 0 
                ? [...new Set([...state.config.selectedActionCategory, categoryId])]
                : state.config.selectedActionCategory.filter(id => id !== categoryId)
            },
          };
        }),
      updateFavorites: (category: string, activities: string[]) =>
        set((state) => ({
          config: {
            ...state.config,
            activities: {
              ...state.config.activities,
              favorites: {
                ...state.config.activities.favorites,
                [category]: activities,
              },
            },
          },
        })),
      updateHidden: (category: string, activities: string[]) =>
        set((state) => ({
          config: {
            ...state.config,
            activities: {
              ...state.config.activities,
              hidden: {
                ...state.config.activities.hidden,
                [category]: activities,
              },
            },
          },
        })),
      updateTeams: (teams: Configuration["teams"]) =>
        set((state) => ({
          config: {
            ...state.config,
            teams,
          },
        })),
      updateTeamMembers: (teamMembers: Configuration["teamMembers"]) =>
        set((state) => ({
          config: {
            ...state.config,
            teamMembers,
          },
        })),
      syncSelectedActivitiesWithGlobalFunctions: async () => {
        const state = get();
        const selectedActivities = state.config.activities.selected;
        const orgId = state.config.organization.id;

        if (!orgId) {
          throw new Error("Organization ID is required");
        }

        try {
          const response = await apiClient.post<ApiResponse<{ actions: any[] }>>(
            "/org/actions",
            {
              orgId,
              actions: selectedActivities.map(actionId => ({
                actionId,
                status: "ACTIVE"
              }))
            }
          );

          if (!response.data.success || !response.data.data) {
            throw new Error(response.data.error || "Failed to sync activities");
          }

          // Update global functions in the store
          const globalFunctions = response.data.data.actions.map(action => ({
            id: action.actionId,
            name: action.name || action.actionId,
            description: action.description || "",
            isEnabled: action.status === "ACTIVE"
          }));

          set((state) => ({
            config: {
              ...state.config,
              globalFunctions
            }
          }));
        } catch (error) {
          console.error("Failed to sync activities:", error);
          throw error;
        }
      },
      actionSelection: {
        hasPreselected: false,
        hasInteracted: false,
        filteredCategories: [],
      },
      setHasPreselected: (value: boolean) => 
        set(state => ({
          actionSelection: {
            ...state.actionSelection,
            hasPreselected: value
          }
        })),
      setHasInteracted: (value: boolean) => 
        set(state => ({
          actionSelection: {
            ...state.actionSelection,
            hasInteracted: value
          }
        })),
      setFilteredCategories: (categories: ActionCategory[]) =>
        set(state => ({
          actionSelection: {
            ...state.actionSelection,
            filteredCategories: categories
          }
        })),
      getFilteredCategories: () => {
        const state = get();
        const allCategories = state.config.actions || [];
        
        return allCategories.filter(category => 
          !MANDATORY_CATEGORIES.includes(category.name)
        );
      },
      countSelectedActionsByType: ({  minRequired = 0 }) => {
        const state = get();
        const filteredCategories = state.getFilteredCategories();
        const selectedByCategory = state.config.activities.selectedByCategory;

        if (!filteredCategories.length) return 0;
        
        return filteredCategories.reduce((count, category) => {
          const selected = selectedByCategory[category.id]?.length || 0;
          return selected > 0 ? count + 1 : count;
        }, 0);
      },
      canContinue: ({ minRequired = 0 }) => {

        const state = get();
        const allCategories = state.config.actions || [];
        const selectedByCategory = state.config.activities.selectedByCategory;


        console.log('Checking if we can continue:', {
          minRequired,
          allCategories: state.config.actions,
          selectedByCategory: state.config.activities.selectedByCategory
        });


        // if (!allCategories.length) return false;
        
        // For mandatory categories, ensure each has minimum required selections
        // const mandatoryCategories = allCategories.filter(category => 
        //   MANDATORY_CATEGORIES.includes(category.name)
        // );

        const mandatoryCategories = state.config.activities.selectedByCategory

        console.log('Mandatory categories:', state.config.activities.selectedByCategory, selectedByCategory);

        const categoryResult = Object.keys(mandatoryCategories).every(category => {
          const selectedCount = selectedByCategory[category]?.length || 0;
          return selectedCount >= minRequired;
        });

        console.log('Category result:', categoryResult);

        

        return categoryResult;
      },
      autoSelectActions: ({  minRequired = 0, autoSelect = false }) => {
        const state = get();
        if (!autoSelect || state.actionSelection.hasPreselected) return;

        const targetCategories = state.getFilteredCategories();
        
        if (targetCategories.length > 0) {
          let allActions: string[] = [];
          
          targetCategories.forEach(category => {
        
              const categoryActions = category.actions.map(action => action.id);
              const actionsToSelect = categoryActions.slice(
                0, 
                Math.min(categoryActions.length, minRequired)
              );
              
              allActions = [...allActions, ...actionsToSelect];
              
              if (actionsToSelect.length > 0) {
                state.updateActivitiesByCategory(category.id, actionsToSelect);
              }
            
          });
          
          if (allActions.length > 0) {
            state.updateActivities(allActions);
            state.setHasPreselected(true);
            state.setHasInteracted(true);
          }
        }
      }
    }),
    {
      name: "app-configuration",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
          
          // Ensure critical arrays exist
          if (!state.config.teamActions) {
            state.updateTeamActions([]);  
          }
          
          // If selectedActionCategory doesn't exist, initialize it
          if (!state.config.selectedActionCategory) {
            state.config.selectedActionCategory = [];
            
            // Extract category IDs from existing team actions if available
            if (Array.isArray(state.config.teamActions) && state.config.teamActions.length > 0) {
              state.updateSelectedActionCategory(extractCategoryIds(state.config.teamActions));
            }
          }
        }
      }
    }
  )
);

// Create a new hook that combines the functionality
export function useActionsSelection(options: ActionSelectionOptions) {
  const store = useConfigStore();
  const selectedActivities = store.config.activities.selected;
  const selectedByCategory = store.config.activities.selectedByCategory;
  const updateActivities = store.updateActivities;
  const updateActivitiesByCategory = store.updateActivitiesByCategory;
  const actionSelection = store.actionSelection;
  const setHasInteracted = store.setHasInteracted;
  const countSelectedActionsByType = store.countSelectedActionsByType;
  const canContinue = store.canContinue;
  const autoSelectActions = store.autoSelectActions;

  const { data: actionCategories, isLoading: isLoadingActions } = useActions();
  const { isLoading: isFavoritesLoading } = useFavorites();
  const toggleFavorite = useToggleFavorite();
  const isFavorite = useFavoritesStore(state => state.isFavorite);

  // Filter categories based on showMandatoryOnly flag
  useEffect(() => {
    if (actionCategories && actionCategories.length > 0) {
      const filteredCats = options.showMandatoryOnly
        ? actionCategories.filter(category => MANDATORY_CATEGORIES.includes(category.name))
        : actionCategories.filter(category => !MANDATORY_CATEGORIES.includes(category.name));
      
      useConfigStore.getState().setFilteredCategories(filteredCats);
    }
  }, [actionCategories, options.showMandatoryOnly]);

  // Handle auto-selection
  useEffect(() => {
    if (actionCategories && actionCategories.length > 0) {
      autoSelectActions(options);
    }
  }, [actionCategories, options, autoSelectActions]);

  return {
    selectedActivities,
    selectedByCategory,
    updateActivities,
    updateActivitiesByCategory,
    filteredCategories: actionSelection.filteredCategories,
    isLoading: isLoadingActions || isFavoritesLoading,
    isFavorite,
    toggleFavorite,
    hasInteracted: actionSelection.hasInteracted,
    setHasInteracted,
    countSelectedActionsByType: () => countSelectedActionsByType(options),
    canContinue: () => canContinue(options)
  };
}