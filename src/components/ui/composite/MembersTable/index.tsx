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
} from "@/components/ui/core/DropdownMenu";
import {
  MoreVertical,
  Eye,
  PenSquare,
  ChartSpline,
  Trash2,
} from "lucide-react";
import StarRating from "@/components/ui/core/StarRating";
import { cn } from "@/lib/utils";
import { PerformanceBadge } from "@/components/ui/core/PerformanceBadge";

// Types updated to remove PerformanceCategory dependency
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

type MembersTableDOMProps = React.HTMLAttributes<HTMLDivElement>;

export interface MembersTableProps extends MembersTableDOMProps {
  members: Member[];
  teams: Team[];
  teamId?: string;
  showAvatar?: boolean;
  showActions?: boolean;
  showTableHead?: boolean;
  onDelete?: (member: Member) => void;
  onGenerateReview?: (member: Member) => void;
  onNavigate?: (path: string) => void;
}

function MembersTable({
  className,
  members,
  teams,
  teamId,
  showAvatar = true,
  showActions = true,
  showTableHead = true,
  onDelete,
  onGenerateReview,
  onNavigate,
  ...props
}: MembersTableProps) {
  const showTeamColumn = teams.length > 1;

  const sortedMembers = [...members].sort((a, b) => {
    if (a.ratingsCount === 0 && b.ratingsCount === 0) return 0;
    if (a.ratingsCount === 0) return 1;
    if (b.ratingsCount === 0) return -1;
    return b.averageRating - a.averageRating;
  });

  return (
    <div className={cn("w-full", className)} {...props}>
      <Table data-slot="table">
        {showTableHead && (
          <TableHeader data-slot="table-header">
            <TableRow data-slot="table-row">
              {showAvatar && <TableHead data-slot="table-head" className="w-10 px-0" />}
              <TableHead data-slot="table-head" className="pl-2">Name</TableHead>
              {showTeamColumn && <TableHead data-slot="table-head">Team</TableHead>}
              <TableHead data-slot="table-head">Job Title</TableHead>
              <TableHead data-slot="table-head">Seniority</TableHead>
              <TableHead data-slot="table-head">Performance</TableHead>
              <TableHead data-slot="table-head" className="w-[200px]">Scores</TableHead>
              {showActions && <TableHead data-slot="table-head" className="w-10" />}
            </TableRow>
          </TableHeader>
        )}
        <TableBody data-slot="table-body">
          {sortedMembers.map((member) => {
            const effectiveTeamId = teamId || member.teamId;
            const detailsPath = `/dashboard/teams/${encodeURIComponent(
              effectiveTeamId
            )}/members/${encodeURIComponent(member.id)}`;
            const teamName =
              teams.find((team) => team.id === member.teamId)?.name ||
              "No team";

            return (
              <TableRow data-slot="table-row" key={member.id}>
                {showAvatar && (
                  <TableCell data-slot="table-cell" className="px-2">
                    <Avatar data-slot="avatar" className="size-8">
                      <AvatarFallback data-slot="avatar-fallback">
                        {member.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                )}
                <TableCell data-slot="table-cell" className={cn("w-[40%] pl-2 align-middle", !showTeamColumn && "w-[55%]")}>
                  <button
                    onClick={() => onNavigate?.(detailsPath)}
                    className="text-sm font-semibold text-foreground-strong hover:underline"
                  >
                    {member.name}
                  </button>
                </TableCell>
                {showTeamColumn && (
                  <TableCell data-slot="table-cell" className="w-[15%] whitespace-nowrap align-middle">
                    {teamName}
                  </TableCell>
                )}
                <TableCell data-slot="table-cell" className="w-[15%] whitespace-nowrap align-middle">
                  {member.title || "No title"}
                </TableCell>
                <TableCell data-slot="table-cell" className="w-[15%] whitespace-nowrap align-middle">
                  Seniority grade
                </TableCell>
                <TableCell data-slot="table-cell" className="w-[15%] whitespace-nowrap align-middle">
                  <PerformanceBadge 
                    value={member.averageRating} 
                    ratingsCount={member.ratingsCount}
                    showTooltip 
                    size="base"
                  />
                </TableCell>
                <TableCell data-slot="table-cell" className="w-[200px] whitespace-nowrap align-middle">
                  <StarRating
                    value={member.averageRating}
                    disabled
                    size="sm"
                    ratingsCount={member.ratingsCount}
                    className="w-[180px]"
                  />
                </TableCell>
                {showActions && (
                  <TableCell data-slot="table-cell" className="w-0 pr-2 align-middle">
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
                        <DropdownMenuItem
                          data-slot="dropdown-item"
                          onClick={() => onNavigate?.(detailsPath)}
                        >
                          <Eye className="mr-1" />
                          Quick View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          data-slot="dropdown-item"
                          onClick={() => onNavigate?.(detailsPath)}
                        >
                          <PenSquare className="mr-1" />
                          Edit Details
                        </DropdownMenuItem>
                        {onGenerateReview && (
                          <DropdownMenuItem
                            data-slot="dropdown-item"
                            onClick={() => onGenerateReview(member)}
                          >
                            <ChartSpline className="mr-1" />
                            Performance Reviews
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem
                            data-slot="dropdown-item"
                            onClick={() => onDelete(member)}
                            className="text-destructive-foreground focus:text-destructive-foreground"
                          >
                            <Trash2 className="mr-1" />
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

export { MembersTable };