"use client";

import React from "react";
import { User, Users, Loader } from "lucide-react";
import { NavList, NavListItem } from "@/components/ui/core/NavList";
import { useTeamMembers } from "@/store/performance-rating-store";
import { Avatar, AvatarFallback } from "@/components/ui/core/Avatar";

interface ScoringStepMemberProps {
  teamId: string;
  selectedMemberId: string | undefined;
  setSelectedMemberId: (memberId: string) => void;
  memberName?: string;
  memberTitle?: string | null;
  onNext?: () => void;
}

export default function ScoringStepMember({
  teamId,
  selectedMemberId,
  setSelectedMemberId,
  memberName,
  memberTitle,
  onNext,
}: ScoringStepMemberProps) {
  const { data: members = [], isLoading: membersLoading } = useTeamMembers(teamId);

  // If we already have a pre-selected member, show it
  if (memberName) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 rounded-lg border">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {memberName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{memberName}</p>
            {memberTitle && (
              <p className="text-sm text-foreground-weak">{memberTitle}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Handle member selection - now also navigates to next step automatically
  const handleMemberSelect = (memberId: string) => {
    setSelectedMemberId(memberId);
    
    // Trigger navigation to the next step if provided
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="space-y-4">
      <NavList
        isLoading={membersLoading}
        emptyStateText="No team members available"
        emptyStateIcon={<Users className="size-6 text-foreground-muted mb-2" />}
      >
        {members.map((member) => {
          const memberName = member.user?.name || member.user?.email || "Unknown";
          const initials = memberName
            .split(' ')
            .map(part => part.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
          
          return (
            <NavListItem
              key={member.id}
              icon={
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {initials || memberName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              }
              onClick={() => handleMemberSelect(member.id)}
              description={member.title || undefined}
            >
              {memberName}
            </NavListItem>
          );
        })}
      </NavList>
    </div>
  );
}