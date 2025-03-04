// src/store/setup-store.ts
import { create } from 'zustand';

interface SetupState {
  steps: {
    addActivities: boolean;
    createTeam: boolean;
    configureTeamActivities: boolean;
  };
  setSteps: (steps: {
    addActivities: boolean;
    createTeam: boolean;
    configureTeamActivities: boolean;
  }) => void;
  currentStep: number;
  isActivityModalOpen: boolean;
  toggleActivityModal: () => void;
  completeStep: (step: keyof SetupState['steps']) => void;
  completeSetup: () => void;
}

export const useSetupStore = create<SetupState>((set) => ({
  steps: {
    addActivities: false,
    createTeam: false,
    configureTeamActivities: false
  },
  currentStep: 1,
  isActivityModalOpen: false,
  setSteps: (steps) => set({ steps }),
  toggleActivityModal: () => set((state) => ({ isActivityModalOpen: !state.isActivityModalOpen })),
  completeStep: (step) => set((state) => ({
    steps: { ...state.steps, [step]: true },
    currentStep: state.currentStep + 1
  })),
  completeSetup: () => set((state) => {
    console.log('setup complete store')
    return ({
 
  
      steps: { ...state.steps, configureTeamActivities: true }
    })
  })
}));