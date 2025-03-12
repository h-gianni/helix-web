// Enhanced version of the onboarding store with improved completion handling
import { create } from "zustand";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/api-client";
import type { ApiResponse } from "@/lib/types/api";
import { useConfigStore } from "@/store/config-store";
// import { useToast } from '@/components/ui/core/Toast';

// Types
export interface CompleteOnboardingInput {
  organization: {
    name: string;
  };
  activities: {
    selected: string[];
    selectedByCategory: Record<string, string[]>;
  };
  teams: Array<{
    id: string;
    name: string;
    functions: string[];
    categories: string[];
  }>;
}

export interface CompleteOnboardingResponse {
  organization: {
    id: string;
    name: string;
  };
  teams: Array<{
    id: string;
    name: string;
    teamFunctionId: string;
  }>;
  activitiesCount: number;
}

// Onboarding store state
interface OnboardingState {
  currentStep: number;
  selectedCategory: string;
  isCompleting: boolean;
  error: string | null;
  setCurrentStep: (step: number) => void;
  setSelectedCategory: (category: string) => void;
  setIsCompleting: (isCompleting: boolean) => void;
  setError: (error: string | null) => void;
  syncTeamCategories: () => void;
  resetOnboarding: () => void;
}

// API functions
const onboardingApi = {
  completeOnboarding: async (
    input: CompleteOnboardingInput
  ): Promise<CompleteOnboardingResponse> => {
    const { data } = await apiClient.post<
      ApiResponse<CompleteOnboardingResponse>
    >("/onboarding", input);
    if (!data.success)
      throw new Error(data.error || "Failed to complete onboarding");
    return data.data!; // Add the non-null assertion operator
  },
};

// Zustand store
export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  currentStep: 0,
  selectedCategory: "",
  isCompleting: false,
  error: null,
  setCurrentStep: (step) => {
    // When moving to the team step, ensure categories are synced
    if (step === 2) {
      // Assuming team step is index 2
      get().syncTeamCategories();
    }
    set({ currentStep: step });
  },
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setIsCompleting: (isCompleting) => set({ isCompleting }),
  setError: (error) => set({ error }),
  syncTeamCategories: () => {
    // Get the config store
    const config = useConfigStore.getState().config;
    const updateTeams = useConfigStore.getState().updateTeams;

    // Get selected categories
    const selectedCategoryIds = Object.keys(
      config.activities.selectedByCategory || {}
    );
    console.log("Syncing team categories", { selectedCategoryIds });

    if (selectedCategoryIds.length > 0 && config.teams.length > 0) {
      // Update teams with categories
      const updatedTeams = config.teams.map((team) => {
        // Keep existing categories if they exist
        if (team.categories && team.categories.length > 0) {
          return team;
        }
        // Otherwise, add all selected categories
        return {
          ...team,
          categories: selectedCategoryIds,
        };
      });

      // Only update if there's a change
      if (JSON.stringify(updatedTeams) !== JSON.stringify(config.teams)) {
        console.log(
          "Updating teams with categories in sync operation",
          updatedTeams
        );
        updateTeams(updatedTeams);
      }
    }
  },
  resetOnboarding: () =>
    set({
      currentStep: 0,
      selectedCategory: "",
      isCompleting: false,
      error: null,
    }),
}));

