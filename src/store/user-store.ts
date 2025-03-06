import { create } from 'zustand'
import { apiClient } from '@/lib/api/api-client'
import type { ApiResponse } from "@/lib/types/api"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react';



// Define types for the profile data
interface OrgName {
    id: string;
    name: string;
    createdAt: string;
    userId: string;
  }

  interface TeamMember {
    id: string;
    userId: string;
    teamId: string;
    title?: string;
    isAdmin: boolean;
    status: string;
    firstName?: string;
    lastName?: string;
    // Add other teamMember properties as needed
  }

  interface Team {
    id: string;
    name: string;
    description?: string;
    // Add other team properties as needed
  }


  interface UserProfile {
    id: string;
    email: string;
    name?: string;
    clerkId: string;
    subscriptionTier: string;
    subscriptionStart?: string;
    subscriptionEnd?: string;
    createdAt: string;
    updatedAt: string;
    customFields?: any;
    teamMembers: TeamMember[];
    teams: Team[];
    createdActions: any[];
    orgName: OrgName[]; // Using orgNames as returned by our updated API
    clerkProfile: {
      firstName: string;
      lastName: string;
      imageUrl: string;
      emailAddresses: any[];
    };
  }

// API client for user profile
export const userProfileApi = {
    getProfile: async (): Promise<UserProfile> => {
      const { data } = await apiClient.get<ApiResponse<any>>('/user/profile');
     // console.log(data.orgName[0].name, 'userProfileApi.getProfile -----------------')
      if (!data.success) throw new Error(data.error || 'Failed to fetch profile');
      return data.data as UserProfile;
    },
    
    updateProfile: async (profileData: { firstName: string; lastName: string }) => {
      const { data } = await apiClient.patch<ApiResponse<any>>('/user/profile', profileData);
      if (!data.success) throw new Error(data.error || 'Failed to update profile');
      return data.data;
    },
    
    updateOrgName: async (orgName: string) => {
      // Assuming you will create an endpoint for updating org name
      const { data } = await apiClient.patch<ApiResponse<any>>('/user/org-name', { name: orgName });
      if (!data.success) throw new Error(data.error || 'Failed to update organization name');
      return data.data;
    }
  };


  export function useProfile() {
      return useQuery({
        queryKey: ['user-profile'],
        queryFn: userProfileApi.getProfile,
        staleTime: 5 * 60 * 1000 // 5 minutes
      })
    }


  
  export function useUpdateProfile() {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: userProfileApi.updateProfile,
      onSuccess: () => {
        // Invalidate and refetch the profile query
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
    });
  }
  
  export function useUpdateOrgName() {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: userProfileApi.updateOrgName,
      onSuccess: () => {
        // Invalidate and refetch the profile query
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
    });
  }


// Zustand store for additional state management
interface ProfileStoreProps {
    profile: UserProfile | null;
    orgName: string;
    setProfile: (profile: UserProfile) => void;
    setOrgName: (name: string) => void;
    
    // Helper method to extract org name from profile
    initializeFromProfile: (profile: UserProfile) => void;
  }

  export const useProfileStore = create<ProfileStoreProps>((set) => ({
    profile: null,
    orgName: '',
    
    setProfile: (profile) => set({ profile }),
    
    setOrgName: (name) => set({ orgName: name }),
    
    initializeFromProfile: (profile) => {
        // Check if the profile has an orgName field with data
        let orgNameValue = '';
        
        
        if (profile.orgName && profile.orgName.length > 0) {
          orgNameValue = profile.orgName[0].name;
        }
        
        set({ 
          profile,
          orgName: orgNameValue
        });
      }
  }));


  // Helper hook to sync React Query data with Zustand store
  export function useProfileSync() {
    const { data: profile, isLoading, error } = useProfile();
    const { initializeFromProfile } = useProfileStore();
    
    useEffect(() => {
      if (profile) {
        initializeFromProfile(profile);
      }
    }, [profile, initializeFromProfile]);
    
    return { isLoading, error };
  }