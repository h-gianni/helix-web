// src/store/member-store.ts
import { create } from 'zustand';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import type { ApiResponse } from '@/lib/types/api';

interface MemberDetails {
  id: string;
  firstName: string | null;
  lastName: string | null;
  title: string | null;
  isAdmin: boolean;
  user: {
    email: string;
    name: string | null;
  };
  goals: Array<{
    id: string;
    description: string;
    year: number;
  }>;
  team: {
    id: string;
    name: string;
  };
}

interface MemberState {
  isEditModalOpen: boolean;
  isRatingModalOpen: boolean;
  setEditModalOpen: (isOpen: boolean) => void;
  setRatingModalOpen: (isOpen: boolean) => void;
}

const memberApi = {
  getMemberDetails: async (teamId: string, memberId: string) => {
    const { data } = await apiClient.get<ApiResponse<MemberDetails>>(
      `/teams/${teamId}/members/${memberId}`
    );
    if (!data.success) throw new Error(data.error || 'Failed to fetch member details');
    return data.data;
  },

  updateMember: async ({ 
    teamId, 
    memberId, 
    ...updateData 
  }: { 
    teamId: string; 
    memberId: string; 
    firstName?: string | null;
    lastName?: string | null;
    title?: string | null;
  }) => {
    const { data } = await apiClient.patch(
      `/teams/${teamId}/members/${memberId}`,
      updateData
    );
    if (!data.success) throw new Error(data.error || 'Failed to update member');
    return data.data;
  },

  submitRating: async ({
    teamId,
    memberId,
    ...ratingData
  }: {
    teamId: string;
    memberId: string;
    activityId: string;
    rating: number;
    feedback?: string;
  }) => {
    const { data } = await apiClient.post(
      `/teams/${teamId}/members/${memberId}/ratings`,
      ratingData
    );
    if (!data.success) throw new Error(data.error || 'Failed to submit rating');
    return data.data;
  }
};

export const useMemberStore = create<MemberState>((set) => ({
  isEditModalOpen: false,
  isRatingModalOpen: false,
  setEditModalOpen: (isOpen) => set({ isEditModalOpen: isOpen }),
  setRatingModalOpen: (isOpen) => set({ isRatingModalOpen: isOpen })
}));

// Query Hooks
export const useMemberDetails = (teamId: string, memberId: string) => {
  return useQuery({
    queryKey: ['member', teamId, memberId],
    queryFn: () => memberApi.getMemberDetails(teamId, memberId),
    enabled: !!teamId && !!memberId
  });
}

// Mutation Hooks
export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: memberApi.updateMember,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['member', variables.teamId, variables.memberId] 
      });
    }
  });
}

export const useSubmitRating = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: memberApi.submitRating,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['member', variables.teamId, variables.memberId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['member-ratings', variables.teamId, variables.memberId] 
      });
    }
  });
}