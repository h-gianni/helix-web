import { create } from 'zustand'
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query'
import type { ApiResponse, BusinessActivityResponse } from '@/lib/types/api'
import { apiClient } from '@/lib/api/api-client'

interface BusinessActivity {
  id: string
  name: string
  description: string | null
  category: string
  priority: string
  status: string
  dueDate: string
  assignedTo: string
  impactScale: number
  _count?: {
    ratings: number
  }
}

// API Layer
const activitiesApi = {
  getActivities: async () => {
    const { data } = await apiClient.get<ApiResponse<BusinessActivityResponse[]>>('/business-activities')
    if (!data.success) throw new Error(data.error || 'Failed to fetch activities')
    return data.data
  },

  createActivity: async (activityData: { 
    name: string
    description?: string 
  }) => {
    const { data } = await apiClient.post('/business-activities', activityData)
    if (!data.success) throw new Error(data.error || 'Failed to create activity')
    return data.data
  },

  updateActivity: async ({ id, ...updateData }: {
    id: string
    name?: string
    description?: string
  }) => {
    const { data } = await apiClient.patch(`/business-activities/${id}`, updateData)
    if (!data.success) throw new Error(data.error || 'Failed to update activity')
    return data.data
  },

  deleteActivity: async (id: string) => {
    const { data } = await apiClient.delete(`/business-activities/${id}`)
    if (!data.success) throw new Error(data.error || 'Failed to delete activity')
    return data.data
  }
}

// Query Hooks
const queryClient = new QueryClient()

export function useActivities() {
  return useQuery<BusinessActivityResponse[], Error>({
    queryKey: ['business-activities'],
    queryFn: activitiesApi.getActivities,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateActivity() {
  return useMutation({
    mutationFn: activitiesApi.createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-activities'] })
    }
  })
}

export function useUpdateActivity() {
  return useMutation({
    mutationFn: activitiesApi.updateActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-activities'] })
    }
  })
}

export function useDeleteActivity() {
  return useMutation({
    mutationFn: activitiesApi.deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-activities'] })
    }
  })
}

// Zustand Store for UI State
interface ActivitiesStore {
  selectedActivity: BusinessActivityResponse | null
  isEditModalOpen: boolean
  isDeleteDialogOpen: boolean
  setSelectedActivity: (activity: BusinessActivityResponse | null) => void
  setEditModalOpen: (isOpen: boolean) => void
  setDeleteDialogOpen: (isOpen: boolean) => void
  resetState: () => void
}

export const useActivitiesStore = create<ActivitiesStore>((set) => ({
  selectedActivity: null,
  isEditModalOpen: false,
  isDeleteDialogOpen: false,
  setSelectedActivity: (activity) => set({ selectedActivity: activity }),
  setEditModalOpen: (isOpen) => set({ isEditModalOpen: isOpen }),
  setDeleteDialogOpen: (isOpen) => set({ isDeleteDialogOpen: isOpen }),
  resetState: () => set({
    selectedActivity: null,
    isEditModalOpen: false,
    isDeleteDialogOpen: false
  })
}))