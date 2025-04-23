// src/store/performers-store.ts
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import { apiClient } from "@/lib/api/api-client";
import {
  TrendingUp,
  AlertCircle,
  Sparkle,
  BicepsFlexed,
  Smile,
  ArrowBigDownDash,
  LifeBuoy,
} from "lucide-react";
import type { Member, Rating, PerformanceCategory } from "./member";

const queryClient = new QueryClient();

const performersApi = {
  getPerformers: async () => {
    const { data } = await apiClient.get<{
      success: boolean;
      data: { performers: Member[] };
    }>("/dashboard/performers");
    if (!data.success) throw new Error("Failed to fetch performers");
    return data.data.performers;
  },

  createRating: async (rating: Rating) => {
    const { data } = await apiClient.post(
      `/teams/${rating.teamId}/members/${rating.memberId}/ratings`,
      {
        activityId: rating.activityId,
        value: rating.rating,
        feedback: rating.feedback,
      }
    );
    return data.data;
  },

  generateReview: async (memberId: string) => {
    const { data } = await apiClient.post(`/members/${memberId}/review`);
    return data.data;
  },
};

export const performanceCategories: PerformanceCategory[] = [
  {
    label: "Not Scored",
    minRating: 0,
    maxRating: 0,
    className: "text-foreground",
    Icon: AlertCircle,
    description: "Team members pending their first performance score.",
  },
  {
    label: "Star",
    minRating: 4.6,
    maxRating: 5,
    className: "",
    Icon: Sparkle,
    description:
      "Exceptional performance with consistent excellence and leadership.",
  },
  {
    label: "Strong",
    minRating: 4,
    maxRating: 4.5,
    className: "",
    Icon: BicepsFlexed,
    description:
      "Highly competent with strong contributions and reliable results.",
  },
  {
    label: "Solid",
    minRating: 3,
    maxRating: 3.9,
    className: "",
    Icon: Smile,
    description:
      "Consistently meets expectations with room for further growth.",
  },
  {
    label: "Lower",
    minRating: 2.1,
    maxRating: 2.9,
    className: "",
    Icon: ArrowBigDownDash,
    description:
      "Inconsistent performance with noticeable areas needing improvement.",
  },
  {
    label: "Poor",
    minRating: 1,
    maxRating: 2,
    className: "",
    Icon: LifeBuoy,
    description:
      "Significant performance concerns requiring immediate attention.",
  },
];

export default performanceCategories;

export function usePerformers() {
  return useQuery({
    queryKey: ["performers"],
    queryFn: performersApi.getPerformers,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateRating() {
  return useMutation({
    mutationFn: performersApi.createRating,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["performers"] });
    },
  });
}

export function useGenerateReview() {
  return useMutation({
    mutationFn: performersApi.generateReview,
  });
}

interface PerformersStore {
  isRatingModalOpen: boolean;
  selectedPerformerId: string | null;
  viewType: "table" | "grid";
  setIsOpen: (isOpen: boolean) => void;
  toggleRatingModal: () => void;
  setSelectedPerformerId: (id: string | null) => void;
  setViewType: (type: "table" | "grid") => void;
  getPerformanceCategory: (
    rating: number,
    ratingsCount: number
  ) => PerformanceCategory;
  getSortedMembers: (members: Member[]) => Member[];
  performanceCategories: PerformanceCategory[];
}

export const usePerformersStore = create<PerformersStore>((set) => ({
  isRatingModalOpen: false,
  selectedPerformerId: null,
  viewType: "table",
  setIsOpen: (isOpen) => set({ isRatingModalOpen: isOpen }),
  toggleRatingModal: () =>
    set((state) => ({ isRatingModalOpen: !state.isRatingModalOpen })),
  setSelectedPerformerId: (id) => set({ selectedPerformerId: id }),
  setViewType: (type) => set({ viewType: type }),

  getPerformanceCategory: (rating, ratingsCount) => {

    console.log("rating", rating, "ratingsCount", ratingsCount)

    if (ratingsCount === 0) {
      return {
        label: "No trend available",
        minRating: 0,
        maxRating: 0,
        className: "text-unavailable",
        Icon: TrendingUp,
      };
    }

    return (
      performanceCategories.find(
        (category) =>
          rating >= category.minRating && rating <= category.maxRating
      ) || {
        label: "Unknown",
        minRating: 0,
        maxRating: 0,
        className: "",
        Icon: TrendingUp,
      }
    );
  },

  getSortedMembers: (members) => {
    return [...members].sort((a, b) => {
      if (a.ratingsCount === 0 && b.ratingsCount === 0) return 0;
      if (a.ratingsCount === 0) return 1;
      if (b.ratingsCount === 0) return -1;
      return b.averageRating - a.averageRating;
    });
  },

  performanceCategories,
}));
