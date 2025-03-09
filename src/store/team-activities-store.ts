import { create } from 'zustand'
import { apiClient } from '@/lib/api/api-client'
import type { ApiResponse, BusinessActivityResponse as ActivityResponse } from "@/lib/types/api"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'



export const teamActivitiesApi = {
    getActivities: async () => {
      const { data } = await apiClient.get<ApiResponse<ActivityResponse[]>>('/business-activities')
      if (!data.success) throw new Error(data.error || 'Failed to fetch activities')
      return data.data
    },
    getTeamActivities: async (teamId: string) => {
        const { data } = await apiClient.get<ApiResponse<ActivityResponse[]>>(`/teams/${teamId}/activities`)
        if (!data.success) throw new Error(data.error || 'Failed to fetch team activities')
        return data.data
      },
      updateTeamActivities: async (teamId: string, activityIds: string[]) => {
        const { data } = await apiClient.put<ApiResponse<any>>(`/teams/${teamId}/activities`, {
          activityIds
        })
        if (!data.success) throw new Error(data.error || 'Failed to update team activities')
        return data.data
      }
}  


export function useActivities() {
    return useQuery({
      queryKey: ['activities'],
      queryFn: teamActivitiesApi.getActivities,
      staleTime: 5 * 60 * 1000 // 5 minutes
    })
  }
  
  export function useTeamActivities(teamId: string) {
    return useQuery({
      queryKey: ['team-activities', teamId],
      queryFn: () => teamActivitiesApi.getTeamActivities(teamId),
      staleTime: 5 * 60 * 1000
    })
  }


  export function useUpdateTeamActivities() {
    const queryClient = useQueryClient()
    
    return useMutation({
      mutationFn: ({ teamId, activityIds }: { teamId: string, activityIds: string[] }) =>
        teamActivitiesApi.updateTeamActivities(teamId, activityIds),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['team-activities', variables.teamId] })
        queryClient.invalidateQueries({ queryKey: ['team-details', variables.teamId] })
      }
    })
  }


//zustand
interface TeamActivitiesStore {
    selectedActivityIds: string[]
    setSelectedActivityIds: (ids: string[]) => void
    toggleActivity: (activityId: string) => void
    selectAll: (activities: ActivityResponse[]) => void
    unselectAll: () => void
  }

  export const useTeamActivitiesStore = create<TeamActivitiesStore>((set) => ({
    selectedActivityIds: [],
    setSelectedActivityIds: (ids) => set({ selectedActivityIds: ids }),
    toggleActivity: (activityId) => 
      set((state) => ({
        selectedActivityIds: state.selectedActivityIds.includes(activityId)
          ? state.selectedActivityIds.filter(id => id !== activityId)
          : [...state.selectedActivityIds, activityId]
      })),
    selectAll: (activities) => 
      set({ selectedActivityIds: activities.map(activity => activity.id) }),
    unselectAll: () => set({ selectedActivityIds: [] })
  }))