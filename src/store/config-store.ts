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
  },
  teams: [],
};

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      config: defaultConfig,
      setConfig: (config) => set({ config }),
      updateOrganization: (name) =>
        set((state) => ({
          config: {
            ...state.config,
            organization: { name },
          },
        })),
      updateActivities: (activities) =>
        set((state) => ({
          config: {
            ...state.config,
            activities: { selected: activities },
          },
        })),
      updateTeams: (teams) =>
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