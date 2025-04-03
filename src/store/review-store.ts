// src/store/review-store.ts
import { create } from "zustand";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReviewStatus } from "@prisma/client";

interface ReviewState {
  isReviewModalOpen: boolean;
  setReviewModalOpen: (isOpen: boolean) => void;
  selectedReviewId: string | null;
  setSelectedReviewId: (id: string | null) => void;
}


interface Review {
  id: string;
  content: string;
  quarter: number;
  year: number;
  status: ReviewStatus;
  version: number;
  teamMemberId: string;
  createdAt: string;
  updatedAt: string;
}

interface GenerateReviewParams {
  memberId: string;
  teamId: string;
  quarter: number;
  year: number;
}

interface UpdateReviewParams {
  reviewId: string;
  content: string;
  status?: ReviewStatus;
}

export const useReviewStore = create<ReviewState>((set) => ({
  isReviewModalOpen: false,
  setReviewModalOpen: (isOpen) => set({ isReviewModalOpen: isOpen }),
  selectedReviewId: null,
  setSelectedReviewId: (id) => set({ selectedReviewId: id }),
}));

// React Query hooks for reviews
export const useReviews = (memberId: string) => {
  return useQuery({
    queryKey: ["reviews", memberId],
    queryFn: async () => {
      const response = await fetch(`/api/members/${memberId}/reviews`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch reviews");
      }
      
      return data.data as Review[];
    },
    enabled: !!memberId,
  });
};

export const useReview = (reviewId: string | null) => {
  return useQuery({
    queryKey: ["review", reviewId],
    queryFn: async () => {
      if (!reviewId) throw new Error("Review ID is required");
      
      const response = await fetch(`/api/members/reviews/${reviewId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch review");
      }
      
      return data.data as Review;
    },
    enabled: !!reviewId,
  });
};

export const useGenerateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      memberId,
      teamId,
      quarter,
      year,
    }: GenerateReviewParams) => {
      const response = await fetch(`/api/members/${memberId}/generateReview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamId, quarter, year }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate review");
      }

      return data.data as Review;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.memberId] });
      queryClient.setQueryData(["review", data.id], data);
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ reviewId, content, status }: UpdateReviewParams) => {
      const response = await fetch(`/api/members/reviews/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update review");
      }

      return data.data as Review;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["review", data.id] });
      queryClient.invalidateQueries({ queryKey: ["reviews", data.teamMemberId] });
    },
  });
};

export const usePublishReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reviewId: string) => {
      const response = await fetch(`/api/members/reviews/${reviewId}/publish`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to publish review");
      }

      return data.data as Review;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["review", data.id] });
      queryClient.invalidateQueries({ queryKey: ["reviews", data.teamMemberId] });
    },
  });
};