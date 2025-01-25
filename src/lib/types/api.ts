// lib/types/api.ts
import { Priority, BusinessActivityStatus, TeamMemberStatus, ReviewStatus, Prisma } from "@prisma/client";

// Define a type for JSON fields
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

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
  teamFunctionId: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  customFields?: JsonValue;
};

export type TeamMemberResponse = {
  id: string;
  userId: string;
  teamId: string;
  title: string | null;
  isAdmin: boolean;
  status: TeamMemberStatus;
  firstName: string | null;
  lastName: string | null;
  photoUrl: string | null;
  joinedDate: Date | null;
  jobGradeId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  customFields?: JsonValue;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
};

export type TeamDetailsResponse = TeamResponse & {
  members: TeamMemberResponse[];
  
  businessActivities: BusinessActivityResponse[];
  teamFunction?: {
    id: string;
    name: string;
    description: string | null;
    jobTitles: JobTitleResponse[];
    createdAt: Date;
    updatedAt: Date;
  };
};

// BusinessActivity types
export type BusinessActivityResponse = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  priority: Priority;
  status: BusinessActivityStatus;
  dueDate: Date | null;
  teamId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  customFields?: JsonValue;
  ratings?: RatingResponse[];
  _count?: {
    ratings: number;
  };
};

// Rating types
export type RatingResponse = {
  id: string;
  value: number;
  teamMemberId: string;
  activityId: string;
  createdAt: Date;
  updatedAt: Date;
  teamMember?: {
    id: string;
    user: {
      id: string;
      email: string;
      name: string | null;
    };
  };
  activity?: {
    id: string;
    name: string;
    description: string | null;
  };
};

export type TeamFunctionResponse = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  customFields?: JsonValue;
  jobTitles: JobTitleResponse[];
  _count?: {
    teams: number;
  };
};

export type JobTitleResponse = {
  id: string;
  name: string;
  teamFunctionId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  customFields?: JsonValue;
};

// Feedback and Review types
export type StructuredFeedbackResponse = {
  id: string;
  strengths: string[];
  improvements: string[];
  goals: string[];
  teamMemberId: string;
  createdAt: Date;
  updatedAt: Date;
  customFields?: JsonValue;
  teamMember?: {
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
  status: ReviewStatus;
  version: number;
  teamMemberId: string;
  createdAt: Date;
  updatedAt: Date;
  customFields?: JsonValue;
  teamMember?: {
    id: string;
    userId: string;
    teamId: string;
  };
};

// Input types
export type CreateTeamInput = {
  name: string;
  teamFunctionId: string;
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
  status?: TeamMemberStatus;
};

export type CreateBusinessActivityInput = {
  name: string;
  description?: string;
  category?: string;
  priority?: Priority;
  dueDate?: Date;
  teamId: string;
};

export type UpdateBusinessActivityInput = {
  name?: string;
  description?: string | null;
  category?: string | null;
  priority?: Priority;
  status?: BusinessActivityStatus;
  dueDate?: Date | null;
};

export type CreateRatingInput = {
  value: number;
  teamMemberId: string;
  activityId: string;
};

export type UpdateRatingInput = {
  value?: number;
};

export type CreateTeamFunctionInput = {
  name: string;
  description?: string;
  jobTitles?: string[];
  customFields?: Prisma.InputJsonValue; 
};

export type UpdateTeamFunctionInput = {
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
  typeof PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;