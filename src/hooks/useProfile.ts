// src/hooks/useProfile.ts
import { useState, useEffect } from 'react';

import { useQuery} from '@tanstack/react-query'

// Type definitions for our API response
interface ActionData {
  id: string;
  actionId: string;
  name: string;
  description?: string | null;
  impactScale?: number | null;
  status: string;
  createdAt: string;
}

interface ActionGroup {
  categoryName: string;
  isGlobal: boolean;
  actions: ActionData[];
}

interface ProfileData {
  id: string;
  email: string;
  name: string;
  subscription: {
    tier: string;
    startDate: string | null;
    endDate: string | null;
  };
  organization: {
    id: string;
    name: string;
  } | null;
  stats: {
    teamsOwned: number;
    teamsMember: number;
    globalActionsCount: number;
    teamActionsCount: number;
  };
  teams: {
    id: string;
    name: string;
    description: string | null;
  }[];
  globalActions: Record<string, ActionGroup>;
  teamActions: Record<string, ActionGroup>;
  clerkProfile: {
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
    primaryEmail: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

interface ProfileResponse {
  success: boolean;
  data: ProfileData;
}

export function useProfile() {
  // Using React Query for data fetching with caching
  return useQuery<ProfileResponse, Error>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await fetch('/api/user/profile');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch profile data');
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes (renamed from cacheTime)
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    // retry: 2, // Retry failed requests twice
  });
}