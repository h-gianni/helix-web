"use client";

import React from "react";
import { Users, Loader } from "lucide-react";
import { Badge } from "@/components/ui/core/Badge";
import { NavList, NavListItem } from "@/components/ui/core/NavList";
import { useTeams } from "@/store/performance-rating-store";

interface ScoringStepTeamProps {
  selectedTeamId: string | undefined;
  setSelectedTeamId: (teamId: string) => void;
  onNext?: () => void;
}

export default function ScoringStepTeam({
  selectedTeamId,
  setSelectedTeamId,
  onNext,
}: ScoringStepTeamProps) {
  const { data: teams = [], isLoading: teamsLoading } = useTeams();

  // Handle team selection - now also navigates to next step automatically
  const handleTeamSelect = (teamId: string) => {
    setSelectedTeamId(teamId);
    
    // Trigger navigation to the next step if provided
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="space-y-4">
      <NavList
        isLoading={teamsLoading}
        emptyStateText="No teams available"
        emptyStateIcon={<Users className="size-6 text-foreground-muted mb-2" />}
      >
        {teams.map((team) => {
          // Get member count safely - handle different data structures
          const membersCount = "members" in team ? team.members?.length || 0 : 0;
          
          return (
            <NavListItem
              key={team.id}
              icon={<Users className="size-4" />}
              onClick={() => handleTeamSelect(team.id)}
              trailingContent={
                <Badge variant="primary-light">{membersCount}</Badge>
              }
            >
              {team.name}
            </NavListItem>
          );
        })}
      </NavList>
    </div>
  );
}