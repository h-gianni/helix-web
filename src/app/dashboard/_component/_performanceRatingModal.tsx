import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Label } from '@/components/ui/Label';
import { User, Users } from 'lucide-react';
import StarRating from './_starRating';
import type { InitiativeResponse, TeamResponse, TeamMemberResponse } from "@/lib/types/api";

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
  onSubmit
}: PerformanceRatingModalProps) {
  const [teams, setTeams] = useState<TeamResponse[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(initialTeamId || '');
  const [members, setMembers] = useState<TeamMemberResponse[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>(initialMemberId || '');
  const [initiatives, setInitiatives] = useState<InitiativeResponse[]>([]);
  const [selectedInitiativeId, setSelectedInitiativeId] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
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
      const response = await fetch('/api/teams');
      const data = await response.json();
      if (data.success) {
        setTeams(data.data);
        if (!initialTeamId && data.data.length === 1) {
          setSelectedTeamId(data.data[0].id);
        }
      }
    } catch (err) {
      setError('Failed to fetch teams');
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
      setError('Failed to fetch team members');
    }
  };

// Update the fetchInitiatives function in PerformanceRatingModal:
const fetchInitiatives = async (teamId: string) => {
  try {
    setLoading(true);
    const response = await fetch(`/api/teams/${teamId}/initiatives`);
    const data = await response.json();
    if (data.success) {
      // Each item in data.data is a TeamInitiative object that has an initiative property
      const teamInitiatives = data.data.map((ti: any) => ti.initiative);
      setInitiatives(teamInitiatives);
    }
  } catch (err) {
    setError('Failed to fetch initiatives');
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
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!initialTeamId) setSelectedTeamId('');
    if (!initialMemberId) setSelectedMemberId('');
    setSelectedInitiativeId('');
    setRating(0);
    setFeedback('');
  };

  const getSelectedMemberName = () => {
    if (initialMemberName) return initialMemberName;
    const member = members.find(m => m.id === selectedMemberId);
    return member?.user.name || member?.user.email || '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Performance Rating</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Team Selection (only if not provided and multiple teams exist) */}
          {!initialTeamId && teams.length > 1 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Select Team
              </Label>
              <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Member Selection (only if not provided) */}
          {!initialMemberId && selectedTeamId && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Select Member
              </Label>
              <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.user.name || member.user.email}
                      {member.title && ` - ${member.title}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Member Display (when selected) */}
          {(initialMemberId || selectedMemberId) && (
            <div className="space-y-2">
              <Label>Member</Label>
              <div className="p-2 border rounded-md bg-muted">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-base">
                    {getSelectedMemberName()}
                    {initialMemberTitle && (
                      <span className="text-gray-500 ml-1">- {initialMemberTitle}</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}

{/* Initiative Selection */}
<div className="space-y-2">
  <Label>Select Initiative</Label>
  <Select
    value={selectedInitiativeId}
    onValueChange={setSelectedInitiativeId}
    disabled={loading || !selectedTeamId || !selectedMemberId}
  >
    <SelectTrigger>
      <SelectValue placeholder={
        loading 
          ? "Loading initiatives..." 
          : !selectedTeamId || !selectedMemberId
          ? "Select team and member first"
          : "Select an initiative"
      } />
    </SelectTrigger>
    <SelectContent>
      {initiatives.length === 0 ? (
        <div className="p-2 text-sm text-gray-500">
          {loading 
            ? "Loading..." 
            : "No initiatives available for this team"}
        </div>
      ) : (
        initiatives.map((initiative) => (
          <SelectItem key={initiative.id} value={initiative.id}>
            {initiative.name}
            {initiative.description && (
              <span className="text-muted-foreground ml-2">
                ({initiative.description})
              </span>
            )}
          </SelectItem>
        ))
      )}
    </SelectContent>
  </Select>
  {initiatives.length === 0 && !loading && selectedTeamId && (
    <p className="text-sm text-yellow-600">
      No initiatives configured for this team. 
      Please configure initiatives in the team settings.
    </p>
  )}
</div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex justify-center py-2">
              <StarRating value={rating} onChange={setRating} size="lg" />
            </div>
          </div>

          {/* Feedback */}
          <div className="space-y-2">
            <Label>Feedback (Optional)</Label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter feedback..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={saving}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={
                saving ||
                !selectedTeamId ||
                !selectedMemberId ||
                !selectedInitiativeId ||
                rating === 0
              }
            >
              {saving ? 'Saving...' : 'Save Rating'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}