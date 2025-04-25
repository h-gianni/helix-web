"use client";

import React from "react";
import { Label } from "@/components/ui/core/Label";
import { Textarea } from "@/components/ui/core/Textarea";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import {
  useTeams,
  useTeamMembers,
  useTeamActivities,
} from "@/store/performance-rating-store";
import { User, PencilRuler, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/core/Avatar";
import { Loader } from "@/components/ui/core/Loader";

interface ScoringStepStarsProps {
  teamId: string;
  memberId: string;
  activityId: string;
  feedback: string;
  setFeedback: (feedback: string) => void;
  isSubmitting: boolean;
  error: Error | null | unknown;
  onChangeStep?: (step: number) => void;
}

export default function ScoringStepStars({
  teamId,
  memberId,
  activityId,
  feedback,
  setFeedback,
  isSubmitting,
  error,
  onChangeStep,
}: ScoringStepStarsProps) {
  // Fetch team, member and activity data to display summary
  const { data: teams = [] } = useTeams();
  const { data: members = [] } = useTeamMembers(teamId);
  const { data: activities = [] } = useTeamActivities(teamId);

  // Find the selected items
  const team = teams.find((t) => t.id === teamId);
  const member = members.find((m) => m.id === memberId);
  const activity = activities.find((a) => a.id === activityId);

  // Fallback to dummy data if not found
  const teamName = team?.name || "Selected Team";
  const memberName =
    member?.user?.name || member?.user?.email || "Selected Member";
  const memberTitle = member?.title || null;
  const activityName = activity?.name || "Selected Activity";

  return (
    <div className="space-y-4 -mt-4">
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="size-16">
            <AvatarFallback>
              {memberName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            {/* <div className="heading-upper">{teamName}</div> */}
            <h2 className="display-2">{memberName}</h2>
            <button
              onClick={() => onChangeStep?.(1)}
              className="body-link text-2xs text-foreground-weak"
            >
              Change
            </button>
          </div>
        </div>

          <div className="text-center w-full max-w-lg mx-auto">
            <div className="bg-white p-4 text-center">
              <div className="flex gap-2 justify-center py-1">
                <span className="caption">Action performed</span>
                <button
                  onClick={() => onChangeStep?.(3)}
                  className="body-link text-2xs text-foreground-weak"
                >
                  Change
                </button>
              </div>
              <h2 className="heading-2">{activityName}</h2>
            </div>
          </div>
        </div>

      <div className="max-w-lg mx-auto space-y-2">
        <Label htmlFor="feedback">
          Add Feedback <span className="text-foreground-weak">(Optional)</span>
        </Label>
        <Textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter feedback..."
          rows={3}
          maxLength={250}
          className="w-full resize-none"
          disabled={isSubmitting}
        />
        <div className="text-right text-xs text-foreground-weak">
          {feedback.length} / 250
        </div>
      </div>

      {isSubmitting && (
        <div className="flex justify-center items-center py-2">
          <Loader label="Saving your score..." />
        </div>
      )}
    </div>
  );
}