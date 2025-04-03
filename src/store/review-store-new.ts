// src/store/review-store.ts
import { create } from 'zustand';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface GenerateReviewState {
  isGenerating: boolean;
  error: Error | null;
  reviewStatus: 'idle' | 'generating' | 'completed' | 'error';
  reviewId: string | null;
  setReviewId: (id: string | null) => void;
  reset: () => void;
}

export const useReviewStore = create<GenerateReviewState>((set) => ({
  isGenerating: false,
  error: null,
  reviewStatus: 'idle',
  reviewId: null,
  setReviewId: (id) => set({ reviewId: id }),
  reset: () => set({ 
    isGenerating: false, 
    error: null, 
    reviewStatus: 'idle',
    reviewId: null
  }),
}));

// API Types
export interface ReviewRequest {
  period?: 'quarter' | 'year' | 'custom';
  quarterNumber?: number;
  year?: number;
  customStartDate?: string;
  customEndDate?: string;
}

interface ReviewResponse {
  success: boolean;
  data?: {
    review: {
      id: string;
      content: string;
      status: string;
      version: number;
      createdAt: string;
      [key: string]: any;
    };
    analysis: {
      overallAssessment: {
        score: number;
        description: string;
        summary: string;
      };
      categoryAssessments: Array<{
        categoryId: string;
        categoryName: string;
        score: number;
        scoreDescription: string;
        strength: boolean;
        concernArea: boolean;
        improvementNeeded: boolean;
        observations: string[];
        recommendations: string[];
      }>;
      strengths: string[];
      developmentAreas: string[];
      recommendations: string[];
      dataQuality: {
        ratingCount: number;
        uniqueCategories: number;
        feedbackCount: number;
        commentsCount: number;
        dataCompleteness: 'insufficient' | 'minimal' | 'adequate' | 'comprehensive';
      }
    };
  };
  error?: string;
  details?: string;
  recommendations?: string[];
  missingData?: {
    ratingsCount: number;
    feedbackCount: number;
    commentsCount: number;
    minRequired: {
      ratings: number;
      categories: number;
    }
  };
}

// Hook for generating a review
export function useGenerateReview() {
  const queryClient = useQueryClient();
  const { setReviewId } = useReviewStore();
  
  return useMutation({
    mutationFn: async (params: { memberId: string, options?: ReviewRequest }) => {
      const { memberId, options = {} } = params;

      console.log('Generating review for member:', memberId);
      console.log('Options:', options);
      
      const response = await fetch(`/api/members/${memberId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });
      
      const data: ReviewResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate review');
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate review');
      }
      
      // Store the review ID in the zustand store if available
      if (data.data?.review?.id) {
        setReviewId(data.data.review.id);
      }
      
      return data;
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['memberReviews'] });
    },
  });
}

// Hook for fetching a specific review
export function useReview(reviewId: string | null) {
  return useQuery({
    queryKey: ['review', reviewId],
    queryFn: async () => {
      if (!reviewId) return null;
      
      const response = await fetch(`/api/reviews/${reviewId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch review');
      }
      
      return data.data;
    },
    enabled: !!reviewId, // Only fetch when reviewId is available
  });
}

// Hook for fetching all reviews for a member
export function useMemberReviews(memberId: string) {
  return useQuery({
    queryKey: ['memberReviews', memberId],
    queryFn: async () => {
      const response = await fetch(`/api/members/${memberId}/reviews`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch member reviews');
      }
      
      return data.data;
    },
    enabled: !!memberId,
  });
}

// Helper function to determine if there is sufficient data for a review
export function getDataSufficiencyMessage(missingData?: ReviewResponse['missingData']) {
  if (!missingData) return null;
  
  const { ratingsCount, feedbackCount, minRequired } = missingData;
  
  let message = `We don't have enough data to generate a fair and comprehensive review.`;
  
  if (ratingsCount < minRequired.ratings) {
    message += ` We currently have ${ratingsCount} ratings, but need at least ${minRequired.ratings}.`;
  }
  
  return {
    title: "Insufficient Data for Review Generation",
    message,
    recommendation: "Please continue to regularly score performance across various activities to enable a fair assessment."
  };
}