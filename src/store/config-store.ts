// data/config-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Configuration, ConfigStore } from "./config-types";

const defaultConfig: Configuration = {
  organization: {
    name: "",
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

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      config: defaultConfig,
      setConfig: (config) => set({ config }),
      updateOrganization: (name: string) =>
        set((state) => ({
          config: {
            ...state.config,
            organization: { name },
          },
        })),
      updateActivities: (activities: string[]) =>
        set((state) => {
          console.log("updateActivities", activities);
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

          console.log(
            "updateActivitiesByCategory",
            updatedSelected,
            updatedSelectedByCategory
          );

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
