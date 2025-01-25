import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { User, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import type {
  BusinessActivityResponse,
  TeamResponse,
  TeamMemberResponse,
} from "@/lib/types/api";
import { TeamInitiative } from "@/lib/types/intiative";
import StarRating from '@/components/ui/StarRating';

interface PerformanceRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId?: string;
  memberId?: string;
  memberName?: string;
  memberTitle?: string | null;
  onSubmit: (data: {
    teamId: string;
    memberId: string;
    initiativeId: string;
    rating: number;
    feedback?: string;
  }) => Promise<void>;
}

export default function PerformanceRatingModal({
  isOpen,
  onClose,
  teamId: initialTeamId,
  memberId: initialMemberId,
  memberName: initialMemberName,
  memberTitle: initialMemberTitle,
  onSubmit,
}: PerformanceRatingModalProps) {
  const [teams, setTeams] = useState<TeamResponse[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(initialTeamId || "");
  const [members, setMembers] = useState<TeamMemberResponse[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>(initialMemberId || "");
  const [initiatives, setInitiatives] = useState<BusinessActivityResponse[]>([]);
  const [selectedInitiativeId, setSelectedInitiativeId] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTeams();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedTeamId) {
      fetchMembers(selectedTeamId);
      fetchInitiatives(selectedTeamId);
    }
  }, [selectedTeamId]);

  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/teams");
      const data = await response.json();
      if (data.success) {
        setTeams(data.data);
        if (!initialTeamId && data.data.length === 1) {
          setSelectedTeamId(data.data[0].id);
        }
      }
    } catch (err) {
      console.log(err);
      setError("Failed to fetch teams");
    }
  };

  const fetchMembers = async (teamId: string) => {
    try {
      const response = await fetch(`/api/teams/${teamId}/members`);
      const data = await response.json();
      if (data.success) {
        setMembers(data.data);
      }
    } catch (err) {
      console.log(err);
      setError("Failed to fetch team members");
    }
  };

  const fetchInitiatives = async (teamId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/initiatives/${teamId}`);
      const data = await response.json();
      if (data.success) {
        const teamInitiatives = data.data.map((ti: TeamInitiative) => ti.initiative);
        setInitiatives(teamInitiatives);
      }
    } catch (err) {
      console.log(err);
      setError("Failed to fetch initiatives");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      await onSubmit({
        teamId: selectedTeamId,
        memberId: selectedMemberId,
        initiativeId: selectedInitiativeId,
        rating,
        feedback: feedback.trim() || undefined,
      });

      handleReset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!initialTeamId) setSelectedTeamId("");
    if (!initialMemberId) setSelectedMemberId("");
    setSelectedInitiativeId("");
    setRating(0);
    setFeedback("");
  };

  const getSelectedMemberName = () => {
    if (initialMemberName) return initialMemberName;
    const member = members.find((m) => m.id === selectedMemberId);
    return member?.user.name || member?.user.email || "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="base">
        <DialogHeader>
          <DialogTitle>Add Performance Rating</DialogTitle>
          <DialogDescription>
            Rate team member performance and provide feedback.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="danger">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Team Selection */}
          {!initialTeamId && teams.length > 1 && (
            <div>
              <Select 
                value={selectedTeamId} 
                onValueChange={setSelectedTeamId}
                width="full"
                withLabel
                label="Select Team"
              >
                <SelectTrigger size="base">
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem 
                      key={team.id} 
                      value={team.id} 
                      size="base"
                    >
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Member Selection */}
          {!initialMemberId && selectedTeamId && (
            <div>
              <Select 
                value={selectedMemberId} 
                onValueChange={setSelectedMemberId}
                width="full"
                withLabel
                label="Select Member"
              >
                <SelectTrigger size="base">
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem 
                      key={member.id} 
                      value={member.id} 
                      size="base"
                    >
                      {member.user.name || member.user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Initiative Selection */}
          <div>
            <Select
              value={selectedInitiativeId}
              onValueChange={setSelectedInitiativeId}
              width="full"
              withLabel
              label="Select Initiative"
            >
              <SelectTrigger 
                size="base"
                disabled={loading || !selectedTeamId || !selectedMemberId}
              >
                <SelectValue
                  placeholder={
                    loading
                      ? "Loading initiatives..."
                      : !selectedTeamId || !selectedMemberId
                      ? "Select team and member first"
                      : "Select an initiative"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {initiatives.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    {loading ? "Loading..." : "No initiatives available for this team"}
                  </div>
                ) : (
                  initiatives.map((initiative) => (
                    <SelectItem 
                      key={initiative.id} 
                      value={initiative.id} 
                      size="base"
                    >
                      {initiative.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating</Label>
            <div>
            <StarRating 
      value={rating} 
      onChange={setRating} 
      size="lg"
      showValue={true}
    />
            </div>
          </div>

          {/* Feedback */}
          <div>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter feedback..."
              rows={3}
              inputSize="base"
              showCount
              maxLength={1000}
              withLabel
              label="Feedback (Optional)"
            />
          </div>
        </form>

        <DialogFooter>
          <Button
            variant="neutral"
            appearance="text"
            onClick={handleReset}
            disabled={saving}
          >
            Reset
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={saving || !selectedTeamId || !selectedMemberId || !selectedInitiativeId || rating === 0}
            isLoading={saving}
          >
            Save Rating
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}