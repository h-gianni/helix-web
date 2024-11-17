export type ApiResponse<T> = {
  success: true;
  data: T;
  error?: never;
} | {
  success: false;
  data?: never;
  error: string;
};

// Existing team types
export type TeamResponse = {
  id: string;
  name: string;
  description: string | null;
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
  initiatives: InitiativeResponse[];
};

export type CreateTeamInput = {
  name: string;
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

// New Initiative types
export type InitiativeResponse = {
  id: string;
  name: string;
  description: string | null;
  teamId: string;
  createdAt: Date;
  updatedAt: Date;
  scores?: ScoreResponse[];
  _count?: {
    scores: number;
  };
};

export type CreateInitiativeInput = {
  name: string;
  description?: string;
  teamId: string;
};

export type UpdateInitiativeInput = {
  name?: string;
  description?: string | null;
};

// Score types for initiatives
export type ScoreResponse = {
  id: string;
  value: number;
  feedback: string | null;
  memberId: string;
  initiativeId: string;
  createdAt: Date;
  updatedAt: Date;
  member?: TeamMemberResponse;
  initiative?: {
    id: string;
    name: string;
    description: string | null;
  };
};

export type CreateScoreInput = {
  value: number;
  feedback?: string;
  memberId: string;
  initiativeId: string;
};

export type UpdateScoreInput = {
  value?: number;
  feedback?: string | null;
};

// Aggregate types for dashboard views
export type InitiativeWithStats = InitiativeResponse & {
  averageScore: number;
  totalScores: number;
  recentScores: ScoreResponse[];
};

export type MemberScoreSummary = {
  memberId: string;
  initiativeId: string;
  averageScore: number;
  scoreCount: number;
  lastScore: ScoreResponse;
};

export type TeamInitiativeSummary = {
  initiativeCount: number;
  activeInitiatives: InitiativeResponse[];
  recentScores: ScoreResponse[];
  memberPerformance: MemberScoreSummary[];
};