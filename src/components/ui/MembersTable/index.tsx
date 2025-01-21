"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
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

export interface MembersTableProps extends React.HTMLAttributes<HTMLDivElement> {
  members: Member[];
  teams: Team[];
  teamId?: string;
  showAvatar?: boolean;
  showActions?: boolean;
  onDelete?: (member: Member) => void;
  onGenerateReview?: (member: Member) => void;
  onNavigate?: (path: string) => void;
  performanceCategories: PerformanceCategory[];
  getPerformanceCategory: (rating: number, ratingsCount: number) => PerformanceCategory;
}

const MembersTable = React.forwardRef<HTMLDivElement, MembersTableProps>(
  ({
    className,
    members,
    teams,
    teamId,
    showAvatar = true,
    showActions = true,
    onDelete,
    onGenerateReview,
    onNavigate,
    // performanceCategories,
    getPerformanceCategory,
    ...props
  }, ref) => {
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
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <Table size="sm">
          <TableHeader>
            <TableRow>
              {showAvatar && <TableHead className="sr-only">Avatar</TableHead>}
              <TableHead className="w-[20%]">Name</TableHead>
              <TableHead className="w-[15%]">Team</TableHead>
              <TableHead className="w-[15%]">Job Title</TableHead>
              <TableHead className="w-[15%]">Seniority</TableHead>
              <TableHead className="w-[15%]">Performance</TableHead>
              <TableHead>Ratings</TableHead>
              {showActions && <TableHead className="sr-only">Actions</TableHead>}
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
                      <Avatar size="md">
                        <AvatarFallback>
                          {member.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                  )}
                  <TableCell>
                    <span
                      onClick={() => handleNavigation(detailsPath)}
                      className="font-semibold cursor-pointer hover:underline"
                    >
                      {member.name}
                    </span>
                  </TableCell>
                  <TableCell>{teamName}</TableCell>
                  <TableCell>{member.title || "No title"}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    Seniority grade
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {category.Icon && (
                        <category.Icon
                          className={`size-4 ${category.className}`}
                        />
                      )}
                      <span className={`${category.className}`}>
                        {category.label}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
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
                            appearance="icon-only"
                            aria-label="Member actions"
                            leadingIcon={<MoreVertical />}
                            size="sm"
                            variant="neutral"
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleNavigation(detailsPath)}
                          >
                            <ChevronRight className="mr-2 size-4" />
                            View Details
                          </DropdownMenuItem>
                          {onGenerateReview && (
                            <DropdownMenuItem
                              onClick={() => onGenerateReview(member)}
                            >
                              <FileText className="mr-2 size-4" />
                              Generate Performance Review
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem
                              onClick={() => onDelete(member)}
                              className="text-danger-500 focus:text-danger-500"
                            >
                              <Trash2 className="mr-2 size-4" />
                              Delete
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