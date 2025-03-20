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
import { Loader, User, PencilRuler, Users } from "lucide-react";

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
    <div className="max-w-xl mx-auto space-y-8 py-4">
      {/* {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error 
              ? error.message 
              : typeof error === 'object' && error !== null && 'message' in error
                ? String(error.message)
                : "Failed to submit rating"}
          </AlertDescription>
        </Alert>
      )} */}

      <div className="space-y-4">
        {/* Team */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Users className="size-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm text-foreground-weak leading-none">Team</p>
              <p className="text-base text-foreground-strong font-medium truncate">
                {teamName}
              </p>
            </div>
          </div>
          <button
            onClick={() => onChangeStep?.(1)}
            className="body-link text-xs text-foreground-weak hover:text-primary transition-colors"
          >
            Change
          </button>
        </div>

        {/* Member */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="size-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm text-foreground-weak leading-none">
                Team Member
              </p>
              <p className="text-base text-foreground-strong font-medium truncate">
                {memberName}
              </p>
            </div>
          </div>
          <button
            onClick={() => onChangeStep?.(2)}
            className="body-link text-xs text-foreground-weak hover:text-primary transition-colors"
          >
            Change
          </button>
        </div>

        {/* Action */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <PencilRuler className="size-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm text-foreground-weak leading-none">
                Action
              </p>
              <p className="text-base text-foreground-strong font-medium truncate">
                {activityName}
              </p>
            </div>
          </div>
          <button
            onClick={() => onChangeStep?.(3)}
            className="body-link text-xs text-foreground-weak hover:text-primary transition-colors"
          >
            Change
          </button>
        </div>
      </div>

      {/* Feedback Textarea */}
      <div className="space-y-2">
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
          <Loader className="size-5 animate-spin text-primary mr-2" />
          <span>Saving your score...</span>
        </div>
      )}
    </div>
  );
}