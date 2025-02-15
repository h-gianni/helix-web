// src/store/team-store.ts
import { create } from 'zustand';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import type { 
  ApiResponse, 
  TeamResponse, 
  TeamDetailsResponse,
  CreateTeamInput 
} from '@/lib/types/api';
import type { MemberPerformance } from '@/store/member';

interface TeamState {
  isAddMemberModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteDialogOpen: boolean;
  isTeamModalOpen: boolean;
  viewType: 'table' | 'grid';
  setAddMemberModalOpen: (isOpen: boolean) => void;
  setEditModalOpen: (isOpen: boolean) => void;
  setDeleteDialogOpen: (isOpen: boolean) => void;
  toggleTeamModal: () => void;
  setViewType: (type: 'table' | 'grid') => void;
}

const teamApi = {
  getTeams: async () => {
    // Update the endpoint to include member data if your API supports it
    const { data } = await apiClient.get<ApiResponse<TeamResponse[]>>('/teams?include=members,teamFunction');
    if (!data.success) throw new Error(data.error || 'Failed to fetch teams');
    return data.data;
  },

  getTeamDetails: async (teamId: string): Promise<TeamDetailsResponse> => {
    const { data } = await apiClient.get<ApiResponse<TeamDetailsResponse>>(`/teams/${teamId}`);
    if (!data.success) throw new Error(data.error || 'Failed to fetch team details');
    return data.data;
  },

  getTeamPerformance: async (teamId: string): Promise<{ members: MemberPerformance[] }> => {
    const { data } = await apiClient.get<ApiResponse<{ members: MemberPerformance[] }>>(`/teams/${teamId}/performance`);
    if (!data.success) throw new Error(data.error || 'Failed to fetch team performance');
    return data.data;
  },

  createTeam: async (input: CreateTeamInput): Promise<TeamResponse> => {
    const { data } = await apiClient.post<ApiResponse<TeamResponse>>('/teams', input);
    if (!data.success) throw new Error(data.error || 'Failed to create team');
    return data.data;
  },

  updateTeam: async ({ teamId, ...updateData }: { teamId: string; name: string; description?: string | null }) => {
    const { data } = await apiClient.patch<ApiResponse<TeamDetailsResponse>>(`/teams/${teamId}`, updateData);
    if (!data.success) throw new Error(data.error || 'Failed to update team');
    return data.data;
  },

  deleteTeam: async (teamId: string) => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/teams/${teamId}`);
    if (!data.success) throw new Error(data.error || 'Failed to delete team');
    return data.data;
  },

  addMember: async ({ teamId, email, title }: { teamId: string; email: string; title?: string }) => {
    const { data } = await apiClient.post(`/teams/${teamId}/members`, { email, title });
    if (!data.success) throw new Error(data.error || 'Failed to add member');
    return data.data;
  }
};

export const useTeamStore = create<TeamState>((set) => ({
  isAddMemberModalOpen: false,
  isEditModalOpen: false,
  isDeleteDialogOpen: false,
  isTeamModalOpen: false,
  viewType: 'table',
  setAddMemberModalOpen: (isOpen) => set({ isAddMemberModalOpen: isOpen }),
  setEditModalOpen: (isOpen) => set({ isEditModalOpen: isOpen }),
  setDeleteDialogOpen: (isOpen) => set({ isDeleteDialogOpen: isOpen }),
  toggleTeamModal: () => set((state) => ({ isTeamModalOpen: !state.isTeamModalOpen })),
  setViewType: (type) => set({ viewType: type })
}));

// Query Hooks
export const useTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: teamApi.getTeams
  });
}

export const useTeamDetails = (teamId: string) => {
  return useQuery({
    queryKey: ['team', teamId],
    queryFn: () => teamApi.getTeamDetails(teamId),
    enabled: !!teamId
  });
}

export const useTeamPerformance = (teamId: string) => {
  return useQuery({
    queryKey: ['team-performance', teamId],
    queryFn: () => teamApi.getTeamPerformance(teamId),
    enabled: !!teamId
  });
}

// Mutation Hooks
export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teamApi.createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    }
  });
}

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teamApi.updateTeam,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['team', variables.teamId] });
    }
  });
}

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teamApi.deleteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    }
  });
}

export const useAddTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teamApi.addMember,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['team', variables.teamId] });
      queryClient.invalidateQueries({ queryKey: ['team-performance', variables.teamId] });
    }
  });
}