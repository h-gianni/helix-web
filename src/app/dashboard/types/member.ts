// app/dashboard/types/member.ts
import { LucideIcon } from 'lucide-react';

export interface MemberPerformance {
  id: string;
  name: string;
  title: string | null;
  teamId: string;
  teamName?: string;
  averageRating: number;
  ratingsCount: number;
}

export interface PerformanceCategory {
  label: string;
  minRating: number;
  maxRating: number;
  className: string;
  Icon: LucideIcon;
  description?: string;
}