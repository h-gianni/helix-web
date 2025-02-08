"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/core/Table";
import { Button } from "@/components/ui/core/Button";
import { Avatar, AvatarFallback } from "@/components/ui/core/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconWrapper,
} from "@/components/ui/core/DropdownMenu";
import {
  MoreVertical,
  ChevronRight,
  FileText,
  Trash2,
  LucideIcon,
  PenSquare,
  Eye,
  ChartSpline,
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
  teamName: string;
}

export interface PerformanceCategory {
  label: string;
  minRating: number;
  maxRating: number;
  className: string;
  Icon: LucideIcon;
}

type MembersTableDOMProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'performanceCategories'
>;

export interface MembersTableProps extends MembersTableDOMProps {
  members: Member[];
  teams: Team[];
  teamId?: string;
  showAvatar?: boolean;
  showActions?: boolean;
  onDelete?: (member: Member) => void;
  onGenerateReview?: (member: Member) => void;
  onNavigate?: (path: string) => void;
  performanceCategories: PerformanceCategory[];
  getPerformanceCategory: (
    rating: number,
    ratingsCount: number
  ) => PerformanceCategory;
}

const MembersTable = React.forwardRef<HTMLDivElement, MembersTableProps>(
  (
    {
      className,
      members,
      teams,
      teamId,
      showAvatar = true,
      showActions = true,
      onDelete,
      onGenerateReview,
      onNavigate,
      performanceCategories: _performanceCategories, // renamed to indicate it's unused
      getPerformanceCategory,
      ...props
    },
    ref
  ) => {
    const sortedMembers = [...members].sort((a, b) => {
      if (a.ratingsCount === 0 && b.ratingsCount === 0) return 0;
      if (a.ratingsCount === 0) return 1;
      if (b.ratingsCount === 0) return -1;
      return b.averageRating - a.averageRating;
    });

    const handleNavigation = (path: string) => {
      if (onNavigate) {
        onNavigate(path);
      }
    };

    return (
      <div
        ref={ref}
        className={cn("members-table-container", className)}
        {...props}
      >
        <Table size="sm">
          <TableHeader>
            <TableRow>
              {showAvatar && (
                <TableHead className="members-table-sr-only w-0"></TableHead>
              )}
              <TableHead className="members-table-col-name">Name</TableHead>
              <TableHead className="members-table-col-team">Team</TableHead>
              <TableHead className="members-table-col-title">
                Job Title
              </TableHead>
              <TableHead className="members-table-col-seniority">
                Seniority
              </TableHead>
              <TableHead className="members-table-col-performance">
                Performance
              </TableHead>
              <TableHead>Ratings</TableHead>
              {showActions && (
                <TableHead className="members-table-sr-only w-0">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMembers.map((member) => {
              const category = getPerformanceCategory(
                member.averageRating,
                member.ratingsCount
              );
              const effectiveTeamId = teamId || member.teamId;
              const encodedTeamId = encodeURIComponent(effectiveTeamId);
              const encodedMemberId = encodeURIComponent(member.id);
              const teamName =
                teams.find((team) => team.id === member.teamId)?.name ||
                "No team";
              const detailsPath = `/dashboard/teams/${encodedTeamId}/members/${encodedMemberId}`;

              return (
                <TableRow key={member.id}>
                  {showAvatar && (
                    <TableCell>
                      <Avatar size="sm">
                        <AvatarFallback>
                          {member.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                  )}
                  <TableCell>
                    <span
                      onClick={() => handleNavigation(detailsPath)}
                      className="members-table-name-link"
                    >
                      {member.name}
                    </span>
                  </TableCell>
                  <TableCell>{teamName}</TableCell>
                  <TableCell>{member.title || "No title"}</TableCell>
                  <TableCell className="members-table-cell-nowrap">
                    Seniority grade
                  </TableCell>
                  <TableCell className="members-table-cell-nowrap">
                    <div className="members-table-performance-container">
                      {category.Icon && (
                        <category.Icon
                          className={cn(
                            "members-table-performance-icon",
                            category.className
                          )}
                        />
                      )}
                      <span className={category.className}>
                        {category.label}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="members-table-cell-nowrap">
                    <StarRating
                      value={member.averageRating}
                      disabled={true}
                      size="sm"
                      ratingsCount={member.ratingsCount}
                    />
                  </TableCell>
                  {showActions && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            iconOnly
                            aria-label="Member actions"
                            leadingIcon={
                              <IconWrapper>
                                <MoreVertical />
                              </IconWrapper>
                            }
                            size="sm"
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleNavigation(detailsPath)}
                          >
                            <IconWrapper>
                              <Eye />
                            </IconWrapper>
                            Quick View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleNavigation(detailsPath)}
                          >
                            <IconWrapper>
                              <PenSquare />
                            </IconWrapper>
                            Edit Details
                          </DropdownMenuItem>
                          {onGenerateReview && (
                            <DropdownMenuItem
                              onClick={() => onGenerateReview(member)}
                            >
                              <IconWrapper>
                                <ChartSpline />
                              </IconWrapper>
                              Performance Reviews
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem
                              destructive
                              onClick={() => onDelete(member)}
                            >
                              <IconWrapper>
                                <Trash2 />
                              </IconWrapper>
                              Delete Member
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
);

MembersTable.displayName = "MembersTable";

export { MembersTable };