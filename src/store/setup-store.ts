// src/store/setup-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { useEffect } from "react";

// Define the shape of our setup steps
export interface SetupSteps {
  initialSetup: boolean;
  organization: boolean;
  globalActions: boolean;
  functionActions: boolean;
  members: boolean;
  teams: boolean;
  summary: boolean;
  createTeam: boolean;
  configureTeamActivities: boolean;
  addActivities: boolean; // Added to match the expected structure
  onboardingComplete: boolean;
}

// Subset of steps that can be updated via setSteps
export interface SetupStepsSubset {
  addActivities?: boolean;
  createTeam?: boolean;
  configureTeamActivities?: boolean;
}

export interface SetupState {
  steps: SetupSteps;
  completeStep: (step: keyof SetupSteps) => void;
  resetStep: (step: keyof SetupSteps) => void;
  completeSetup: () => void;
  resetSetup: () => void;
  isSetupComplete: () => boolean;
  setSteps: (stepsToUpdate: SetupStepsSubset) => void; // Add this method
}

// Create the setup store with persistence
export const useSetupStore = create<SetupState>()(
  persist(
    (set, get) => ({
      steps: {
        initialSetup: false,
        organization: false,
        globalActions: false,
        functionActions: false,
        members: false,
        teams: false,
        summary: false,
        createTeam: false,
        configureTeamActivities: false,
        addActivities: false, // Initialize the new property
        onboardingComplete: false,
      },

      completeStep: (step) =>
        set((state) => ({
          steps: {
            ...state.steps,
            [step]: true,
          },
        })),

      resetStep: (step) =>
        set((state) => ({
          steps: {
            ...state.steps,
            [step]: false,
          },
        })),

      completeSetup: () =>
        set((state) => ({
          steps: {
            ...state.steps,
            onboardingComplete: true,
          },
        })),

      resetSetup: () =>
        set({
          steps: {
            initialSetup: false,
            organization: false,
            globalActions: false,
            functionActions: false,
            members: false,
            teams: false,
            summary: false,
            createTeam: false,
            configureTeamActivities: false,
            addActivities: false,
            onboardingComplete: false,
          },
        }),

      isSetupComplete: () => {
        const { steps } = get();
        return steps.onboardingComplete;
      },

      // Add the setSteps method that takes a partial steps object and merges it
      setSteps: (stepsToUpdate) =>
        set((state) => ({
          steps: {
            ...state.steps,
            ...stepsToUpdate,
          },
        })),
    }),
    {
      name: "setup-store", // Storage key
    }
  )
);

// Helper hook to sync setup state to cookies for middleware usage
export function useSetupStateSync() {
  const { steps, isSetupComplete } = useSetupStore();

  // Update cookie whenever setup state changes
  useEffect(() => {
    const setupComplete = isSetupComplete();
    Cookies.set("onboarding-complete", setupComplete ? "true" : "false", {
      expires: 365, // 1 year
      path: "/",
      sameSite: "strict",
    });
  }, [steps, isSetupComplete]);

  return null;
}
