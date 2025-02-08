// src/store/performance-rating-store.ts
import { create } from 'zustand';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import type { BusinessActivityResponse, TeamResponse, TeamMemberResponse } from '@/lib/types/api';

interface PerformanceRatingState {
  isOpen: boolean;
  selectedTeamId: string;
  selectedMemberId: string;
  selectedActivityId: string;
  rating: number;
  feedback: string;
}

interface PerformanceRatingActions {
  reset: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setSelectedTeamId: (id: string) => void;
  setSelectedMemberId: (id: string) => void;
  setSelectedActivityId: (id: string) => void;
  setRating: (rating: number) => void;
  setFeedback: (feedback: string) => void;
}

const initialState: PerformanceRatingState = {
  isOpen: false,
  selectedTeamId: '',
  selectedMemberId: '',
  selectedActivityId: '',
  rating: 0,
  feedback: '',
};

export const performanceRatingApi = {
  getTeams: async () => {
    const { data } = await apiClient.get<{ success: boolean; data: TeamResponse[] }>('/teams');
    if (!data.success) throw new Error('Failed to fetch teams');
    return data.data;
  },

  getMembers: async (teamId: string) => {
    if (!teamId) return [];
    const { data } = await apiClient.get<{ success: boolean; data: TeamMemberResponse[] }>(
      `/teams/${teamId}/members`
    );
    if (!data.success) throw new Error('Failed to fetch team members');
    return data.data;
  },

  getActivities: async (teamId: string) => {
    if (!teamId) return [];
    const { data } = await apiClient.get<{ success: boolean; data: BusinessActivityResponse[] }>(
      `/teams/${teamId}/activities`
    );
    if (!data.success) throw new Error('Failed to fetch activities');
    return data.data;
  },

  submitRating: async (rating: {
    teamId: string;
    memberId: string;
    activityId: string;
    rating: number;
    feedback?: string;
  }) => {
    // Format the payload according to the backend API expectations
    const payload = {
      activityId: rating.activityId,
      value: rating.rating, // Changed from rating to value to match API
      feedback: rating.feedback?.trim()
    };

    const { data } = await apiClient.post(
      `/teams/${rating.teamId}/members/${rating.memberId}/ratings`,
      payload
    );

    if (!data.success) {
      throw new Error(data.error || 'Failed to submit rating');
    }

    return data.data;
  },
};

export const usePerformanceRatingStore = create<PerformanceRatingState & PerformanceRatingActions>((set) => ({
  ...initialState,
  reset: () => set(initialState),
  setIsOpen: (isOpen) => set({ isOpen }),
  setSelectedTeamId: (id) => set({ selectedTeamId: id }),
  setSelectedMemberId: (id) => set({ selectedMemberId: id }),
  setSelectedActivityId: (id) => set({ selectedActivityId: id }),
  setRating: (rating) => set({ rating }),
  setFeedback: (feedback) => set({ feedback }),
}));

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: performanceRatingApi.getTeams,
  });
}

export function useTeamMembers(teamId: string) {
  return useQuery({
    queryKey: ['team-members', teamId],
    queryFn: () => performanceRatingApi.getMembers(teamId),
    enabled: !!teamId,
  });
}

export function useTeamActivities(teamId: string) {
  return useQuery({
    queryKey: ['team-activities', teamId],
    queryFn: () => performanceRatingApi.getActivities(teamId),
    enabled: !!teamId,
  });
}

export function useSubmitRating() {
  return useMutation({
    mutationFn: performanceRatingApi.submitRating,
    onError: (error) => {
      console.error('Rating submission error:', error);
    }
  });
}