"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/core/Dialog";
import { Button } from "@/components/ui/core/Button";
import { Input } from "@/components/ui/core/Input";
import { Label } from "@/components/ui/core/Label";
import { Alert } from "@/components/ui/core/Alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/core/Select";
import { AlertCircle } from "lucide-react";

interface JobGrade {
  id: string;
  level: number;
  grade: string;
  typicalResponsibilities?: string | null;
}

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId?: string;
  onSubmit?: (data: {
    teamId: string;
    email: string;
    fullName: string;
    title?: string;
    jobGradeId?: string;
    joinedDate?: string;
    profilePhoto?: File;
  }) => Promise<void>;
}

export function AddMemberModal({
  isOpen,
  onClose,
  teamId,
  onSubmit,
}: AddMemberModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    title: "",
    jobGradeId: "",
    joinedDate: "",
    profilePhoto: null as File | null,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobGrades, setJobGrades] = useState<JobGrade[]>([]);
  const [isLoadingGrades, setIsLoadingGrades] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchJobGrades();
    }
  }, [isOpen]);

  async function fetchJobGrades() {
    try {
      setIsLoadingGrades(true);
      const response = await fetch('/api/job-grades');
      const data = await response.json();
      
      if (data.success) {
        setJobGrades(data.data);
      } else {
        console.error("Failed to fetch job grades:", data.error);
      }
    } catch (error) {
      console.error("Error fetching job grades:", error);
    } finally {
      setIsLoadingGrades(false);
    }
  }

  async function handleSubmit() {
    try {
      setIsSubmitting(true);
      setError(null);

      const { email, fullName } = formData;
      const trimmedEmail = email.trim();
      const trimmedFullName = fullName.trim();

      if (!trimmedEmail || !trimmedFullName) {
        throw new Error("Email and full name are required");
      }

      if (!teamId) {
        throw new Error("Team ID is required");
      }

      if (!onSubmit) {
        throw new Error("onSubmit handler is required");
      }

      await onSubmit({
        teamId,
        email: trimmedEmail,
        fullName: trimmedFullName,
        title: formData.title.trim() || undefined,
        jobGradeId: formData.jobGradeId || undefined,
        joinedDate: formData.joinedDate || undefined,
        profilePhoto: formData.profilePhoto || undefined,
      });

      handleReset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setFormData({
      email: "",
      fullName: "",
      title: "",
      jobGradeId: "",
      joinedDate: "",
      profilePhoto: null,
    });
    setError(null);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{error}</p>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email">Company Email*</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="member@example.com"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name*</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Developer"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="jobGrade">Job Grade</Label>
            <Select
              value={formData.jobGradeId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, jobGradeId: value }))}
            >
              <SelectTrigger id="jobGrade">
                <SelectValue placeholder="Select job grade" />
              </SelectTrigger>
              <SelectContent>
                {jobGrades.map((grade) => (
                  <SelectItem key={grade.id} value={grade.id}>
                    {`${grade.level} / ${grade.grade}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="joinedDate">Joined Date</Label>
            <Input
              id="joinedDate"
              type="date"
              value={formData.joinedDate}
              onChange={(e) => setFormData(prev => ({ ...prev, joinedDate: e.target.value }))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="profilePhoto">Profile Photo</Label>
            <Input
              id="profilePhoto"
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFormData(prev => ({ ...prev, profilePhoto: e.target.files![0] }));
                }
              }}
              accept="image/*"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              handleReset();
              onClose();
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}