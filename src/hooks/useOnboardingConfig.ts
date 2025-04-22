// hooks/useOnboardingConfig.ts

import { useCallback, useMemo } from "react";
import { useConfigStore } from "@/store/config-store";
import { useRouter } from "next/navigation";

export interface OnboardingStepValidation {
  organisation: () => boolean;
  globalActions: () => boolean;
  functionActions: () => boolean;
  members: () => boolean;
  teams: () => boolean;
  summary: () => boolean;
}

export function useOnboardingConfig() {
  const router = useRouter();
  const config = useConfigStore((state) => state.config);
  const updateOrganization = useConfigStore(
    (state) => state.updateOrganization
  );
  const updateActivities = useConfigStore((state) => state.updateActivities);
  const updateActivitiesByCategory = useConfigStore(
    (state) => state.updateActivitiesByCategory
  );
  const updateTeams = useConfigStore((state) => state.updateTeams);
  const updateTeamMembers = useConfigStore((state) => state.updateTeamMembers);

  // Define individual validation functions first
  const isOrganisationComplete = useCallback(() => {
    return Boolean(config.organization.name.trim());
  }, [config.organization.name]);

  const isGlobalActionsComplete = useCallback(() => {
    const selectedByCategory = config.activities.selectedByCategory || {};
    // Check if mandatory categories have the minimum required selections
    return Object.entries(selectedByCategory).some(
      ([_, actions]) => actions.length >= 3
    );
  }, [config.activities.selectedByCategory]);

  const isFunctionActionsComplete = useCallback(() => {
    const selectedByCategory = config.activities.selectedByCategory || {};
    // Check if at least one function has actions selected
    return Object.entries(selectedByCategory).some(
      ([_, actions]) => actions.length > 0
    );
  }, [config.activities.selectedByCategory]);

  const isMembersComplete = useCallback(() => {
    // Check if there are team members in the config
    return config.teamMembers && config.teamMembers.length > 0;
  }, [config.teamMembers]);

  const isTeamsComplete = useCallback(() => {
    return (
      config.teams &&
      config.teams.length > 0 &&
      config.teams.every(
        (team) => team.name.trim() !== "" && (team.categories?.length || 0) > 0
      )
    );
  }, [config.teams]);

  // Now create the combined object with all validation functions
  const isStepComplete = useMemo<OnboardingStepValidation>(
    () => ({
      organisation: isOrganisationComplete,
      globalActions: isGlobalActionsComplete,
      functionActions: isFunctionActionsComplete,
      members: isMembersComplete,
      teams: isTeamsComplete,
      summary: () => {
        // All steps must be complete to continue from summary
        return (
          isOrganisationComplete() &&
          isGlobalActionsComplete() &&
          isFunctionActionsComplete() &&
          isMembersComplete() &&
          isTeamsComplete()
        );
      },
    }),
    [
      isOrganisationComplete,
      isGlobalActionsComplete,
      isFunctionActionsComplete,
      isMembersComplete,
      isTeamsComplete,
    ]
  );

  // Get the next incomplete step
  const getNextIncompleteStep = useCallback(() => {
    if (!isOrganisationComplete()) {
      return "/dashboard/onboarding/organisation";
    }
    if (!isGlobalActionsComplete()) {
      return "/dashboard/onboarding/global-actions";
    }
    if (!isFunctionActionsComplete()) {
      return "/dashboard/onboarding/function-actions";
    }
    if (!isMembersComplete()) {
      return "/dashboard/onboarding/members";
    }
    if (!isTeamsComplete()) {
      return "/dashboard/onboarding/teams";
    }
    return "/dashboard/onboarding/summary";
  }, [
    isOrganisationComplete,
    isGlobalActionsComplete,
    isFunctionActionsComplete,
    isMembersComplete,
    isTeamsComplete,
  ]);

  // Navigate to the next incomplete step
  const navigateToNextIncompleteStep = useCallback(() => {
    const nextPath = getNextIncompleteStep();
    router.push(nextPath);
  }, [getNextIncompleteStep, router]);

  // Navigate to a specific step, with validation
  const navigateToStep = useCallback(
    (step: string) => {
      router.push(`/dashboard/onboarding/${step}`);
    },
    [router]
  );

  return {
    config,
    updateOrganization,
    updateActivities,
    updateActivitiesByCategory,
    updateTeams,
    updateTeamMembers,
    isStepComplete,
    getNextIncompleteStep,
    navigateToNextIncompleteStep,
    navigateToStep,
  };
}
