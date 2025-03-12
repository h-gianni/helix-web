"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { MemberCard } from "@/components/ui/composite/Member-card";
import { MembersTable } from "@/components/ui/composite/Members-table";
import { Card, CardContent } from "@/components/ui/core/Card";
import { usePerformersStore, useGenerateReview } from "@/store/performers-store";

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
  teamName: string;
}

interface TeamPerformanceViewProps {
  members: MemberPerformance[];
  teams?: Team[];
  teamId?: string;
  showAvatar?: boolean;
  showActions?: boolean;
  onMemberDelete?: (member: MemberPerformance) => void;
  mode?: "desktop" | "mobile";
  viewType?: "table" | "grid";
  onViewChange?: (value: "table" | "grid") => void;
}

export function TeamPerformanceView({
  members,
  teams = [],
  teamId,
  showAvatar = true,
  showActions = true,
  onMemberDelete,
  mode = "mobile",
  viewType = "grid",
  onViewChange,
}: TeamPerformanceViewProps) {
  const router = useRouter();
  const { getSortedMembers, getPerformanceCategory, performanceCategories } =
    usePerformersStore();
  const { mutate: generateReview } = useGenerateReview();

  const sortedMembers = getSortedMembers(members);

  // Determine initial view type based on member count
  const getDefaultViewByMemberCount = () => {
    return members.length > 5 ? "table" : "grid";
  };

  // Create state for effective view type with initial value
  const [effectiveViewType, setEffectiveViewType] = useState(() => {
    // On first render, determine view based on member count
    // If viewType is explicitly provided, use that instead
    return viewType !== "grid" && viewType !== "table" 
      ? getDefaultViewByMemberCount()
      : viewType;
  });

  // Update view type when viewType prop changes or when members count changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Force card view on mobile
        setEffectiveViewType("grid");
      } else {
        // On desktop, check if viewType is explicitly provided
        if (viewType === "grid" || viewType === "table") {
          setEffectiveViewType(viewType);
        } else {
          // Otherwise use member count logic
          setEffectiveViewType(getDefaultViewByMemberCount());
        }
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, [viewType, members.length]);

  // Determine the correct variant based on screen width
  const getCorrectVariant = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? "mobile" : mode;
    }
    return mode; // Default to the prop value during SSR
  };

  const [cardVariant, setCardVariant] = React.useState(mode);

  // Update variant on mount and when screen size changes
  React.useEffect(() => {
    const handleResize = () => {
      setCardVariant(window.innerWidth < 768 ? "mobile" : mode);
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, [mode]);

  const handleGenerateReview = (member: MemberPerformance) => {
    generateReview(member.id);
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  if (members.length === 0) {
    return (
      <Card data-slot="card">
        <CardContent data-slot="card-content" className="flex items-center justify-center py-8">
          <p>No team members found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {effectiveViewType === "table" ? (
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {sortedMembers.map((member) => {
            const category = getPerformanceCategory(member.averageRating, member.ratingsCount);
            return (
              <MemberCard
                key={member.id}
                member={member}
                teamId={teamId}
                teams={teams}
                category={category}
                onDelete={onMemberDelete}
                onGenerateReview={handleGenerateReview}
                variant={cardVariant}
                onNavigate={handleNavigate}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}