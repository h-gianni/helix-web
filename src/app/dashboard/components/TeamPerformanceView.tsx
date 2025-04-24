"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MemberCard } from "@/components/ui/composite/MemberCard";
import { MembersTable } from "@/components/ui/composite/MembersTable";
import { Card, CardContent } from "@/components/ui/core/Card";
import { PerformanceVariant } from "@/components/ui/core/PerformanceBadge";
import { usePerformersStore } from "@/store/performers-store";
import { cn } from "@/lib/utils";
import { PerformanceCategory } from "@/store/member";
import { TrendVariant } from "@/components/ui/core/TrendBadge";

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
  showTableHead?: boolean;
  className?: string;
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
  showTableHead = true,
  className,
  mode = "mobile",
  viewType = "grid",
  onViewChange,
}: TeamPerformanceViewProps) {
  const router = useRouter();
  const { getSortedMembers, getPerformanceCategory } = usePerformersStore();

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
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, [mode, viewType]);

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  // Helper function to ensure category has required variant property
  const ensureCompleteCategory = (categoryData: any): PerformanceCategory => {
    // Check if we have valid performance data to determine the variant
    const hasPerformanceData = 
      categoryData.averageRating !== undefined && 
      categoryData.averageRating !== null && 
      categoryData.ratingsCount !== 0;
    
    // Default to unavailable if no performance data exists
    const variantValue = hasPerformanceData 
      ? (categoryData.variant || mapVariantFromRating(categoryData.label))
      : "unavailable";
    
    // Check if we have trend data
    const hasTrendData = 
      categoryData.averageRating !== undefined && 
      categoryData.averageRating !== null;
    
    // Default to undefined for trend if no data available
    const trendValue = hasTrendData
      ? (categoryData.trend || determineTrendVariant(categoryData.averageRating))
      : undefined;
    
    return {
      ...categoryData,
      variant: variantValue,
      trend: trendValue,
      noPerformanceData: !hasPerformanceData,
      noTrendData: !hasTrendData
    } as PerformanceCategory;
  };

  // Helper function to determine trend variant based on rating
  const determineTrendVariant = (rating: number): TrendVariant | undefined => {
    if (rating > 4.0) return "up";
    if (rating < 2.5) return "down";
    return "stable";
  };

  // Helper function to map performance labels to variants
  const mapVariantFromRating = (label?: string): PerformanceVariant => {
    if (!label) return "unavailable";
    
    const labelLower = (label || "").toLowerCase();
    if (labelLower.includes("star")) return "star";
    if (labelLower.includes("strong")) return "strong";
    if (labelLower.includes("solid")) return "solid";
    if (labelLower.includes("inconsistent")) return "inconsistent";
    if (labelLower.includes("needs help") || labelLower.includes("low")) return "low";
    
    return "unavailable"; // Default changed from "solid" to "unavailable"
  };

  if (members.length === 0) {
    return (
      <Card data-slot="card">
        <CardContent
          data-slot="card-content"
          className="flex items-center justify-center py-8"
        >
          <p className="text-unavailable">No team members found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {activeView === "table" ? (
        <MembersTable
          members={sortedMembers}
          teams={teams}
          teamId={teamId}
          showAvatar={showAvatar}
          showActions={showActions}
          showTableHead={showTableHead}
          onNavigate={handleNavigate}
          className="shadow-sm"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {sortedMembers.map((member) => {
            const rawCategory = getPerformanceCategory(
              member.averageRating,
              member.ratingsCount
            );
            // Ensure category has all required properties
            const completeCategory = ensureCompleteCategory(rawCategory);
            
            return (
              <MemberCard
                key={member.id}
                member={member}
                teamId={teamId}
                teams={teams}
                category={completeCategory}
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