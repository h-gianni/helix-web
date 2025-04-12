// src/hooks/useSetupProgress.ts
import { useSetupStore } from '@/store/setup-store';
import { useEffect } from 'react';

export const useSetupProgress = () => {
  const { setSteps } = useSetupStore();
  
  // Get setup state from localStorage instead of fetching directly
  let setupData = { 
    hasTeams: false, 
    hasPerformers: false 
  };
  
  // Only run in browser
  if (typeof window !== 'undefined') {
    try {
      const storedState = localStorage.getItem('setup-state');
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        setupData = {
          hasTeams: parsedState.hasTeams || false,
          hasPerformers: parsedState.hasPerformers || false
        };
      }
    } catch (e) {
      console.error('Failed to parse setup state', e);
    }
  }
  
  useEffect(() => {
    setSteps({
      addActivities: setupData.hasTeams, // Step 1
      createTeam: setupData.hasTeams,    // Step 2
      configureTeamActivities: setupData.hasPerformers // Step 3
    });
  }, [setupData.hasTeams, setupData.hasPerformers, setSteps]);

  return {
    currentStep: !setupData.hasTeams ? 1 : !setupData.hasPerformers ? 3 : 4,
    showMainDashboard: setupData.hasTeams
  };
};