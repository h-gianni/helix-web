"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, LucideIcon } from "lucide-react";
import { MemberCard } from "@/components/ui/MemberCard";
import { MembersTable } from "@/components/ui/MembersTable";

interface Team {
  id: string;
  name: string;
}

interface MemberPerformance {
  id: string;
  name: string;
  title: string | null;
  averageRating: number;
  ratingsCount: number;
  teamId: string;
}

interface PerformanceCategory {
  label: string;
  minRating: number;
  maxRating: number;
  className: string;
  Icon: LucideIcon;
}

interface TeamPerformanceViewProps {
  members: MemberPerformance[];
  teams?: Team[];
  teamId?: string;
  showAvatar?: boolean;
  showActions?: boolean;
  onMemberDelete?: (member: MemberPerformance) => void;
  mode?: "compact" | "full";
  viewType?: "table" | "grid";
  onViewChange?: (value: "table" | "grid") => void;
}

const performanceCategories: PerformanceCategory[] = [
  {
    label: "Top",
    minRating: 4.6,
    maxRating: 5,
    className: "text-success-600",
    Icon: TrendingUp,
  },
  {
    label: "Strong",
    minRating: 4,
    maxRating: 4.5,
    className: "text-success-500",
    Icon: TrendingUp,
  },
  {
    label: "Solid",
    minRating: 3,
    maxRating: 3.9,
    className: "text-info-600",
    Icon: TrendingUp,
  },
  {
    label: "Lower",
    minRating: 2.1,
    maxRating: 2.9,
    className: "text-warning-600",
    Icon: TrendingUp,
  },
  {
    label: "Poor",
    minRating: 1,
    maxRating: 2,
    className: "text-danger-600",
    Icon: TrendingUp,
  },
];

const getPerformanceCategory = (
  rating: number,
  ratingsCount: number
): PerformanceCategory => {
  if (ratingsCount === 0) {
    return {
      label: "No Ratings",
      minRating: 0,
      maxRating: 0,
      className: "text-muted-foreground",
      Icon: TrendingUp,
    };
  }

  return (
    performanceCategories.find(
      (category) => rating >= category.minRating && rating <= category.maxRating
    ) || {
      label: "Unknown",
      minRating: 0,
      maxRating: 0,
      className: "text-muted-foreground",
      Icon: TrendingUp,
    }
  );
};

export function TeamPerformanceView({
  members,
  teams = [],
  teamId,
  showAvatar = true,
  showActions = true,
  onMemberDelete,
  mode = "full",
  viewType = "grid",
  onViewChange,
}: TeamPerformanceViewProps) {
  const router = useRouter();

  // Sort members by rating, handling cases with no ratings
  const sortedMembers = [...members].sort((a, b) => {
    if (a.ratingsCount === 0 && b.ratingsCount === 0) return 0;
    if (a.ratingsCount === 0) return 1;
    if (b.ratingsCount === 0) return -1;
    return b.averageRating - a.averageRating;
  });

  const handleGenerateReview = (member: MemberPerformance) => {
    console.log("Generate review clicked", member);
    // Implement review generation logic
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  if (members.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No team members found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {viewType === "table" ? (
        <MembersTable
          members={sortedMembers}
          teams={teams}
          teamId={teamId}
          showAvatar={showAvatar}
          showActions={showActions}
          onDelete={onMemberDelete}
          onGenerateReview={handleGenerateReview}
          onNavigate={handleNavigate}
          performanceCategories={performanceCategories}
          getPerformanceCategory={getPerformanceCategory}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedMembers.map((member) => {
            const category = getPerformanceCategory(
              member.averageRating,
              member.ratingsCount
            );
            return (
              <MemberCard
                key={member.id}
                member={member}
                teamId={teamId}
                teams={teams}
                category={category}
                onDelete={onMemberDelete}
                onGenerateReview={handleGenerateReview}
                variant={mode === "compact" ? "compact" : "default"}
                onNavigate={handleNavigate}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}