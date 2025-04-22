"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/core/Card";
import { Button } from "@/components/ui/core/Button";
import { Avatar, AvatarFallback } from "@/components/ui/core/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/core/DropdownMenu";
import {
  MoreVertical,
  ChevronRight,
  FileText,
  Trash2,
} from "lucide-react";
import StarRating from "@/components/ui/core/StarRating";
import { cn } from "@/lib/utils";
import { PerformanceBadge } from "@/components/ui/core/PerformanceBadge";

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
  member: Member;
  teamId?: string;
  teams: Team[];
  // Still accepting category for backward compatibility, but it's not used
  category?: any;
  onDelete?: (member: Member) => void;
  onGenerateReview?: (member: Member) => void;
  variant?: "mobile" | "desktop";
  onNavigate?: (path: string) => void;
}

function MemberCard({
  className,
  member,
  teamId,
  teams,
  category: _category, // Accept but don't use
  onDelete,
  onGenerateReview,
  variant = "mobile",
  onNavigate,
  ...props
}: MemberCardProps) {
  const router = useRouter();
  const effectiveTeamId = teamId ?? member.teamId;
  const encodedTeamId = encodeURIComponent(effectiveTeamId);
  const encodedMemberId = encodeURIComponent(member.id);

  const handleViewDetails = () => {
    const path = `/dashboard/teams/${encodedTeamId}/members/${encodedMemberId}`;
    if (onNavigate) {
      onNavigate(path);
    } else {
      router.push(path);
    }
  };

  // Use responsive classes instead of JS-based media queries
  return (
    <Card
      data-slot="card"
      className={cn(
        "flex flex-col",
        variant === "desktop" ? "relative" : "md:relative",
        className
      )}
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
        {/* Desktop dropdown positioning - always show for desktop variant, show on md+ for mobile variant */}
        <div className={cn(
          variant === "desktop" ? "absolute top-2 right-2" : "hidden md:block md:absolute md:top-2 md:right-2"
        )}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                data-slot="button"
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label="Member actions"
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent data-slot="dropdown-content" align="end">
              <DropdownMenuItem data-slot="dropdown-item" onClick={handleViewDetails}>
                <ChevronRight className="mr-1" />
                View Details
              </DropdownMenuItem>
              {onGenerateReview && (
                <DropdownMenuItem data-slot="dropdown-item" onClick={() => onGenerateReview(member)}>
                  <FileText className="mr-1" />
                  Generate Performance Review
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  data-slot="dropdown-item"
                  onClick={() => onDelete(member)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-1" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className={cn(
          "flex",
          variant === "desktop" 
            ? "flex-col items-center text-center" 
            : "items-start justify-between md:flex-col md:items-center md:text-center"
        )}>
          <div className={cn(
            "flex",
            variant === "desktop" 
              ? "flex-col items-center gap-2" 
              : "gap-4 md:flex-col md:items-center md:gap-2"
          )}>
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
            <div className={cn(
              variant === "desktop" ? "text-center" : "md:text-center"
            )}>
              <h3 className="heading-3">
                <button
                  onClick={handleViewDetails}
                  className="hover:underline"
                >
                  {member.name}
                </button>
              </h3>
              <p className="text-sm text-foreground-weak">
                {member.title || "No title"}
              </p>
            </div>
          </div>
          
          {/* Mobile dropdown - hide on md+ breakpoint */}
          <div className={variant === "desktop" ? "hidden" : "block md:hidden"}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  data-slot="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label="Member actions"
                >
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent data-slot="dropdown-content" align="end">
                <DropdownMenuItem data-slot="dropdown-item" onClick={handleViewDetails}>
                  <ChevronRight className="mr-1" />
                  View Details
                </DropdownMenuItem>
                {onGenerateReview && (
                  <DropdownMenuItem data-slot="dropdown-item" onClick={() => onGenerateReview(member)}>
                    <FileText className="mr-1" />
                    Generate Performance Review
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    data-slot="dropdown-item"
                    onClick={() => onDelete(member)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-1" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent
        data-slot="card-content"
        className="flex-1 space-y-4"
      >
        <div className={cn(
          "flex items-start justify-between gap-2 md:gap-3",
          variant === "desktop" 
            ? "flex-col items-center" 
            : "flex-col md:flex-col md:items-center"
        )}>
          <PerformanceBadge 
            value={member.averageRating}
            ratingsCount={member.ratingsCount}
            showTooltip
          />
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