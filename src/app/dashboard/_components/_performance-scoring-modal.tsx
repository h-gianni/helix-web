"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/core/Dialog";
import { Button } from "@/components/ui/core/Button";
import { Textarea } from "@/components/ui/core/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/core/Select";
import { Label } from "@/components/ui/core/Label";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { User, Loader } from "lucide-react";
import StarRating from "@/components/ui/core/Star-rating";
import {
  usePerformanceRatingStore,
  useTeams,
  useTeamMembers,
  useTeamActivities,
  useSubmitRating,
} from "@/store/performance-rating-store";

interface PerformanceRatingModalProps {
  teamId?: string;
  memberId?: string;
  memberName?: string;
  memberTitle?: string | null;
}

function PerformanceRatingModal({
  teamId,
  memberId,
  memberName,
  memberTitle,
}: PerformanceRatingModalProps) {
  const {
    isOpen,
    selectedTeamId,
    selectedMemberId,
    selectedActivityId,
    rating,
    feedback,
    setIsOpen,
    setSelectedTeamId,
    setSelectedMemberId,
    setSelectedActivityId,
    setRating,
    setFeedback,
    reset,
  } = usePerformanceRatingStore();

  // Queries with proper type handling
  const { data: teams = [], isLoading: teamsLoading } = useTeams();
  const { data: members = [], isLoading: membersLoading } = useTeamMembers(
    selectedTeamId || teamId || ""
  );
  const { data: activities = [], isLoading: activitiesLoading } =
    useTeamActivities(selectedTeamId || teamId || "");
  const submitRating = useSubmitRating();

  // Initialize with props when the modal opens
  useEffect(() => {
    console.log(teams, '-------------team')

    if (isOpen) {
      if (teamId) setSelectedTeamId(teamId);
      if (memberId) setSelectedMemberId(memberId);
    }
  }, [isOpen, teamId, memberId, setSelectedTeamId, setSelectedMemberId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentTeamId = selectedTeamId || teamId;
    const currentMemberId = selectedMemberId || memberId;

    if (!currentTeamId || !currentMemberId || !selectedActivityId || rating === 0) return;

    try {
      await submitRating.mutateAsync({
        teamId: currentTeamId,
        memberId: currentMemberId,
        activityId: selectedActivityId,
        rating,
        feedback: feedback.trim() || undefined,
      });

      handleReset();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to submit rating:", error);
    }
  };

  const handleReset = () => {
    reset();
    // Preserve initial values if they exist
    if (teamId) setSelectedTeamId(teamId);
    if (memberId) setSelectedMemberId(memberId);
  };

  const currentTeamId = selectedTeamId || teamId;
  const currentMemberId = selectedMemberId || memberId;
  const hasTeams = teams && teams.length > 0;

  return (
    <Dialog data-slot="dialog" open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent data-slot="dialog-content">
        <DialogHeader data-slot="dialog-header">
          <DialogTitle data-slot="dialog-title">Add Performance Rating</DialogTitle>
          <DialogDescription data-slot="dialog-description">
            Rate team member performance with feedback.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {submitRating.error && (
            <Alert data-slot="alert" variant="destructive">
              <AlertDescription data-slot="alert-description">
                {submitRating.error instanceof Error
                  ? submitRating.error.message
                  : "Failed to submit rating"}
              </AlertDescription>
            </Alert>
          )}

          {memberName && (
            <div className="space-y-2">
              <Label data-slot="label">Member</Label>
              <div className="flex items-center gap-2 p-3 rounded border bg-muted">
                {/* Replaced h-4 w-4 with size-4 */}
                <User className="size-4 text-foreground/70" />
                <span>
                  {memberName}
                  {memberTitle && <span className="ml-1">- {memberTitle}</span>}
                </span>
              </div>
            </div>
          )}

          {!teamId && hasTeams && (
            <div className="flex flex-col gap-2">
              <Label data-slot="label" className="text-sm font-medium text-foreground">
                Select Team
              </Label>
              <Select
                data-slot="select"
                value={selectedTeamId ?? ""}
                onValueChange={setSelectedTeamId}
                disabled={teamsLoading}
              >
                <SelectTrigger data-slot="select-trigger" className="w-full">
                  <SelectValue
                    data-slot="select-value"
                    placeholder={teamsLoading ? "Loading teams..." : "Select a team"}
                  />
                </SelectTrigger>
                <SelectContent data-slot="select-content">
                  {teams.map((team) => (
                    <SelectItem data-slot="select-item" key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {!memberId && currentTeamId && (
            <div className="flex flex-col gap-2">
              <Label data-slot="label" className="text-sm font-medium text-foreground">
                Select Member
              </Label>
              <Select
                data-slot="select"
                value={selectedMemberId ?? ""}
                onValueChange={setSelectedMemberId}
                disabled={membersLoading}
              >
                <SelectTrigger data-slot="select-trigger" className="w-full">
                  <SelectValue
                    data-slot="select-value"
                    placeholder={membersLoading ? "Loading members..." : "Select a member"}
                  />
                </SelectTrigger>
                <SelectContent data-slot="select-content">
                  {members.map((member) => (
                    <SelectItem data-slot="select-item" key={member.id} value={member.id}>
                      {member.user.name || member.user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label data-slot="label" className="text-sm font-medium text-foreground">
              Select Activity
            </Label>
            <Select
              data-slot="select"
              value={selectedActivityId ?? ""}
              onValueChange={setSelectedActivityId}
              disabled={activitiesLoading || !currentTeamId || !currentMemberId}
            >
              <SelectTrigger data-slot="select-trigger" className="w-full">
                <SelectValue
                  data-slot="select-value"
                  placeholder={
                    activitiesLoading
                      ? "Loading activities..."
                      : !currentTeamId || !currentMemberId
                      ? "Select team and member first"
                      : "Select an activity"
                  }
                />
              </SelectTrigger>
              <SelectContent data-slot="select-content">
                {activities.length === 0 ? (
                  <div className="p-2 text-sm">
                    {activitiesLoading ? "Loading..." : "No activities available"}
                  </div>
                ) : (
                  activities.map((activity) => (
                    <SelectItem data-slot="select-item" key={activity.id} value={activity.id}>
                      {activity.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label data-slot="label">Rating</Label>
            <div className="flex justify-center py-2">
              {/* Possibly also add data-slot to StarRating if needed */}
              <StarRating value={rating} onChange={setRating} size="lg" showValue />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label data-slot="label" className="text-sm font-medium text-foreground" htmlFor="feedback">
              Feedback (Optional)
            </Label>
            <Textarea
              data-slot="textarea"
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter feedback..."
              rows={3}
              maxLength={250}
              className="w-full resize-none"
            />
            <div className="text-right text-xs">
              {feedback.length} / 250
            </div>
          </div>

          <DialogFooter data-slot="dialog-footer">
            <Button
              data-slot="button"
              variant="secondary"
              onClick={handleReset}
              disabled={submitRating.isPending}
              type="button"
            >
              Reset
            </Button>
            <Button
              data-slot="button"
              variant="default"
              type="submit"
              disabled={
                submitRating.isPending ||
                !currentTeamId ||
                !currentMemberId ||
                !selectedActivityId ||
                rating === 0
              }
            >
              {submitRating.isPending ? (
                <span className="flex items-center gap-2">
                  {/* Replaced h-4 w-4 with size-4 */}
                  <Loader className="size-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Rating"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PerformanceRatingModal;
