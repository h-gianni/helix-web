// app/dashboard/_components/_performanceRatingModal.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import StarRating from "./_starRating";
import type { InitiativeResponse } from "@/lib/types/api";
import { Label } from "@/components/ui/Label";
import { User } from "lucide-react";

interface PerformanceRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  memberId: string;
  memberName: string;
  memberTitle?: string | null;
  onSubmit: (data: {
    initiativeId: string;
    rating: number;
    feedback?: string;
  }) => Promise<void>;
}

export default function PerformanceRatingModal({
  isOpen,
  onClose,
  teamId,

  memberName,
  memberTitle,
  onSubmit,
}: PerformanceRatingModalProps) {
  const [initiatives, setInitiatives] = useState<InitiativeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [selectedInitiativeId, setSelectedInitiativeId] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    const fetchInitiatives = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/initiatives?teamId=${teamId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch initiatives");
        }

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || "Failed to fetch initiatives");
        }

        setInitiatives(data.data);
      } catch (err) {
        console.error("Error fetching initiatives:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && teamId) {
      fetchInitiatives();
    }
  }, [isOpen, teamId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      await onSubmit({
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
    setSelectedInitiativeId("");
    setRating(0);
    setFeedback("");
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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

          {/* Member Display */}
          <div className="space-y-2">
            <Label>Member</Label>
            <div className="p-2 border rounded-md bg-muted">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-base">
                  {memberName}
                  {memberTitle && (
                    <span className="text-gray-500 ml-1">- {memberTitle}</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Initiative Selection */}
          <div className="space-y-2">
            <Label>Select Initiative</Label>
            <Select
              value={selectedInitiativeId}
              onValueChange={setSelectedInitiativeId}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an initiative" />
              </SelectTrigger>
              <SelectContent>
                {initiatives.map((initiative) => (
                  <SelectItem key={initiative.id} value={initiative.id}>
                    {initiative.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              disabled={saving || !selectedInitiativeId || rating === 0}
            >
              {saving ? "Saving..." : "Save Rating"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
