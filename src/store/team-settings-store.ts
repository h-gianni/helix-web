import { create } from 'zustand'
import { apiClient } from '@/lib/api/api-client'
import type { ApiResponse, TeamDetailsResponse } from '@/lib/types/api'
import { useQuery, useMutation } from '@tanstack/react-query';



export const teamSettingsApi = {
    getTeamDetails: async (teamId: string) => {
      const { data } = await apiClient.get<ApiResponse<TeamDetailsResponse>>(`/teams/${teamId}`)
      if (!data.success) throw new Error(data.error || 'Failed to fetch team settings')
      return data.data
    }
  }
  
  export function useTeamDetails(teamId: string | null) {
    return useQuery({
      queryKey: ['team-details', teamId],
      queryFn: () => teamSettingsApi.getTeamDetails(teamId!),
      enabled: !!teamId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  }
  


//zustand store for team settings

interface TeamSettingsStore {
    selectedTeamId: string | null
    setSelectedTeamId: (teamId: string | null) => void
  }

  export const useTeamSettingsStore = create<TeamSettingsStore>((set) => ({
    selectedTeamId: null,
    setSelectedTeamId: (teamId) => set({ selectedTeamId: teamId })
  }))