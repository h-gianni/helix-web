// src/store/member.ts
import type { LucideIcon } from "lucide-react";
import { PerformanceVariant } from "@/components/ui/core/PerformanceBadge";
import { TrendVariant } from "@/components/ui/core/TrendBadge";

export interface PerformanceCategory {
  label: string;
  minRating: number;
  maxRating: number;
  className?: string;
  Icon: LucideIcon | null;
  description?: string;
  // Added UI-specific properties
  variant: PerformanceVariant;
  trend?: TrendVariant;
}

// This is our base member type used across the application
export interface Member {
  id: string;
  name: string;
  title: string | null;
  teamId: string;
  teamName: string; // Required in all cases
  averageRating: number;
  ratingsCount: number;
}

// We don't need MemberPerformance anymore since it's identical to Member
export type MemberPerformance = Member;

export interface Rating {
  teamId: string;
  memberId: string;
  activityId: string;
  rating: number;
  feedback?: string;
}