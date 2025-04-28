// hooks/useSetupValidation.ts
import { useMemo } from 'react';
import { useConfigStore } from '@/store/config-store';
import { useTeams } from '@/store/team-store';

export interface SetupStatus {
  hasOrganization: boolean;
  hasActivities: boolean;
  hasTeams: boolean;
  isComplete: boolean;
}

/**
 * Hook to check if the user has completed onboarding
 * Can be used in components to determine whether to redirect or show specific UI
 */
export function useSetupValidation(): SetupStatus {
  // Get configuration from store
  const config = useConfigStore(state => state.config);
  
  // Get teams data
  const { data: teams = [] } = useTeams();
  
  // Calculate status values
  const hasOrganization = Boolean(config.organization?.name?.trim());
  
  const hasActivities = Object.values(config.activities?.selectedByCategory || {})
    .some(actions => Array.isArray(actions) && actions.length > 0);
  
  const hasTeams = teams.length > 0;
  
  // Determine if setup is complete
  const isComplete = hasOrganization && hasActivities && hasTeams;
  
  // Return memoized status object
  return useMemo(() => ({
    hasOrganization,
    hasActivities,
    hasTeams,
    isComplete
  }), [hasOrganization, hasActivities, hasTeams]);
}

/**
 * Utility function for checking setup status from localStorage or cookies
 * Can be used in middleware or other server contexts
 */
export function validateSetupFromState(setupState: any): SetupStatus {
  const hasOrganization = Boolean(setupState?.organizationName);
  const hasActivities = Boolean(setupState?.hasActivities);
  const hasTeams = Boolean(setupState?.hasTeams);
  const isComplete = hasOrganization && hasActivities && hasTeams;
  
  return {
    hasOrganization,
    hasActivities,
    hasTeams,
    isComplete
  };
}