// src/store/setup-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { QueryClient } from "@tanstack/react-query";
import { useOrgStore, useOrgSetup, OrgSetupResponse } from "./org-store";

const queryClient = new QueryClient();

// Helper function to determine setup steps based on API response
const determineSetupSteps = (
  organizations: OrgSetupResponse["data"]["organizations"]
): SetupSteps => {
  // Default all steps to false
  const steps: SetupSteps = {
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
  };

  // Check if we have any organizations
  const hasOrgs = organizations && organizations.length > 0;
  if (hasOrgs) {
    steps.initialSetup = true;
    steps.organization = true;

    // Get the first organization
    const org = organizations[0];

    // Check if org has teams
    const hasTeams = org?.teams && org.teams.length > 0;
    if (hasTeams) {
      steps.teams = true;
      steps.createTeam = true;

      // Check if teams have members
      const hasMembers = org.teams.some(
        (team) => team.teamMembers && team.teamMembers.length > 0
      );
      if (hasMembers) {
        steps.members = true;
      }

      // We can assume other steps based on business logic
      // For example, if teams exist, we might consider globalActions as complete
      steps.globalActions = true;
    }

    // Determine if onboarding is complete by checking critical steps
    steps.onboardingComplete =
      steps.organization && steps.teams && steps.members;
  }

  return steps;
};

// Hook for setup state that derives from org data
export function useOrgSetupForSetup() {
  const setSteps = useSetupStore((state) => state.setAllSteps);
  const organizations = useOrgStore((state) => state.organizations);
  const orgQuery = useOrgSetup();

  useEffect(() => {
    if (organizations && organizations.length > 0) {
      const steps = determineSetupSteps(organizations);
      setSteps(steps);
    }
  }, [organizations, setSteps]);

  return orgQuery;
}

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
  addActivities: boolean;
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
  setSteps: (stepsToUpdate: SetupStepsSubset) => void;
  setAllSteps: (steps: SetupSteps) => void;
  refreshOrgSetup: () => void;
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
        addActivities: false,
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

      setSteps: (stepsToUpdate) =>
        set((state) => ({
          steps: {
            ...state.steps,
            ...stepsToUpdate,
          },
        })),

      setAllSteps: (steps: SetupSteps) => set({ steps }),

      refreshOrgSetup: () => {
        // Now this uses the refreshOrgData from the org store
        useOrgStore.getState().refreshOrgData();
      },
    }),
    {
      name: "setup-store",
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
