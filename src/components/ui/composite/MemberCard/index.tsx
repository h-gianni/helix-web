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
} from "@/components/ui/core/Dropdown-menu";
import {
  MoreVertical,
  ChevronRight,
  FileText,
  Trash2,
  LucideIcon,
} from "lucide-react";
import StarRating from "@/components/ui/core/Star-rating";
import { cn } from "@/lib/utils";

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

export interface PerformanceCategory {
  label: string;
  minRating: number;
  maxRating: number;
  className: string;
  Icon: LucideIcon;
}

export interface MemberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  member: Member;
  teamId?: string;
  teams: Team[];
  category: PerformanceCategory;
  onDelete?: (member: Member) => void;
  onGenerateReview?: (member: Member) => void;
  variant?: "default" | "compact";
  onNavigate?: (path: string) => void;
}

const MemberCard = React.forwardRef<HTMLDivElement, MemberCardProps>(
  (
    {
      className,
      member,
      teamId,
      teams,
      category,
      onDelete,
      onGenerateReview,
      variant = "default",
      onNavigate,
      ...props
    },
    ref
  ) => {
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

    return (
      <Card
        ref={ref}
        className={cn("flex flex-col", variant === "compact" && "p-4", className)}
        {...props}
      >
        <CardHeader className={cn("space-y-4", variant === "compact" && "p-0")}>
          <div className="flex items-start justify-between">
            <div className="flex gap-2">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-lg">
                  {member.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">
                  <button
                    onClick={handleViewDetails}
                    className="hover:underline"
                  >
                    {member.name}
                  </button>
                </h3>
                <p className="text-sm text-muted-foreground">
                  {member.title || "No title"}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Member actions"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleViewDetails}>
                  <ChevronRight className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                {onGenerateReview && (
                  <DropdownMenuItem onClick={() => onGenerateReview(member)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Performance Review
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(member)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent
          className={cn(
            "flex-1 space-y-4 pt-2",
            variant === "compact" && "p-0 pt-4"
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {category.Icon && (
                <category.Icon className={cn("h-4 w-4", category.className)} />
              )}
              <span className={cn("font-medium", category.className)}>
                {category.label}
              </span>
            </div>
            <StarRating
              value={member.averageRating}
              disabled
              size="sm"
              count={member.ratingsCount}
            />
          </div>
        </CardContent>
      </Card>
    );
  }
);

MemberCard.displayName = "MemberCard";

export { MemberCard };