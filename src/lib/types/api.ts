// lib/types/api.ts
import { Priority, BusinessActivityStatus, TeamMemberStatus, ReviewStatus, Prisma, OrgActionStatus } from "@prisma/client";

// Define a type for JSON fields
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type ApiResponse<T> =
  | {
      success: true;
      data?: T;
      error?: never;
    }
  | {
      success: false;
      data?: never;
      error?: string;
    };

// Team types
export interface TeamResponse {
  id: string;
  name: string;
  description?: string | null;
  teamFunctionId: string;
  ownerId: string;
  customFields?: JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  teamFunction?: {
    id: string;
    name: string;
  } | null;
  members: Array<Pick<TeamMemberResponse, 'id' | 'title'> & {
    name: string | null;
    email: string;
  }>;
  averagePerformance?: number;
}
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

export type TeamDetailsResponse = Omit<TeamResponse, 'members'> & {
  members: TeamMemberResponse[];
  businessActivities: BusinessActivityResponse[];
  teamFunction: {
    id: string;
    name: string;
    description: string | null;
    jobTitles: JobTitleResponse[];
    createdAt: Date;
    updatedAt: Date;
  } | null;
};

export interface CategoryResponse {
  id: string;
  name: string;
  description: string | null;
}

export interface ActivityData {
  id: string;
  name: string;
  description: string | null;
  impactScale: number | null;
  categoryId: string; // This was missing
  category: CategoryResponse;
}

// export interface BusinessActivityResponse {
//   id: string;
//   activityId: string; // This was missing
//   priority: Priority;
//   status: OrgActionStatus;
//   dueDate: Date | null;
//   teamId: string;
//   createdBy: string;
//   createdAt: Date;
//   updatedAt: Date;
//   deletedAt: Date | null;
//   customFields?: JsonValue;
//   activity: ActivityData;
//   team: {
//     id: string;
//     name: string;
//   };
//   _count?: {
//     ratings: number;
//   };
// }

export interface OrgActionResponse {
  id: string;
  name: string;
  description: string | null;
  actionId: string;
  category: CategoryResponse;

  priority: Priority;
  status: OrgActionStatus;
  dueDate: Date | null;
  teamId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  customFields?: JsonValue;
  activity: {  // Renamed from activity to match relation name in schema
    id: string;
    name: string;
    description: string | null;
    impactScale: number | null;
    category: {
      id: string;
      name: string;
      description: string | null;
    };
  };
  team: {
    id: string;
    name: string;
  };
  _count?: {
    scores: number;  // Changed from ratings to scores to match schema
  };
}

// You can keep BusinessActivityResponse as an alias for backward compatibility
export type BusinessActivityResponse = OrgActionResponse;

// export interface OrgActionResponse {
//   id: string;
//   actionId: string;
//   priority: Priority;
//   status: OrgActionStatus;
//   dueDate: string | null;
//   teamId: string;
//   createdBy: string;
//   createdAt: string;
//   updatedAt: string;
//   deletedAt: string | null;
//   customFields: Record<string, any> | null;
//   _count: {
//     scores: number;
//   };
// }

export interface ActivityResponse {
  id: string;
  name: string;
  description: string | null;
  category: {
    id: string;
    name: string;
    description: string | null;
  };
  priority: Priority;
  status: BusinessActivityStatus;
  dueDate: Date | null;
  teamId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  customFields?: JsonValue;
  team: {
    id: string;
    name: string;
  };
  impactScale: number | null;
  _count?: {
    scores: number;
  };
}

export interface BusinessActivityCategoryResponse {
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
      // name: string
      status: string
      priority: string
    }[]
  }[]
}

export interface CreateBusinessActivityCategoryInput {
  name: string
  description?: string
}
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

// export type CreateBusinessActivityInput = {
//   name: string;
//   description?: string;
//   category?: string;
//   priority?: Priority;
//   dueDate?: Date;
//   teamId: string;
// };

// export type UpdateBusinessActivityInput = {
//   name?: string;
//   description?: string | null;
//   category?: string | null;
//   priority?: Priority;
//   status?: BusinessActivityStatus;
//   dueDate?: Date | null;
// };

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

// export type TransactionClient = Omit<
//   typeof PrismaClient,
//   "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
// >;


export type CreateActivityInput = {
  activityId: string;    // ID of the base activity to link
  teamId: string;        // Team ID
  priority?: Priority;   // Optional priority, defaults to MEDIUM
  status?: BusinessActivityStatus; // Optional status, defaults to ACTIVE
  dueDate?: Date;       // Optional due date
};


// Input types should also match the model
export type CreateOrgActionInput = {
  actionId: string;    // ID of the base action to link
  teamId: string;      // Team ID
  priority?: Priority; // Optional priority
  status?: OrgActionStatus; // Optional status
  dueDate?: Date;      // Optional due date
};

export type UpdateOrgActionInput = {
  priority?: Priority;
  status?: OrgActionStatus;
  dueDate?: Date | null;
};

// Keep old types for backward compatibility
export type CreateBusinessActivityInput = CreateOrgActionInput;
export type UpdateBusinessActivityInput = UpdateOrgActionInput;