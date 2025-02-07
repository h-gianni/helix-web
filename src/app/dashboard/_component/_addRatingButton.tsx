"use client";

import React, { useState, useEffect } from "react";
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
import StarRating from "@/components/ui/core/StarRating";
import type { BusinessActivityResponse } from "@/lib/types/api";
import { Label } from "@/components/ui/core/Label";
import { AlertCircle, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";

interface PerformanceRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  memberId: string;
  memberName: string;
  memberTitle?: string | null;
  onSubmit: (data: {
    activityId: string;
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
  const [activities, setActivities] = useState<BusinessActivityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/activities?teamId=${teamId}`);
        if (!response.ok) throw new Error("Failed to fetch activities");
        const data = await response.json();
        if (!data.success) throw new Error(data.error || "Failed to fetch activities");
        setActivities(data.data);
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && teamId) {
      fetchActivities();
    }
  }, [isOpen, teamId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await onSubmit({
        activityId: selectedActivityId,
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
    setSelectedActivityId("");
    setRating(0);
    setFeedback("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Performance Rating</DialogTitle>
          <DialogDescription>
            Rate the performance of team members on specific activities.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="danger">
              <AlertCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>Member</Label>
            <div className="flex items-center gap-2 p-3 rounded-md border bg-muted">
              <User className="size-4 text-muted-foreground" />
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

          <div className="space-y-2">
            <Label>Activity</Label>
            <Select
              value={selectedActivityId}
              onValueChange={setSelectedActivityId}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Loading activities..." : "Select an activity"} />
              </SelectTrigger>
              <SelectContent>
                {activities.map((activity) => (
                  <SelectItem key={activity.id} value={activity.id}>
                    {activity.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex justify-center py-2">
              <StarRating 
                value={rating} 
                onChange={setRating} 
                size="lg"
                showValue 
              />
            </div>
          </div>

          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter feedback..."
            rows={3}
            withLabel
            label="Feedback (Optional)"
            showCount
            maxLength={1000}
          />
        </form>

        <DialogFooter>
          <Button
            variant="neutral"
            volume="soft"
            onClick={handleReset}
            disabled={saving}
          >
            Reset
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={saving || !selectedActivityId || rating === 0}
            isLoading={saving}
          >
            Save Rating
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}