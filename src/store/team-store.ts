import { useQuery, useMutation, QueryClient } from '@tanstack/react-query'
import { create } from 'zustand'
import { apiClient } from '@/lib/api/api-client'
import { ApiResponse, TeamDetailsResponse } from '@/lib/types/api';
import { MemberPerformance } from '@/app/dashboard/types/member';

const queryClient =  new QueryClient();

// API Layer
const teamDetailsApi = {
    getTeamDetails: async (teamId: string) => {
      const { data } = await apiClient.get<ApiResponse<TeamDetailsResponse>>(`/teams/${teamId}`)
      if (!data.success) throw new Error(data.error || 'Failed to fetch team details')
      return data.data
    },
  
    getTeamPerformance: async (teamId: string) => {
      const { data } = await apiClient.get<ApiResponse<{ members: MemberPerformance[] }>>(`/teams/${teamId}/performance`)
      if (!data.success) throw new Error(data.error || 'Failed to fetch team performance')
      return data.data
    },
  
    updateTeam: async ({ id, ...updateData }: { id: string; name: string; description: string | null }) => {
      const { data } = await apiClient.patch(`/teams/${id}`, updateData)
      if (!data.success) throw new Error(data.error || 'Failed to update team')
      return data.data
    },
  
    addTeamMember: async ({ teamId, email, title }: { teamId: string; email: string; title?: string }) => {
      const { data } = await apiClient.post(`/teams/${teamId}/members`, { email, title })
      if (!data.success) throw new Error(data.error || 'Failed to add team member')
      return data.data
    },
  
    deleteTeam: async (teamId: string) => {
      const { data } = await apiClient.delete(`/teams/${teamId}`)
      if (!data.success) throw new Error(data.error || 'Failed to delete team')
      return teamId
    }
  }


  // Query Hooks
export function useTeamDetails(teamId: string) {
    return useQuery({
      queryKey: ['team', teamId],
      queryFn: () => teamDetailsApi.getTeamDetails(teamId),
      staleTime: 5 * 60 * 1000
    })
  }

  export function useTeamPerformance(teamId: string) {
    return useQuery({
      queryKey: ['team-performance', teamId],
      queryFn: () => teamDetailsApi.getTeamPerformance(teamId),
      staleTime: 1 * 60 * 1000
    })
  }

  export function useUpdateTeam() {
    return useMutation({
      mutationFn: teamDetailsApi.updateTeam,
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['team', variables.id] })
      }
    })
  }

  export function useAddTeamMember() {
    return useMutation({
      mutationFn: teamDetailsApi.addTeamMember,
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['team', variables.teamId] })
        queryClient.invalidateQueries({ queryKey: ['team-performance', variables.teamId] })
      }
    })
  }

  export function useDeleteTeam() {
    return useMutation({
      mutationFn: teamDetailsApi.deleteTeam,
      onSuccess: (teamId) => {
        queryClient.invalidateQueries({ queryKey: ['teams'] })
        queryClient.removeQueries({ queryKey: ['team', teamId] })
        queryClient.removeQueries({ queryKey: ['team-performance', teamId] })
      }
    })
  }

  // Zustand Store
interface TeamDetailsStore {
    isAddMemberModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteDialogOpen: boolean
    viewType: 'table' | 'grid'
    setAddMemberModalOpen: (isOpen: boolean) => void
    setEditModalOpen: (isOpen: boolean) => void
    setDeleteDialogOpen: (isOpen: boolean) => void
    setViewType: (type: 'table' | 'grid') => void
  }


  export const useTeamDetailsStore = create<TeamDetailsStore>((set) => ({
    isAddMemberModalOpen: false,
    isEditModalOpen: false,
    isDeleteDialogOpen: false,
    viewType: 'table',
    setAddMemberModalOpen: (isOpen) => set({ isAddMemberModalOpen: isOpen }),
    setEditModalOpen: (isOpen) => set({ isEditModalOpen: isOpen }),
    setDeleteDialogOpen: (isOpen) => set({ isDeleteDialogOpen: isOpen }),
    setViewType: (type) => set({ viewType: type })
  }))