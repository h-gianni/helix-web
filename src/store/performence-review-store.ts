import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { create } from "zustand";
import { apiClient } from "@/lib/api/api-client";


interface GenerateReviewParams {
    memberId: string;
    teamId: string;
    quarter: number;
    year: number;
    content?: string;
  }
  
  interface Review {
    id: string;
    content: string;
    quarter: number;
    year: number;
    status: string;
  }

  const performersReviewApi = { 

    // Fetch a specific review
    getSpecificReview: async (reviewId: string) => {
        const { data } = await apiClient.get<Review>(`/members/reviews/${reviewId}`);
        if (!data) throw new Error("Failed to fetch review");
        return data;
    },

    getAllReviews: async (memberId: string) => {
      const { data } = await apiClient.get<{
            success: boolean;
            data: { performers: Review[] }}>(`/members/${memberId}/reviews`);
            if (!data.success) throw new Error("Failed to fetch performers");
            return data.data.performers as Review[];
    },
    
    generateReview: async ({ memberId, teamId, quarter, year, content }: GenerateReviewParams) => {
        console.log('genertaed review-------------------', { memberId, teamId, quarter, year, content });
        const { data } = await apiClient.post(`/members/${memberId}/reviews`, { teamId, quarter, year, content });
        if (!data.success) throw new Error("Failed to generate review");
        return data.data;
    }
  }

    // Fetch a specific review
  export function useSpecificReview(reviewId: string) {
    return useQuery({
      queryKey: ["reviews", reviewId],
      queryFn: () => performersReviewApi.getSpecificReview,
      staleTime: 5 * 60 * 1000,
    });
  } 

  // Fetch all reviews for a member
  export function usePerformersReview(memberId: string) {
    return useQuery({
      queryKey: ["reviews", memberId],
      queryFn: () => performersReviewApi.getAllReviews(memberId),
      staleTime: 5 * 60 * 1000,
    });
  }

  export function usePerformanceReview() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: performersReviewApi.generateReview,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['userPerformanceReview'] });
    }
    });
  }


  

