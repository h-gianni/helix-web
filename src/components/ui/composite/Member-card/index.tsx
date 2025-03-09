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
  variant?: "horiz" | "vert";
  onNavigate?: (path: string) => void;
}

function MemberCard({
  className,
  member,
  teamId,
  teams,
  category,
  onDelete,
  onGenerateReview,
  variant = "horiz",
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

  const isVertical = variant === "vert";

  return (
    <Card
      data-slot="card"
      className={cn(
        "flex flex-col",
        isVertical && "relative",
        className
      )}
      {...props}
    >
      <CardHeader 
        data-slot="card-header" 
        className={cn(
          "space-y-4",
          isVertical && "flex flex-col items-center pt-6"
        )}
      >
        {isVertical && (
          <div className="absolute top-2 right-2">
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
        )}
        <div className={cn(
          "flex",
          isVertical 
            ? "flex-col items-center text-center" 
            : "items-start justify-between"
        )}>
          <div className={cn(
            "flex",
            isVertical 
              ? "flex-col items-center gap-2" 
              : "gap-4"
          )}>
            <Avatar 
              data-slot="avatar" 
              className={cn(
                isVertical ? "size-14" : "size-8"
              )}
            >
              <AvatarFallback 
                data-slot="avatar-fallback" 
                className={cn(
                  isVertical ? "text-base" : "text-sm"
                )}
              >
                {member.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className={isVertical ? "text-center" : ""}>
              <h3 className="heading-5">
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
          
          {!isVertical && (
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
          )}
        </div>
      </CardHeader>
      <CardContent
        data-slot="card-content"
        className="flex-1 space-y-4"
      >
        <div className={cn(
          "flex items-start justify-between gap-2 md:gap-4",
          isVertical ? "flex-col items-center" : "flex-col md:flex-row"
        )}>
          <div className="flex items-center gap-2">
            {category.Icon && (
              <category.Icon className={cn("size-4", category.className)} />
            )}
            <span className={cn("text-sm font-medium", category.className)}>
              {category.label}
            </span>
          </div>
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