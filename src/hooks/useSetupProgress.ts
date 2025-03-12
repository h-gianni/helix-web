// src/hooks/useSetupProgress.ts
import { useTeams } from "@/store/team-store";
import { usePerformers } from "@/store/performers-store";
import { useSetupStore } from '@/store/setup-store';
import { useEffect } from 'react';

// src/hooks/useSetupProgress.ts
export const useSetupProgress = () => {
    const { data: teams = [] } = useTeams();
    const { data: performers = [] } = usePerformers();
    const { setSteps } = useSetupStore();
  
    useEffect(() => {
      console.log('teams-------------', teams)
      setSteps({
        addActivities: teams.length > 0, // Step 1 complete if teams exist
        createTeam: teams.length > 0,    // Step 2 complete if teams exist
        configureTeamActivities: performers.length > 0 // Step 3 complete if members exist
      });
    }, [teams.length, performers.length, setSteps]);
  
    return {
      currentStep: teams.length === 0 ? 1 : performers.length === 0 ? 3 : 4,
      showMainDashboard: teams.length > 0
    };
  };