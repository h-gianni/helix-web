// src/store/feedback-store.ts
import { create } from 'zustand';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import type { TeamResponse, TeamMemberResponse } from '@/lib/types/api';

interface FeedbackState {
  isOpen: boolean;
  selectedTeamId: string;
  selectedMemberId: string;
  feedback: string;
}

interface FeedbackActions {
  reset: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setSelectedTeamId: (id: string) => void;
  setSelectedMemberId: (id: string) => void;
  setFeedback: (feedback: string) => void;
}

const initialState: FeedbackState = {
  isOpen: false,
  selectedTeamId: '',
  selectedMemberId: '',
  feedback: '',
};

export const feedbackApi = {
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

  submitFeedback: async (feedbackData: {
    teamId: string;
    memberId: string;
    feedback: string;
  }) => {
    // Format the payload according to the backend API expectations
    const payload = {
      feedback: feedbackData.feedback.trim()
    };

    const { data } = await apiClient.post(
      `/teams/${feedbackData.teamId}/members/${feedbackData.memberId}/feedback`,
      payload
    );

    if (!data.success) {
      throw new Error(data.error || 'Failed to submit feedback');
    }

    return data.data;
  },
};

export const useFeedbackStore = create<FeedbackState & FeedbackActions>((set) => ({
  ...initialState,
  reset: () => set(initialState),
  setIsOpen: (isOpen) => set({ isOpen }),
  setSelectedTeamId: (id) => set({ selectedTeamId: id }),
  setSelectedMemberId: (id) => set({ selectedMemberId: id }),
  setFeedback: (feedback) => set({ feedback }),
}));

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: feedbackApi.getTeams,
  });
}

export function useTeamMembers(teamId: string) {
  return useQuery({
    queryKey: ['team-members', teamId],
    queryFn: () => feedbackApi.getMembers(teamId),
    enabled: !!teamId,
  });
}

export function useSubmitFeedback() {
  return useMutation({
    mutationFn: feedbackApi.submitFeedback,
    onError: (error) => {
      console.error('Feedback submission error:', error);
    }
  });
}