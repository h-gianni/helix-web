// data/config-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Configuration, ConfigStore } from './config-types';

const defaultConfig: Configuration = {
  organization: {
    name: '',
  },
  activities: {
    selected: [],
    favorites: {} as Record<string, string[]>,
    hidden: {} as Record<string, string[]>
  },
  teams: [],
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
        set((state) => ({
          config: {
            ...state.config,
            activities: { 
              ...state.config.activities,
              selected: activities 
            },
          },
        })),
      updateFavorites: (category: string, activities: string[]) =>
        set((state) => ({
          config: {
            ...state.config,
            activities: {
              ...state.config.activities,
              favorites: {
                ...state.config.activities.favorites,
                [category]: activities
              }
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
                [category]: activities
              }
            },
          },
        })),
      updateTeams: (teams: Configuration['teams']) =>
        set((state) => ({
          config: {
            ...state.config,
            teams,
          },
        })),
    }),
    {
      name: 'app-configuration',
    }
  )
);