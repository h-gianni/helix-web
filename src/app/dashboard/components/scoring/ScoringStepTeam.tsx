"use client";

import React from "react";
import { Label } from "@/components/ui/core/Label";
import { Badge } from "@/components/ui/core/Badge";
import {
  RadioGroupCards,
  RadioGroupCardsContainer,
  RadioGroupCard,
} from "@/components/ui/core/RadioGroupCards";
import { useTeams } from "@/store/performance-rating-store";
import { Circle, Loader } from "lucide-react";

// Dummy data for demonstration
const DUMMY_TEAMS = [
  { id: "team1", name: "Engineering", membersCount: 8 },
  { id: "team2", name: "Design", membersCount: 5 },
  { id: "team3", name: "Product", membersCount: 4 },
  { id: "team4", name: "Marketing", membersCount: 6 },
  { id: "team5", name: "Sales", membersCount: 10 },
];

interface ScoringStepTeamProps {
  selectedTeamId: string | undefined;
  setSelectedTeamId: (teamId: string) => void;
}

// Extend RadioCardProps to include icon
interface ExtendedRadioCardProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupCard> {
  icon?: React.ReactNode;
}

export default function ScoringStepTeam({
  selectedTeamId,
  setSelectedTeamId,
}: ScoringStepTeamProps) {
  const { data: teams = [], isLoading: teamsLoading } = useTeams();

  // Use real data if available, otherwise fallback to dummy data
  const displayTeams =
    teams.length > 0
      ? teams.map((team) => ({
          id: team.id,
          name: team.name,
          membersCount: "members" in team ? team.members?.length || 0 : 0,
        }))
      : DUMMY_TEAMS;

  if (teamsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">

        {displayTeams.length === 0 ? (
          <div className="p-6 text-center border rounded-lg bg-muted">
            <p className="text-foreground">No teams available</p>
          </div>
        ) : (
          <RadioGroupCards
            value={selectedTeamId ?? ""}
            onValueChange={setSelectedTeamId}
          >
            <RadioGroupCardsContainer className="flex flex-col">
              {displayTeams.map((team) => (
                <RadioGroupCard
                  key={team.id}
                  id={`team-${team.id}`}
                  value={team.id}
                  title={team.name}
                >
                  <div className="flex items-center justify-between gap-4 w-full">
                    <div>{team.name}</div>
                    <div>
                      <Badge variant="primary-light">{team.membersCount}</Badge>
                    </div>
                  </div>
                </RadioGroupCard>
              ))}
            </RadioGroupCardsContainer>
          </RadioGroupCards>
        )}
    </div>
  );
}
