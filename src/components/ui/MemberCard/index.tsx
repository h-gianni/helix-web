"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {

  MoreVertical,
  ChevronRight,
  FileText,
  Trash2,
  LucideIcon,
} from "lucide-react";
import StarRating from "@/components/ui/StarRating";
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
  variant?: 'default' | 'compact';
  onNavigate?: (path: string) => void;
}

const MemberCard = React.forwardRef<HTMLDivElement, MemberCardProps>(
  ({ 
    className, 
    member, 
    teamId, 
    teams, 
    category, 
    onDelete, 
    onGenerateReview,
    variant = 'default',
    onNavigate,
    ...props 
  }, ref) => {

    const mainRouter = useRouter();

    const router = typeof window !== 'undefined' ? mainRouter : null;
    const effectiveTeamId = teamId ?? member.teamId;
    const encodedTeamId = encodeURIComponent(effectiveTeamId);
    const encodedMemberId = encodeURIComponent(member.id);
    const teamName = teams.find(team => team.id === member.teamId)?.name || "No team";

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
          variant === 'compact' && "p-4",
          className
        )} 
        {...props}
      >
        <CardHeader className={cn("space-y-4", variant === 'compact' && "p-0")}>
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
                className="text-primary hover:underline cursor-pointer"
              >
                {member.name}
              </span>
            </h1>
            <p className="text-body-small text-text-weakest">{member.title || "No title"}</p>
          </div>
          </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  appearance="icon-only"
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
                    className="text-danger-500 focus:text-danger-500"
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
        <CardContent className={cn("flex-1 space-y-base border-t border-border-weak pt-sm", variant === 'compact' && "p-0 pt-4")}>
          <div className="flex items-center gap-2">
            {category.Icon && (
              <category.Icon className={`size-4 ${category.className}`} />
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
        </CardContent>
      </Card>
    );
  }
);

MemberCard.displayName = "MemberCard";

export { MemberCard };