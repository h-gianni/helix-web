// data/config-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Configuration, ConfigStore } from "./config-types";
import { apiClient } from "@/lib/api/api-client";
import type { ApiResponse } from "@/lib/types/api";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

const defaultConfig: Configuration = {
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
  teamMembers: [], // Add the teamMembers array property
};

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
      // Then push to database
      const response = await apiClient.post<ApiResponse<{ actions: any[] }>>(
        "/org/actions",
        {
          orgId,
          actions: uniqueFunctions.map(func => ({
            actionId: func.id,
            status: func.isEnabled ? "ACTIVE" : "ARCHIVED"
          }))
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to update global functions");
      }
      return response.data.data;
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["global-functions"] });
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
  });
};

// React Query mutation hook for team actions
export const useUpdateTeamActions = () => {
  const queryClient = useQueryClient();
  const updateTeamActionsInStore = useConfigStore((state) => state.updateTeamActions);
  const globalFunctions = useConfigStore((state) => state.config.globalFunctions || []);

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

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
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
      updateTeamActions: (functions) => set((state) => ({
        config: {
          ...state.config,
          teamActions: functions,
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
      // New function to update activities by category
      // New function to update activities by category
      updateActivitiesByCategory: (categoryId: string, activities: string[]) =>
        set((state) => {
          if (!categoryId) {
            console.error(
              "No categoryId provided to updateActivitiesByCategory"
            );
            return state; // Return state unchanged if no categoryId
          }

          // Get current selected activities
          const currentSelected = [...state.config.activities.selected];

          // Safely get current activities for this category
          const selectedByCategory =
            state.config.activities.selectedByCategory || {};
          const currentCategoryActivities =
            selectedByCategory[categoryId] || [];

          // Determine which activities to add and which to remove
          const activitiesToRemove = currentCategoryActivities.filter(
            (id) => !activities.includes(id)
          );
          const activitiesToAdd = activities.filter(
            (id) => !currentCategoryActivities.includes(id)
          );

          // Update the global selected activities list
          const updatedSelected = currentSelected
            .filter((id) => !activitiesToRemove.includes(id))
            .concat(activitiesToAdd);

          // Create a new selectedByCategory object with the updated activities
          const updatedSelectedByCategory = {
            ...selectedByCategory,
            [categoryId]: activities,
          };


          return {
            config: {
              ...state.config,
              activities: {
                ...state.config.activities,
                selected: updatedSelected,
                selectedByCategory: updatedSelectedByCategory,
              },
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
    }),
    {
      name: "app-configuration",
    }
  )
);
