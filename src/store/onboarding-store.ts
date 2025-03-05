import { create } from 'zustand';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import type { ApiResponse } from '@/lib/types/api';
import { useConfigStore } from '@/store/config-store';


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

  
  

  // API functions
const onboardingApi = {
    completeOnboarding: async (input: CompleteOnboardingInput): Promise<CompleteOnboardingResponse> => {
      const { data } = await apiClient.post<ApiResponse<CompleteOnboardingResponse>>('/onboarding/complete', input);
      if (!data.success) throw new Error(data.error || 'Failed to complete onboarding');
      return data.data;
    }
  };
  

  // React Query mutation hook
export const useCompleteOnboarding = () => {
    const queryClient = useQueryClient();
    const config = useConfigStore((state) => state.config);
    const setConfig = useConfigStore((state) => state.setConfig);
    const { setIsCompleting, setError } = useOnboardingStore();
    
    return useMutation({
      mutationFn: async () => {
        // Format the data for the API
        const payload: CompleteOnboardingInput = {
          organization: config.organization,
          activities: {
            selected: config.activities.selected,
            selectedByCategory: config.activities.selectedByCategory || {}
          },
          teams: config.teams.map(team => ({
            id: team.id,
            name: team.name,
            functions: team.functions,
            categories: team.categories || []
          }))
        };
        
        return onboardingApi.completeOnboarding(payload);
      },
      onMutate: () => {
        setIsCompleting(true);
        setError(null);
      },
      onSuccess: () => {
        // Reset the onboarding state in the store
        setConfig({
          organization: { name: '' },
          activities: {
            selected: [],
            selectedByCategory: {},
            favorites: {},
            hidden: {}
          },
          teams: [],
        });
        
        // Invalidate teams query so the dashboard loads fresh data
        queryClient.invalidateQueries({ queryKey: ['teams'] });
      },
      onError: (error: Error) => {
        setError(error.message);
      },
      onSettled: () => {
        setIsCompleting(false);
      }
    });
  };

  // Helper hooks for step validation
  export const useStepValidation = () => {
    const config = useConfigStore((state) => state.config);
    
    const validateStep = (stepId: string): boolean => {
      switch (stepId) {
        case "org":
          return !!config.organization.name.trim();
        
        case "activities":
          return config.activities.selected.length > 0;
        
        case "team":
          // Debug validation issues
          console.log('Validating team step:', {
            teams: config.teams,
            hasTeams: config.teams.length > 0,
            teamsWithNames: config.teams.filter(t => !!t.name?.trim()).length,
            teamsWithFunctions: config.teams.filter(t => 
              t.functions && t.functions.length > 0
            ).length
          });
          
          // Base validation - must have at least one team
          if (config.teams.length === 0) {
            return false;
          }
          
          // Check each team
          let isValid = true;
          config.teams.forEach(team => {
            // Team must have a name
            if (!team.name?.trim()) {
              console.log('Team missing name:', team);
              isValid = false;
            }
            
            // Team must have at least one function
            if (!team.functions || team.functions.length === 0) {
              console.log('Team missing functions:', team);
              isValid = false;
            }
          });
          
          return isValid;
        
        case "summary":
          return true;
        
        default:
          return false;
      }
    };
    
    return { validateStep };
  };

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
    resetOnboarding: () => void;
  }

// Zustand store
export const useOnboardingStore = create<OnboardingState>((set) => ({
    currentStep: 0,
    selectedCategory: '',
    isCompleting: false,
    error: null,
    setCurrentStep: (step) => set({ currentStep: step }),
    setSelectedCategory: (category) => set({ selectedCategory: category }),
    setIsCompleting: (isCompleting) => set({ isCompleting }),
    setError: (error) => set({ error }),
    resetOnboarding: () => set({ 
      currentStep: 0, 
      selectedCategory: '',
      isCompleting: false,
      error: null 
    })
  }));