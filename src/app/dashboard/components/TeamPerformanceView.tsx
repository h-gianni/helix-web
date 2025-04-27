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
  
  // Determine if we're on mobile
  const [isMobile, setIsMobile] = useState(false);
  
  // Track the active view - this will always respect the viewType from props 
  // except on mobile where we force grid view
  const [activeView, setActiveView] = useState(viewType);

  // Handle responsive layout - only use this to set mobile detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update activeView when viewType prop changes or mobile status changes
  useEffect(() => {
    // On mobile, always use grid view
    if (isMobile) {
      setActiveView("grid");
    } else {
      // On desktop, respect the viewType from props (store)
      setActiveView(viewType);
    }
  }, [viewType, isMobile]);

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
    
    // Default to not-scored if no performance data exists
    const variantValue = hasPerformanceData 
      ? (categoryData.variant || mapVariantFromRating(categoryData.label))
      : "not-scored";
    
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
    if (!label) return "not-scored";
    
    const labelLower = (label || "").toLowerCase();
    if (labelLower.includes("star")) return "star";
    if (labelLower.includes("strong")) return "strong";
    if (labelLower.includes("solid")) return "solid";
    if (labelLower.includes("lower")) return "lower";
    if (labelLower.includes("needs help") || labelLower.includes("poor")) return "poor";
    
    return "not-scored"; // Default changed from "solid" to "not-scored"
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
                variant={isMobile ? "mobile" : mode}
                onNavigate={handleNavigate}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}