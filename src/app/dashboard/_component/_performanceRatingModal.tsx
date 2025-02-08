// src/app/dashboard/_component/_performanceRatingModal.tsx
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
import { User } from "lucide-react";
import StarRating from '@/components/ui/core/StarRating';
import { 
  usePerformanceRatingStore, 
  useTeams, 
  useTeamMembers, 
  useTeamActivities,
  useSubmitRating 
} from "@/store/performance-rating-store";

interface PerformanceRatingModalProps {
  teamId?: string;
  memberId?: string;
  memberName?: string;
  memberTitle?: string | null;
}

export default function PerformanceRatingModal({
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
    selectedTeamId || teamId || ''
  );
  const { data: activities = [], isLoading: activitiesLoading } = useTeamActivities(
    selectedTeamId || teamId || ''
  );
  const submitRating = useSubmitRating();

  // Initialize with props when the modal opens
  useEffect(() => {
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
        feedback: feedback.trim() || undefined
      });

      handleReset();
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to submit rating:', error);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Performance Rating</DialogTitle>
          <DialogDescription>
            Rate team member performance with feedback.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {submitRating.error && (
            <Alert variant="danger">
              <AlertDescription>
                {submitRating.error instanceof Error 
                  ? submitRating.error.message 
                  : 'Failed to submit rating'}
              </AlertDescription>
            </Alert>
          )}

          {memberName && (
            <div className="space-y-2">
              <Label>Member</Label>
              <div className="flex items-center gap-2 p-3 rounded-md border bg-muted">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>
                  {memberName}
                  {memberTitle && (
                    <span className="text-muted-foreground ml-1">
                      - {memberTitle}
                    </span>
                  )}
                </span>
              </div>
            </div>
          )}

          {!teamId && hasTeams && (
            <Select 
              value={selectedTeamId ?? undefined}
              onValueChange={setSelectedTeamId}
              width="full"
              withLabel
              label="Select Team"
            >
              <SelectTrigger disabled={teamsLoading}>
                <SelectValue placeholder={teamsLoading ? "Loading teams..." : "Select a team"} />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {!memberId && currentTeamId && (
            <Select 
              value={selectedMemberId ?? undefined}
              onValueChange={setSelectedMemberId}
              width="full"
              withLabel
              label="Select Member"
            >
              <SelectTrigger disabled={membersLoading}>
                <SelectValue placeholder={membersLoading ? "Loading members..." : "Select a member"} />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.user.name || member.user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select
            value={selectedActivityId ?? undefined}
            onValueChange={setSelectedActivityId}
            width="full"
            withLabel
            label="Select activity"
          >
            <SelectTrigger disabled={activitiesLoading || !currentTeamId || !currentMemberId}>
              <SelectValue placeholder={
                activitiesLoading 
                  ? "Loading activities..." 
                  : !currentTeamId || !currentMemberId
                  ? "Select team and member first"
                  : "Select an activity"
              } />
            </SelectTrigger>
            <SelectContent>
              {activities.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground">
                  {activitiesLoading ? "Loading..." : "No activities available"}
                </div>
              ) : (
                activities.map((activity) => (
                  <SelectItem key={activity.id} value={activity.id}>
                    {activity.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex justify-center py-2">
              <StarRating 
                value={rating} 
                onChange={setRating} 
                size="lg"
                showValue={true}
              />
            </div>
          </div>

          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter feedback..."
            rows={3}
            data-size="base"
            showCount
            maxLength={250}
            withLabel
            label="Feedback (Optional)"
          />

          <DialogFooter>
            <Button
              variant="neutral"
              volume="soft"
              onClick={handleReset}
              disabled={submitRating.isPending}
              type="button"
            >
              Reset
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={
                submitRating.isPending || 
                !currentTeamId || 
                !currentMemberId || 
                !selectedActivityId || 
                rating === 0
              }
              isLoading={submitRating.isPending}
            >
              Save Rating
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}