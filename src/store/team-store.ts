import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { create } from 'zustand'
import type { TeamResponse } from '@/lib/types/api'

const queryClient =  useQueryClient();


// Create axios instance with default config
const api = axios.create({
    baseURL: '/api',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // API functions using axios
const teamsApi = {
    getTeams: async () => {
      const { data } = await api.get<{ success: boolean; data: TeamResponse[] }>('/teams')
      if (!data.success) throw new Error('Failed to fetch teams')
      return data.data
    },
  
    createTeam: async (newTeam: Partial<TeamResponse>) => {
      const { data } = await api.post('/teams', newTeam)
      return data.data
    },
  
    updateTeam: async ({ id, ...updateData }: Partial<TeamResponse> & { id: string }) => {
      const { data } = await api.put(`/teams/${id}`, updateData)
      return data.data
    },
  
    deleteTeam: async (id: string) => {
      await api.delete(`/teams/${id}`)
      return id
    }
  }

  // Axios interceptors for global error handling
api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        // Handle unauthorized
        useTeamStore.getState().setAuthError('Session expired')
      }
      return Promise.reject(error)
    }
  )

  // TanStack Query Hooks
export function useTeams() {
    return useQuery({
      queryKey: ['teams'],
      queryFn: teamsApi.getTeams,
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  }

  export function useCreateTeam() {
    return useMutation({
      mutationFn: teamsApi.createTeam,
      onSuccess: (newTeam) => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ['teams'] })
      }
    })
  }

  export function useUpdateTeam() {
    return useMutation({
      mutationFn: teamsApi.updateTeam,
      // Optimistic update
      onMutate: async (updatedTeam) => {
        await queryClient.cancelQueries({ queryKey: ['teams'] })
        const previousTeams = queryClient.getQueryData<TeamResponse[]>(['teams'])
        
        queryClient.setQueryData(['teams'], (old: TeamResponse[] = []) =>
          old.map(team => team.id === updatedTeam.id ? { ...team, ...updatedTeam } : team)
        )
  
        return { previousTeams }
      },
      onError: (err, variables, context) => {
        if (context?.previousTeams) {
          queryClient.setQueryData(['teams'], context.previousTeams)
        }
      }
    })
  }

interface TeamsStore {
    isTeamModalOpen: boolean
  selectedTeamId: string | null
  authError: string | null
  setAuthError: (error: string | null) => void
  toggleTeamModal: () => void
  setSelectedTeamId: (id: string | null) => void
  }

  export const useTeamStore = create<TeamsStore>((set) => ({
    isTeamModalOpen: false,
    selectedTeamId: null,
    authError: null,
    setAuthError: (error) => set({ authError: error }),
    toggleTeamModal: () => set((state) => ({ 
      isTeamModalOpen: !state.isTeamModalOpen 
    })),
    setSelectedTeamId: (id) => set({ selectedTeamId: id })
  }))