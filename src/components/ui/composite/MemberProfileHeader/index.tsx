// src/components/ui/composite/MemberProfileHeader/index.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/core/Button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/core/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/core/DropdownMenu";
import {
  MessageSquare,
  Star,
  MoreVertical,
  ArrowLeft,
  UserMinus,
  UserMinus2,
  Pen,
  Sparkles,
} from "lucide-react";
import { GenerateReviewModal } from "@/app/dashboard/components/teams/team/member/GenerateReviewModal";

interface MemberProfileHeaderProps {
  memberId: string;
  teamId: string;
  name: string;
  title?: string | null;
  email: string;
  // Optional avatar URL (not currently in MemberDetails type)
  avatarUrl?: string | null;
  onAddNote?: () => void;
  onScorePerformance?: () => void;
  onEditMember?: () => void;
  onTransferMember?: () => void;
  onDeleteMember?: () => void;
  className?: string;
}

export function MemberProfileHeader({
  memberId,
  teamId,
  name,
  title,
  email,
  avatarUrl,
  onAddNote,
  onScorePerformance,
  onEditMember,
  onTransferMember,
  onDeleteMember,
}: MemberProfileHeaderProps) {
  const router = useRouter();

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Display name - use passed name or fallback to friendly display from email
  const displayName = name || email.split("@")[0] || "Team Member";

  return (
    <div className="relative w-full">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 pb-0">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/dashboard/teams/${teamId}`)}
          aria-label="Back to team"
        >
          <ArrowLeft className="size-4" />
        </Button>
        
        {/* Avatar */}
        <Avatar className="size-20 border-4 border-white bg-white shadow">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={displayName} />
          ) : (
            <AvatarFallback className="text-2xl">
              {getInitials(displayName)}
            </AvatarFallback>
          )}
        </Avatar>

        <div className="flex justify-between gap-4 pl-2 w-full">
          {/* Profile info */}
          <div className="flex flex-1 flex-col">
            <h1 className="heading-1">{displayName}</h1>
            <div className="pt-1 space-y-0.5">
            <p className="caption text-foreground-weak">{email}</p>
            {title && <p className="caption text-foreground-weak">{title}</p>}
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-wrap justify-end gap-3 mt-4 sm:mt-0">
            <Button variant="outline" onClick={onAddNote}>
              <MessageSquare />Add note
            </Button>

            <Button variant="outline" onClick={onScorePerformance}>
              <Star />Score Performance
            </Button>

            {/* Render the GenerateReviewModal component */}
            <GenerateReviewModal
              teamId={teamId}
              memberId={memberId}
              memberName={displayName}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" aria-label="More options">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEditMember} className="gap-2">
                  <Pen className="size-4" />
                  Edit Member
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onTransferMember} className="gap-2">
                  <UserMinus2 className="size-4" />
                  Transfer Member
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onDeleteMember}
                  className="text-destructive focus:text-destructive gap-2"
                >
                  <UserMinus className="size-4" />
                  Delete Member
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}