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
import { Avatar, AvatarFallback } from "@/components/ui/core/Avatar";
import { ChevronRight } from "lucide-react";
import StarRating from "@/components/ui/core/StarRating";
import { cn } from "@/lib/utils";
import { PerformanceBadge } from "@/components/ui/core/PerformanceBadge";
import { TrendBadge, type TrendVariant } from "@/components/ui/core/TrendBadge";

// Updated types to include trend information
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
  trend?: TrendVariant; // Added trend property
}

type MembersTableDOMProps = React.HTMLAttributes<HTMLDivElement>;

export interface MembersTableProps extends MembersTableDOMProps {
  members: Member[];
  teams: Team[];
  teamId?: string;
  showAvatar?: boolean;
  showActions?: boolean;
  showTableHead?: boolean;
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
              {showAvatar && (
                <TableHead data-slot="table-head" className="w-10 px-0" />
              )}
              <TableHead data-slot="table-head" className="pl-2">
                Name
              </TableHead>
              <TableHead data-slot="table-head">Job Title</TableHead>
              {showTeamColumn && (
                <TableHead data-slot="table-head">Team</TableHead>
              )}
              <TableHead data-slot="table-head">Quarterly Trend</TableHead>
              <TableHead data-slot="table-head">Performance</TableHead>
              <TableHead data-slot="table-head" className="w-[200px]">
                Scores
              </TableHead>
              {showActions && (
                <TableHead data-slot="table-head" className="w-10" />
              )}
            </TableRow>
          </TableHeader>
        )}
        <TableBody data-slot="table-body">
          {sortedMembers.map((member) => {
            const effectiveTeamId = teamId || member.teamId;
            const detailsPath = `/dashboard/teams/${encodeURIComponent(
              effectiveTeamId
            )}/members/${encodeURIComponent(member.id)}`;
            const teamName = teams.find(
              (team) => team.id === member.teamId
            )?.name;
            const teamNameDisplay = teamName || (
              <span className="text-unavailable">No team</span>
            );

            const handleRowClick = () => {
              if (onNavigate) {
                onNavigate(detailsPath);
              }
            };

            return (
              <TableRow 
                data-slot="table-row" 
                key={member.id}
                onClick={handleRowClick}
                className="cursor-pointer hover:bg-neutral-50"
                tabIndex={0}
                role="button"
                aria-label={`View details for ${member.name}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleRowClick();
                  }
                }}
              >
                {showAvatar && (
                  <TableCell
                    data-slot="table-cell"
                    className="px-2 align-middle"
                  >
                    <Avatar data-slot="avatar" className="size-8">
                      <AvatarFallback data-slot="avatar-fallback">
                        {member.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                )}
                <TableCell
                  data-slot="table-cell"
                  className={cn(
                    "w-[30%] pl-2 align-middle",
                    !showTeamColumn && "w-[40%]"
                  )}
                >
                  <span className="text-sm font-semibold text-foreground-strong leading-4">
                    {member.name}
                  </span>
                </TableCell>
                <TableCell
                  data-slot="table-cell"
                  className="w-[15%] align-middle leading-4"
                >
                  {member.title || (
                    <span className="text-unavailable">No title</span>
                  )}
                </TableCell>
                {showTeamColumn && (
                  <TableCell
                    data-slot="table-cell"
                    className="w-[15%] align-middle leading-4"
                  >
                    {teamNameDisplay}
                  </TableCell>
                )}
                <TableCell
                  data-slot="table-cell"
                  className="w-[15%] align-middle"
                >
                  <TrendBadge
                    variant={member.trend || "stable"}
                    size="sm"
                    noTrendData={!member.trend}
                  />
                </TableCell>
                <TableCell
                  data-slot="table-cell"
                  className="w-[15%] align-middle"
                >
                  <PerformanceBadge
                    value={member.averageRating}
                    ratingsCount={member.ratingsCount}
                    size="base"
                  />
                </TableCell>
                <TableCell
                  data-slot="table-cell"
                  className="w-[180px] whitespace-nowrap align-middle"
                >
                  <StarRating
                    value={member.averageRating}
                    disabled
                    size="sm"
                    ratingsCount={member.ratingsCount}
                    className="w-[150px]"
                  />
                </TableCell>
                {showActions && (
                  <TableCell
                    data-slot="table-cell"
                    className="w-0 pr-2 align-middle"
                  >
                    <ChevronRight className="size-4 text-foreground-muted" />
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