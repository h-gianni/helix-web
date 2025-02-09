import { create } from 'zustand'
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query'
import type { ApiResponse } from '@/lib/types/api'
import { apiClient } from '@/lib/api/api-client'

interface MemberDetails {
  id: string
  firstName: string | null
  lastName: string | null
  title: string | null
  isAdmin: boolean
  user: {
    email: string
    name: string | null
  }
  goals: {
    id: string
    description: string
    year: number
  }[]
  team: {
    id: string
    name: string
  }
}

interface BusinessActivityRating {
  id: string
  name: string
  averageRating: number
  ratingsCount: number
}

interface QuarterlyPerformance {
  quarter: string
  averageRating: number
  totalRatings: number
}

interface MemberDashboardData {
  currentRating: number
  totalRatings: number
  currentQuarterRating: number
  quarterlyTrend: 'up' | 'down' | 'stable'
  totalFeedbacks: number
  teamPosition: number
  teamPositionTrend: 'up' | 'down' | 'stable'
  topActivities: BusinessActivityRating[]
  quarterlyPerformance: QuarterlyPerformance[]
}

interface RatingResponse {
  id: string
  value: number
  createdAt: string
  activity?: {
    id: string
    name: string
    description: string | null
  }
}

interface RatingsData {
  ratings: RatingResponse[]
  stats: {
    average: number
    count: number
  }
}


const queryClient = new QueryClient()

// API Layer
const memberApi = {
  getMemberDetails: async ({ teamId, memberId }: { teamId: string; memberId: string }) => {
    const { data } = await apiClient.get<ApiResponse<MemberDetails>>(`/teams/${teamId}/members/${memberId}`)
    if (!data.success) throw new Error(data.error || 'Failed to fetch member details')
    return data.data
  },

  updateMember: async ({ teamId, memberId, ...updateData }: { 
    teamId: string
    memberId: string
    firstName?: string
    lastName?: string
    title?: string 
  }) => {
    const { data } = await apiClient.patch(`/teams/${teamId}/members/${memberId}`, updateData)
    if (!data.success) throw new Error(data.error || 'Failed to update member')
    return data.data
  },

  addRating: async ({ teamId, memberId, ...ratingData }: {
    teamId: string
    memberId: string
    rating: number
    activities: string[]
    comment?: string
  }) => {
    const { data } = await apiClient.post(`/teams/${teamId}/members/${memberId}/ratings`, ratingData)
    if (!data.success) throw new Error(data.error || 'Failed to add rating')
    return data.data
  },

  getMemberDashboard: async ({ teamId, memberId }: { teamId: string; memberId: string }) => {
    const { data } = await apiClient.get<ApiResponse<MemberDashboardData>>(
      `/teams/${teamId}/members/${memberId}/dashboard`
    )
    if (!data.success) throw new Error(data.error || 'Failed to fetch dashboard data')
    return data.data
  },

  getMemberRatings: async ({ teamId, memberId }: { teamId: string; memberId: string }) => {
    const { data } = await apiClient.get<ApiResponse<RatingsData>>(
      `/teams/${teamId}/members/${memberId}/ratings`
    )
    if (!data.success) throw new Error(data.error || 'Failed to fetch ratings')
    return data.data
  }


}

// Query Hooks
export function useMemberDetails({ teamId, memberId }: { teamId: string; memberId: string }) {
  return useQuery({
    queryKey: ['member', teamId, memberId],
    queryFn: () => memberApi.getMemberDetails({ teamId, memberId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUpdateMember() {
  return useMutation({
    mutationFn: memberApi.updateMember,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['member', variables.teamId, variables.memberId] 
      })
    }
  })
}

export function useAddRating() {
  return useMutation({
    mutationFn: memberApi.addRating,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['member', variables.teamId, variables.memberId] 
      })
      queryClient.invalidateQueries({ 
        queryKey: ['member-ratings', variables.teamId, variables.memberId] 
      })
    }
  })
}

export function useMemberDashboard({ teamId, memberId }: { teamId: string; memberId: string }) {
  return useQuery({
    queryKey: ['member-dashboard', teamId, memberId],
    queryFn: () => memberApi.getMemberDashboard({ teamId, memberId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true
  })
}

export function useMemberRatings({ teamId, memberId }: { teamId: string; memberId: string }) {
  return useQuery({
    queryKey: ['member-ratings', teamId, memberId],
    queryFn: () => memberApi.getMemberRatings({ teamId, memberId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true
  })
}

// Zustand Store for UI State
interface MemberStore {
  selectedTab: 'dashboard' | 'ratings' | 'feedbacks' | 'goals'
  isEditModalOpen: boolean
  isRatingModalOpen: boolean
  setSelectedTab: (tab: 'dashboard' | 'ratings' | 'feedbacks' | 'goals') => void
  setEditModalOpen: (isOpen: boolean) => void
  setRatingModalOpen: (isOpen: boolean) => void
}

export const useMemberStore = create<MemberStore>((set) => ({
  selectedTab: 'dashboard',
  isEditModalOpen: false,
  isRatingModalOpen: false,
  setSelectedTab: (tab) => set({ selectedTab: tab }),
  setEditModalOpen: (isOpen) => set({ isEditModalOpen: isOpen }),
  setRatingModalOpen: (isOpen) => set({ isRatingModalOpen: isOpen })
}))