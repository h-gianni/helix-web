// category-store.ts
import { create } from 'zustand'
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query'
import type { ApiResponse } from '@/lib/types/api'
import { apiClient } from '@/lib/api/api-client'

// Types
interface BusinessActivityCategory {
  id: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
  _count: {
    activities: number
  }
  activities: {
    id: string
    name: string
    description: string | null
    impactScale: number | null
    businessActivities: {
      id: string
      name: string
      status: string
      priority: string
    }[]
  }[]
}

interface CreateCategoryInput {
  name: string
  description?: string
}

interface UpdateCategoryInput {
  id: string
  name?: string
  description?: string
}

const queryClient = new QueryClient()

// API Layer
const categoryApi = {
  getCategories: async (teamId?: string) => {
    const params = teamId ? `?teamId=${teamId}` : ''
    const { data } = await apiClient.get<ApiResponse<BusinessActivityCategory[]>>(`/business-activities/categories${params}`)
    if (!data.success) throw new Error(data.error || 'Failed to fetch categories')
    return data.data
  },

  createCategory: async (input: CreateCategoryInput) => {
    const { data } = await apiClient.post<ApiResponse<BusinessActivityCategory>>('/business-activities/categories', input)
    if (!data.success) throw new Error(data.error || 'Failed to create category')
    return data.data
  },

  updateCategory: async (input: UpdateCategoryInput) => {
    const { data } = await apiClient.patch<ApiResponse<BusinessActivityCategory>>(`/business-activities/categories/${input.id}`, input)
    if (!data.success) throw new Error(data.error || 'Failed to update category')
    return data.data
  },

  deleteCategory: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/business-activities/categories/${id}`)
    if (!data.success) throw new Error(data.error || 'Failed to delete category')
    return data.data
  }
}

// Query Hooks
export function useCategories(teamId?: string) {
  return useQuery<BusinessActivityCategory[], Error>({
    queryKey: ['activity-categories', teamId],
    queryFn: () => categoryApi.getCategories(teamId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateCategory() {
  return useMutation({
    mutationFn: categoryApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity-categories'] })
    }
  })
}

export function useUpdateCategory() {
  return useMutation({
    mutationFn: categoryApi.updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity-categories'] })
    }
  })
}

export function useDeleteCategory() {
  return useMutation({
    mutationFn: categoryApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity-categories'] })
    }
  })
}

// Zustand Store Types
interface CategoryModalState {
  formData: {
    name: string
    description: string
  }
  isDirty: boolean
}

interface CategoryStore {
  selectedCategory: BusinessActivityCategory | null
  isCreateModalOpen: boolean
  isEditModalOpen: boolean
  isDeleteDialogOpen: boolean
  modalState: CategoryModalState
  setSelectedCategory: (category: BusinessActivityCategory | null) => void
  setCreateModalOpen: (isOpen: boolean) => void
  setEditModalOpen: (isOpen: boolean) => void
  setDeleteDialogOpen: (isOpen: boolean) => void
  updateModalForm: (data: Partial<CategoryModalState['formData']>) => void
  resetModalForm: () => void
  hasChanges: () => boolean
}

const initialModalState: CategoryModalState = {
  formData: {
    name: '',
    description: ''
  },
  isDirty: false
}

// Zustand Store
export const useCategoryStore = create<CategoryStore>((set, get) => ({
  selectedCategory: null,
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isDeleteDialogOpen: false,
  modalState: initialModalState,

  setSelectedCategory: (category) => {
    set({ 
      selectedCategory: category,
      modalState: category ? {
        formData: {
          name: category.name,
          description: category.description || ''
        },
        isDirty: false
      } : initialModalState
    })
  },

  setCreateModalOpen: (isOpen) => {
    set({ 
      isCreateModalOpen: isOpen,
      modalState: isOpen ? initialModalState : get().modalState
    })
  },

  setEditModalOpen: (isOpen) => {
    set({ isEditModalOpen: isOpen })
    if (!isOpen) {
      set({ selectedCategory: null, modalState: initialModalState })
    }
  },

  setDeleteDialogOpen: (isOpen) => {
    set({ isDeleteDialogOpen: isOpen })
    if (!isOpen) {
      set({ selectedCategory: null })
    }
  },

  updateModalForm: (data) => {
    set(state => ({
      modalState: {
        formData: { ...state.modalState.formData, ...data },
        isDirty: true
      }
    }))
  },

  resetModalForm: () => {
    set({ modalState: initialModalState })
  },

  hasChanges: () => {
    const state = get()
    if (!state.modalState.isDirty) return false
    
    if (state.selectedCategory) {
      return state.modalState.formData.name !== state.selectedCategory.name ||
             state.modalState.formData.description !== (state.selectedCategory.description || '')
    }
    
    return state.modalState.formData.name !== '' || state.modalState.formData.description !== ''
  }
}))