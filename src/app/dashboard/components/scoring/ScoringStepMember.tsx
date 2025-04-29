"use client";

import React from "react";
import { Label } from "@/components/ui/core/Label";
import {
  RadioGroupCards,
  RadioGroupCardsContainer,
  RadioGroupCard,
} from "@/components/ui/core/RadioGroupCards";
import { useTeamMembers } from "@/store/performance-rating-store";
import { Loader, User, Users } from "lucide-react";

// Dummy data for demonstration
const DUMMY_MEMBERS = {
  team1: [
    { id: "user1", name: "Jane Cooper", title: "Frontend Developer" },
    { id: "user2", name: "Alex Morgan", title: "Backend Developer" },
    { id: "user3", name: "Sarah Chen", title: "DevOps Engineer" },
    { id: "user4", name: "Michael Johnson", title: "Full-Stack Developer" },
  ],
  team2: [
    { id: "user5", name: "David Wilson", title: "UI Designer" },
    { id: "user6", name: "Emma Brown", title: "UX Designer" },
  ],
};

interface ScoringStepMemberProps {
  teamId: string;
  selectedMemberId: string | undefined;
  setSelectedMemberId: (memberId: string) => void;
  memberName?: string;
  memberTitle?: string | null;
}

// Extend RadioCardProps to include icon
interface ExtendedRadioCardProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupCard> {
  icon?: React.ReactNode;
}

export default function ScoringStepMember({
  teamId,
  selectedMemberId,
  setSelectedMemberId,
  memberName,
  memberTitle,
}: ScoringStepMemberProps) {
  const { data: members = [], isLoading: membersLoading } =
    useTeamMembers(teamId);

  // If we already have a pre-selected member, show it
  if (memberName) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          {/* <Label className="text-sm font-medium text-foreground">
            Selected Team Member
          </Label> */}
          <div className="flex items-center gap-3 p-4 rounded-lg border">
            <div className="flex-shrink-0 h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {memberName.substring(0, 2)}
            </div>
            <div>
              <p className="font-medium">{memberName}</p>
              {/* {memberTitle && (
                <p className="text-sm text-muted-foreground">{memberTitle}</p>
              )} */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use real data if available, otherwise fallback to dummy data
  const displayMembers =
    members.length > 0
      ? members.map((member) => ({
          id: member.id,
          name: member.user?.name || member.user?.email || "Unknown",
          title: member.title || null,
        }))
      : DUMMY_MEMBERS[teamId as keyof typeof DUMMY_MEMBERS] || [];

  if (membersLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
        {displayMembers.length === 0 ? (
          <div className="p-6 text-center border rounded-lg bg-muted">
            <Users className="size-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-unavailable">No team members available</p>
          </div>
        ) : (
          <RadioGroupCards
            value={selectedMemberId ?? ""}
            onValueChange={setSelectedMemberId}
          >
            <RadioGroupCardsContainer className="flex flex-col">
              {displayMembers.map((member) => (
                <RadioGroupCard
                  key={member.id}
                  id={`member-${member.id}`}
                  value={member.id}
                >
                  {member.name}
                </RadioGroupCard>
              ))}
            </RadioGroupCardsContainer>
          </RadioGroupCards>
        )}
    </div>
  );
}
