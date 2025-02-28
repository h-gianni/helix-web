import { create } from 'zustand'
import { apiClient } from '@/lib/api/api-client'
import type { ApiResponse } from "@/lib/types/api"
import type {ActionCategory} from "@/lib/types/api/action"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'





export const actionApi = { 
    getActions: async () => {
      const { data } = await apiClient.get<ApiResponse<ActionCategory[]>>('/actions')
      if (!data.success) throw new Error(data.error || 'Failed to fetch actions')
      return data.data
    },

    getActionsByCategory: async (categoryId: string) => {
      const { data } = await apiClient.get<ApiResponse<ActionCategory[]>>(`/actions/${categoryId}`)
      if (!data.success) throw new Error(data.error || 'Failed to fetch actions')
      return data.data
    }
}


export function useActions() {
    return useQuery({
      queryKey: ['action-categories'],
      queryFn: actionApi.getActions,
      staleTime: 5 * 60 * 1000 // 5 minutes
    })
  }

  export function useActionsByCategory(categoryId: string) {
    return useQuery({
      queryKey: ['action-categories-by-category', categoryId],
      queryFn: () => actionApi.getActionsByCategory(categoryId),
      staleTime: 5 * 60 * 1000 // 5 minutes
    })
  }


  interface ActionStoreProps {
    actions: ActionCategory[]
    setActions: (actions: ActionCategory[]) => void
    parentCategory?: string


  }

  export const useActionStore = create<ActionStoreProps>((set) => ({
    actions: [],
    setActions: (actions) => set({ actions }),
    parentCategory: undefined
  }))


  //zustand
  interface ActionModalState { 
    selectedCategoryId: string | null
    setSelectedCategoryId: (categoryId: string) => void
  }

  export const useActionModalStore = create<ActionModalState>((set) => ({
    selectedCategoryId: null,
    setSelectedCategoryId: (categoryId) => {
        console.log(categoryId, 'setSelectedCategoryId zustand')
        set({ selectedCategoryId: categoryId })
    }
  }))