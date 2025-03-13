"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

  // Get the default view type based on member count
  const getDefaultViewByMemberCount = () => {
    return members.length > 5 ? "table" : "grid";
  };

  // We'll use a ref to track if we've applied user choices yet
  const hasInitialized = React.useRef(false);
  
  // Store our actual view in state
  const [activeView, setActiveView] = useState(getDefaultViewByMemberCount());

  // Set up device variant (mobile/desktop)
  const [cardVariant, setCardVariant] = useState(mode);

  // When viewType changes due to user selection, update our view
  useEffect(() => {
    if (hasInitialized.current) {
      setActiveView(viewType);
    } else {
      // First time initialization - always use member count logic
      const defaultView = getDefaultViewByMemberCount();
      setActiveView(defaultView);
      
      // If default view doesn't match store, update the store
      if (defaultView !== viewType && onViewChange) {
        onViewChange(defaultView);
      }
      
      hasInitialized.current = true;
    }
  }, [viewType, members.length]);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // On mobile, always use grid view
        setActiveView("grid");
      } else {
        // On desktop, use current viewType (user choice or default)
        setActiveView(viewType);
      }
      
      // Update card variant based on screen size
      setCardVariant(window.innerWidth < 768 ? "mobile" : mode);
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, [mode, viewType]);

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
      {activeView === "table" ? (
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