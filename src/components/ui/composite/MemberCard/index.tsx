"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/core/Card";
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
  LucideIcon,
} from "lucide-react";
import StarRating from "@/components/ui/core/StarRating";
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
    const mainRouter = useRouter();

    const router = typeof window !== "undefined" ? mainRouter : null;
    const effectiveTeamId = teamId ?? member.teamId;
    const encodedTeamId = encodeURIComponent(effectiveTeamId);
    const encodedMemberId = encodeURIComponent(member.id);
    const teamName =
      teams.find((team) => team.id === member.teamId)?.name || "No team";

    const handleViewDetails = () => {
      const path = `/dashboard/teams/${encodedTeamId}/members/${encodedMemberId}`;
      if (onNavigate) {
        onNavigate(path);
      } else if (router) {
        router.push(path);
      }
    };

    return (
      <Card
        ref={ref}
        className={cn(
          "flex flex-col",
          variant === "compact" && "p-base",
          className
        )}
        {...props}
      >
        <CardHeader className={cn("space-y-4", variant === "compact" && "p-0")}>
          <div className="flex justify-between items-start">
            <div className="flex gap-sm">
              <Avatar size="md">
                <AvatarFallback className="text-heading-5">
                  {member.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-xxs">
                <h1 className="text-heading-4">
                  <span
                    onClick={handleViewDetails}
                    className="ui-text-heading-4 hover:underline cursor-pointer"
                  >
                    {member.name}
                  </span>
                </h1>
                <p className="ui-text-body-small ui-text-weakest">
                  {member.title || "No title"}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  iconOnly
                  aria-label="Member actions"
                  leadingIcon={<MoreVertical />}
                  size="sm"
                  variant="neutral"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleViewDetails}>
                  <ChevronRight />
                  View Details
                </DropdownMenuItem>
                {onGenerateReview && (
                  <DropdownMenuItem onClick={() => onGenerateReview(member)}>
                    <FileText />
                    Generate Performance Review
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(member)}
                    className="ui-text-danger focus:ui-text-danger"
                  >
                    <Trash2 />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* <div className="space-y-1">
            <p className="text-text-weakest">{teamName}</p>
          </div> */}
        </CardHeader>
        <CardContent
          className={cn(
            "flex-1 space-y-base pt-sm",
            variant === "compact" && "p-0 pt-base"
          )}
        >
          <div className="flex justify-between items-center gap-base">
            <div className="flex items-center gap-2">
              {category.Icon && (
                <category.Icon
                  className={`ui-icon-base ${category.className}`}
                />
              )}
              <span className={`${category.className} font-medium`}>
                {category.label}
              </span>
            </div>
            <StarRating
              value={member.averageRating}
              disabled={true}
              size="sm"
              ratingsCount={member.ratingsCount}
            />
          </div>
        </CardContent>
      </Card>
    );
  }
);

MemberCard.displayName = "MemberCard";

export { MemberCard };
