// src/hooks/useSetupProgress.ts
import { useSetupStore, SetupStepsSubset } from "@/store/setup-store";
import { useEffect, useState } from "react";

export const useSetupProgress = () => {
  const { steps, setSteps } = useSetupStore();
  const [setupData, setSetupData] = useState({
    hasTeams: false,
    hasPerformers: false,
  });

  // Load setup data from localStorage on initial render (client-side only)
  useEffect(() => {
    // Only run in browser
    if (typeof window !== "undefined") {
      try {
        const storedState = localStorage.getItem("setup-state");
        if (storedState) {
          const parsedState = JSON.parse(storedState);
          setSetupData({
            hasTeams: parsedState.hasTeams || false,
            hasPerformers: parsedState.hasPerformers || false,
          });
        }
      } catch (e) {
        console.error("Failed to parse setup state", e);
      }
    }
  }, []);

  // Update steps whenever setupData changes
  useEffect(() => {
    const stepsToUpdate: SetupStepsSubset = {
      addActivities: setupData.hasTeams, // Step 1
      createTeam: setupData.hasTeams, // Step 2
      configureTeamActivities: setupData.hasPerformers, // Step 3
    };

    setSteps(stepsToUpdate);
  }, [setupData.hasTeams, setupData.hasPerformers, setSteps]);

  return {
    currentStep: !setupData.hasTeams ? 1 : !setupData.hasPerformers ? 3 : 4,
    showMainDashboard: steps.onboardingComplete, // Use store value as fallback
  };
};
