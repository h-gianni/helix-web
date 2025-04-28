// types/member.ts
export interface TeamMember {
    id: string;
    name: string;
    email: string;
    title?: string | null;
  }
  
  export interface MemberData {
    id: string;
    name: string;
    title: string | null;
    email: string;
    averageRating?: number;
    ratingsCount?: number;
    teamId: string;
    teamName: string;
  }