// lib/types/api.ts
import { PrismaClient } from "@prisma/client";

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
      error?: never;
    }
  | {
      success: false;
      data?: never;
      error: string;
    };

// Team types
export type TeamResponse = {
  id: string;
  name: string;
  description?: string | null;
  businessFunctionId: string;
  businessFunction: BusinessFunctionResponse;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
};

export type TeamMemberResponse = {
  id: string;
  userId: string;
  teamId: string;
  title: string | null;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
};

export type TeamDetailsResponse = TeamResponse & {
  members: TeamMemberResponse[];
  businessActivities: BusinessActivityResponse[];
};

// BusinessActivity types (formerly Initiative)
export type BusinessActivityResponse = {
  id: string;
  name: string;
  description: string | null;
  teamId: string | null;
  createdAt: Date;
  updatedAt: Date;
  ratings?: RatingResponse[];
  _count?: {
    ratings: number;
  };
};

// Rating types (formerly Score)
export type RatingResponse = {
  id: string;
  value: number;
  feedback: string | null;
  memberId: string;
  activityId: string;
  createdAt: Date;
  updatedAt: Date;
  member?: TeamMemberResponse;
  activity?: {
    id: string;
    name: string;
    description: string | null;
  };
};

// BusinessFunction types (formerly Discipline)
export type BusinessFunctionResponse = {
  id: string;
  name: string;
  description: string | null;
  jobTitles: JobTitleResponse[];
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    teams: number;
  };
};

export type JobTitleResponse = {
  id: string;
  name: string;
  businessFunctionId: string;
  createdAt: Date;
  updatedAt: Date;
};

// Feedback and Review types
export type StructuredFeedbackResponse = {
  id: string;
  strengths: string[];
  improvements: string[];
  goals: string[];
  memberId: string;
  createdAt: Date;
  updatedAt: Date;
  member?: {
    id: string;
    userId: string;
    teamId: string;
  };
};

export type PerformanceReviewResponse = {
  id: string;
  quarter: number;
  year: number;
  content: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ACKNOWLEDGED';
  memberId: string;
  createdAt: Date;
  updatedAt: Date;
  member?: {
    id: string;
    userId: string;
    teamId: string;
  };
};

// Input types
export type CreateTeamInput = {
  name: string;
  businessFunctionId: string;
  description?: string;
};

export type AddTeamMemberInput = {
  email: string;
  title?: string;
  isAdmin?: boolean;
};

export type UpdateTeamMemberInput = {
  firstName?: string | null;
  lastName?: string | null;
  title?: string | null;
  isAdmin?: boolean;
};

export type CreateBusinessActivityInput = {
  name: string;
  description?: string;
  teamId: string;
};

export type UpdateBusinessActivityInput = {
  name?: string;
  description?: string | null;
};

export type CreateRatingInput = {
  value: number;
  feedback?: string;
  memberId: string;
  activityId: string;
};

export type UpdateRatingInput = {
  value?: number;
  feedback?: string | null;
};

export type CreateBusinessFunctionInput = {
  name: string;
  description?: string;
  jobTitles?: string[];
};

export type UpdateBusinessFunctionInput = {
  name?: string;
  description?: string | null;
};

// Aggregate types
export type BusinessActivityWithStats = BusinessActivityResponse & {
  averageRating: number;
  totalRatings: number;
  recentRatings: RatingResponse[];
};

export type MemberRatingSummary = {
  memberId: string;
  activityId: string;
  averageRating: number;
  ratingCount: number;
  lastRating: RatingResponse;
};

export type TeamBusinessActivitySummary = {
  activityCount: number;
  activeActivities: BusinessActivityResponse[];
  recentRatings: RatingResponse[];
  memberPerformance: MemberRatingSummary[];
};

export type TransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;