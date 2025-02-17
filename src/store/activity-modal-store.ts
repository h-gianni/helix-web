import { create } from 'zustand'
import { apiClient } from '@/lib/api/api-client'
import type { ApiResponse, BusinessActivityResponse } from "@/lib/types/api"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'


export const activityApi = { 
    getActivityCategories: async () => {
        const { data } = await apiClient.get<ApiResponse<Array<{
          category: string
          activities: BusinessActivityResponse[]
        }>>>('/business-activities/categories')
        if (!data.success) throw new Error(data.error || 'Failed to fetch activity categories')
        return data.data
      },

      createActivity: async (activityData: {
        name: string
        description?: string
        impactScale?: string
        categoryIds?: string[] 
      }) => {
        const { data } = await apiClient.post<ApiResponse<BusinessActivityResponse>>(
          '/business-activities',
          activityData
        )
        if (!data.success) throw new Error(data.error || 'Failed to create activity')
        return data.data
      },

      updateActivity: async (activityId: string, activityData: {
        name: string
        description?: string
        impactScale?: string
      }) => {
        const { data } = await apiClient.patch<ApiResponse<BusinessActivityResponse>>(
          `/business-activities/${activityId}`,
          activityData
        )
        if (!data.success) throw new Error(data.error || 'Failed to update activity')
        return data.data
      },

      importActivities: async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        
        const { data } = await apiClient.post<ApiResponse<BusinessActivityResponse[]>>(
          '/business-activities/import',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        if (!data.success) throw new Error(data.error || 'Failed to import activities')
        return data.data
      }
}


export function useActivityCategories() {
    return useQuery({
      queryKey: ['activity-categories'],
      queryFn: activityApi.getActivityCategories,
      staleTime: 5 * 60 * 1000 // 5 minutes
    })
  }

  export function useCreateActivity() {
    const queryClient = useQueryClient()
    
    return useMutation({
      mutationFn: activityApi.createActivity,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['activities'] })
        queryClient.invalidateQueries({ queryKey: ['activity-categories'] })
      }
    })
  }


  export function useUpdateActivity() {
    const queryClient = useQueryClient()
    
    return useMutation({
      mutationFn: ({ id, ...data }: { id: string } & Parameters<typeof activityApi.updateActivity>[1]) =>
        activityApi.updateActivity(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['activities'] })
        queryClient.invalidateQueries({ queryKey: ['activity-categories'] })
      }
    })
  }

  export function useImportActivities() {
    const queryClient = useQueryClient()
    
    return useMutation({
      mutationFn: activityApi.importActivities,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['activities'] })
        queryClient.invalidateQueries({ queryKey: ['activity-categories'] })
      }
    })
  }


// zustand store
interface ActivityFormData {
  name: string
  description: string
  activityType: 'from-categories' | 'from-import' | 'from-scratch'
  category: string
  impactScale: string
  selectedCategories: string[]
  uploadedFile: File | null
}

interface ActivityModalStore {
  formData: ActivityFormData
  dragActive: boolean
  setFormData: (data: Partial<ActivityFormData>) => void
  setDragActive: (active: boolean) => void
  reset: () => void
  hasChanges: (activity?: BusinessActivityResponse | null) => boolean
}

const initialFormData: ActivityFormData = {
    name: '',
    description: '',
    activityType: 'from-categories',
    category: '',
    impactScale: '',
    selectedCategories: [],
    uploadedFile: null
  }



  export const useActivityModalStore = create<ActivityModalStore>((set, get) => ({
    formData: initialFormData,
    dragActive: false,
    setFormData: (data) => set((state) => ({
      formData: { ...state.formData, ...data }
    })),
    setDragActive: (active) => set({ dragActive: active }),
    reset: () => set({ formData: initialFormData, dragActive: false }),
    hasChanges: (activity) => {

        
      const { formData } = get()
      const { activityType, uploadedFile, name, description, selectedCategories } = formData
  
      switch (activityType) {
        case 'from-import':
          return !!uploadedFile
        case 'from-categories':
          return selectedCategories.length > 0
        case 'from-scratch':
          if (activity) {
            return name !== activity.name || description !== (activity.description || '')
          }
          return name.trim() !== ''
        default:
          return false
      }
    },
    isValid: () => {
      const { formData } = get()
      const { activityType, uploadedFile, name, selectedCategories } = formData
  
      switch (activityType) {
        case 'from-import':
          return !!uploadedFile
        case 'from-categories':
          return selectedCategories.length > 0
        case 'from-scratch':
          return name.trim().length > 0
        default:
          return false
      }
    }
  }))