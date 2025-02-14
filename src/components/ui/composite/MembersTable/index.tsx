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
} from "@/components/ui/core/Dropdown-menu";
import {
  MoreVertical,
  Eye,
  PenSquare,
  ChartSpline,
  Trash2,
  LucideIcon,
} from "lucide-react";
import StarRating from "@/components/ui/core/Star-rating";
import { cn } from "@/lib/utils";

// Types remain unchanged
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
      performanceCategories: _performanceCategories,
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

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <Table>
          <TableHeader>
            <TableRow>
              {showAvatar && <TableHead className="w-10" />}
              <TableHead>Name</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Seniority</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Ratings</TableHead>
              {showActions && <TableHead className="w-10" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMembers.map((member) => {
              const category = getPerformanceCategory(
                member.averageRating,
                member.ratingsCount
              );
              const effectiveTeamId = teamId || member.teamId;
              const detailsPath = `/dashboard/teams/${encodeURIComponent(effectiveTeamId)}/members/${encodeURIComponent(member.id)}`;
              const teamName = teams.find((team) => team.id === member.teamId)?.name || "No team";

              return (
                <TableRow key={member.id}>
                  {showAvatar && (
                    <TableCell>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {member.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                  )}
                  <TableCell>
                    <button
                      onClick={() => onNavigate?.(detailsPath)}
                      className="hover:underline"
                    >
                      {member.name}
                    </button>
                  </TableCell>
                  <TableCell>{teamName}</TableCell>
                  <TableCell>{member.title || "No title"}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    Seniority grade
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {category.Icon && (
                        <category.Icon className={cn("h-4 w-4", category.className)} />
                      )}
                      <span className={category.className}>
                        {category.label}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <StarRating
                      value={member.averageRating}
                      disabled
                      size="sm"
                      count={member.ratingsCount}
                    />
                  </TableCell>
                  {showActions && (
                    <TableCell>
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
                          <DropdownMenuItem onClick={() => onNavigate?.(detailsPath)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Quick View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onNavigate?.(detailsPath)}>
                            <PenSquare className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                          {onGenerateReview && (
                            <DropdownMenuItem onClick={() => onGenerateReview(member)}>
                              <ChartSpline className="mr-2 h-4 w-4" />
                              Performance Reviews
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem
                              onClick={() => onDelete(member)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
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