// React Query mutation hook with toast notifications
export const useCompleteOnboarding = () => {
  const queryClient = useQueryClient();
  const config = useConfigStore((state) => state.config);
  const setConfig = useConfigStore((state) => state.setConfig);
  const { setIsCompleting, setError } = useOnboardingStore();
  // const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      // Format the data for the API
      const payload: CompleteOnboardingInput = {
        organization: config.organization,
        activities: {
          selected: config.activities.selected || [],
          selectedByCategory: config.activities.selectedByCategory || {},
        },
        teams: config.teams.map((team) => ({
          id:
            team.id ||
            `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: team.name || "",
          functions: team.functions || [],
          categories: team.categories || [],
        })),
      };

      // Validate payload before sending
      if (!payload.organization.name?.trim()) {
        throw new Error("Organization name is required");
      }

      if (payload.teams.length === 0) {
        throw new Error("At least one team is required");
      }

      const invalidTeams = payload.teams.filter(
        (team) => !team.name?.trim() || !team.functions?.length
      );

      if (invalidTeams.length > 0) {
        throw new Error("All teams must have a name and at least one function");
      }

      console.log(
        "Sending onboarding completion payload:",
        JSON.stringify(payload, null, 2)
      );
      return onboardingApi.completeOnboarding(payload);
    },
    onMutate: () => {
      setIsCompleting(true);
      setError(null);

      // // Show loading toast
      // toast({
      //   title: "Saving your configuration",
      //   description: "Please wait while we set up your organization...",
      //   variant: "default"
      // });
    },
    onSuccess: (data) => {
      console.log("Onboarding completed successfully:", data);

      // Reset the onboarding state in the store
      setConfig({
        organization: { name: "" },
        activities: {
          selected: [],
          selectedByCategory: {},
          favorites: {},
          hidden: {},
        },
        teams: [],
      });

      // Invalidate teams query so the dashboard loads fresh data
      queryClient.invalidateQueries({ queryKey: ["teams"] });

      // Show success toast
      // toast({
      //   title: "Setup completed!",
      //   description: `Created ${data.teams.length} teams with ${data.activitiesCount} activities`,
      //   variant: "success"
      // });
    },
    onError: (error: Error) => {
      console.error("Error completing onboarding:", error);
      setError(error.message);

      // Show error toast
      // toast({
      //   title: "Setup failed",
      //   description: error.message || "An unexpected error occurred",
      //   variant: "destructive"
      // });
    },
    onSettled: () => {
      setIsCompleting(false);
    },
  });
};

export const useStepValidation = () => {
  const config = useConfigStore((state) => state.config);

  const validateStep = (stepId: string): boolean => {
    switch (stepId) {
      case "organization":
        const hasOrgName = !!config.organization.name?.trim();
        const hasSelectedActivities =
          (config.activities.selected || []).length > 0;
        const hasSelectedByCategory = Object.values(
          config.activities.selectedByCategory || {}
        ).some((categoryActivities) => categoryActivities.length > 0);

        return hasOrgName && (hasSelectedActivities || hasSelectedByCategory);

      case "team":
        // Debug validation issues
        console.log("Validating team step:", {
          teams: config.teams,
          hasTeams: config.teams.length > 0,
          teamsWithNames: config.teams.filter((t) => !!t.name?.trim()).length,
          teamsWithFunctions: config.teams.filter(
            (t) => t.functions && t.functions.length > 0
          ).length,
          teamsWithCategories: config.teams.filter(
            (t) => t.categories && t.categories.length > 0
          ).length,
          selectedCategories: Object.keys(
            config.activities.selectedByCategory || {}
          ).length,
        });

        // Base validation - must have at least one team
        if (config.teams.length === 0) {
          return false;
        }

        // Check each team
        let isValid = true;
        config.teams.forEach((team) => {
          // Team must have a name
          if (!team.name?.trim()) {
            console.log("Team missing name:", team);
            isValid = false;
          }

          // Team must have at least one function
          if (!team.functions || team.functions.length === 0) {
            console.log("Team missing functions:", team);
            isValid = false;
          }

          // Only check for categories if there are categories selected
          const selectedCategoryIds = Object.keys(
            config.activities.selectedByCategory || {}
          );
          if (selectedCategoryIds.length > 0) {
            // Team should have at least one category if categories exist
            if (!team.categories || team.categories.length === 0) {
              console.log("Team missing categories:", team);
              isValid = false;
            }
          }
        });

        return config.teams.some((team) => {
          const hasName = team.name?.trim();
          const hasCategories = team.categories && team.categories.length > 0;
          return hasName && hasCategories;
        });

      case "summary":
        // Summary step is always valid as it's just a review
        return true;

      default:
        console.warn(`Unknown step ID: ${stepId}`);
        return false;
    }
  };

  return { validateStep };
};
