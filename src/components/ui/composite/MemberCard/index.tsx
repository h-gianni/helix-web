"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/core/Card";
import { Avatar, AvatarFallback } from "@/components/ui/core/Avatar";
import StarRating from "@/components/ui/core/StarRating";
import { cn } from "@/lib/utils";
import { PerformanceBadge } from "@/components/ui/core/PerformanceBadge";
import { TrendBadge } from "@/components/ui/core/TrendBadge";
import { PerformanceCategory } from "@/store/member";

export interface Team {
  id: string;
  name: string;
}

export interface Member {
  id: string;
  name: string;
  title: string | null;
  averageRating: number;
  ratingsCount: number;
  teamId: string;
  teamName: string;
}

export interface MemberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  member?: Member;
  teamId?: string;
  teams?: Team[];
  category?: PerformanceCategory;
  variant?: "mobile" | "desktop";
  onNavigate?: (path: string) => void;
}

function MemberCard({
  className,
  member,
  teamId,
  teams,
  category,
  variant = "mobile",
  onNavigate,
  ...props
}: MemberCardProps) {
  const router = useRouter();

  // Check if member is defined
  if (!member) {
    return <div>No member data available</div>; // Handle the case where member is undefined
  }

  // Calculate effective team ID and encoded IDs
  const effectiveTeamId = teamId ?? member.teamId;
  const encodedTeamId = encodeURIComponent(effectiveTeamId);
  const encodedMemberId = encodeURIComponent(member.id);
  const detailPath = `/dashboard/teams/${encodedTeamId}/members/${encodedMemberId}`;

  const handleCardClick = () => {
    const path = detailPath;
    if (onNavigate) {
      onNavigate(path);
    } else {
      router.push(path);
    }
  };

  return (
    <Card
      data-slot="card"
      className={cn(
        "flex flex-col cursor-pointer transition-shadow hover:shadow-md",
        variant === "desktop" ? "relative" : "md:relative",
        className
      )}
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${member.name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      {...props}
    >
      <CardHeader
        data-slot="card-header"
        className={cn(
          "space-y-4",
          variant === "desktop"
            ? "flex flex-col items-center pt-6"
            : "md:flex md:flex-col md:items-center md:pt-6"
        )}
      >
        <div
          className={cn(
            "flex",
            variant === "desktop"
              ? "flex-col items-center text-center"
              : "items-start justify-between md:flex-col md:items-center md:text-center"
          )}
        >
          <div
            className={cn(
              "flex",
              variant === "desktop"
                ? "flex-col items-center gap-2"
                : "gap-4 md:flex-col md:items-center md:gap-2"
            )}
          >
            <Avatar
              data-slot="avatar"
              className={cn(
                variant === "desktop" ? "size-14" : "size-8 md:size-14"
              )}
            >
              <AvatarFallback
                data-slot="avatar-fallback"
                className={cn(
                  variant === "desktop" ? "text-base" : "text-sm md:text-base"
                )}
              >
                {member.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                variant === "desktop" ? "text-center" : "md:text-center"
              )}
            >
              <h3 className="heading-3">{member.name}</h3>
              <p className="text-sm text-foreground-weak">
                {member.title || "No title"}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent data-slot="card-content" className="flex-1 space-y-4">
        <div
          className={cn(
            "flex items-start justify-between gap-2 md:gap-3",
            variant === "desktop"
              ? "flex-col items-center"
              : "flex-col md:flex-col md:items-center"
          )}
        >
          {category && (
            <div className="flex flex-col items-center gap-2">
              {category.trend ? (
                <TrendBadge variant={category.trend} />
              ) : (
                <TrendBadge noTrendData />
              )}
              {category.variant ? (
                <PerformanceBadge variant={category.variant} />
              ) : (
                <PerformanceBadge noPerformanceData />
              )}
            </div>
          )}
          
          <StarRating
            value={member.averageRating}
            disabled
            size="sm"
            ratingsCount={member.ratingsCount}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export { MemberCard };