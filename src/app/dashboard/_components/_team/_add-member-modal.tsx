"use client";

import React from "react";
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
import {
  useJobGrades,
  useAddMember,
  useMemberModalStore,
} from "@/store/member-store";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId?: string;
}

export function AddMemberModal({ isOpen, onClose, teamId }: AddMemberModalProps) {
  const { formData, setFormData, resetForm } = useMemberModalStore();
  const { data: jobGrades, isLoading: isLoadingGrades } = useJobGrades();
  const { mutate: addMember, status, error } = useAddMember();
  const isSubmitting = status === "pending";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId) return;

    const { email, fullName } = formData;
    const trimmedEmail = email.trim();
    const trimmedFullName = fullName.trim();

    if (!trimmedEmail || !trimmedFullName) {
      return;
    }

    // Create FormData instance
    const submitData = new FormData();
    submitData.append("email", trimmedEmail);
    submitData.append("fullName", trimmedFullName);

    if (formData.title.trim()) {
      submitData.append("title", formData.title.trim());
    }

    if (formData.jobGradeId) {
      submitData.append("jobGradeId", formData.jobGradeId);
    }

    if (formData.joinedDate) {
      submitData.append("joinedDate", formData.joinedDate);
    }

    if (formData.profilePhoto) {
      submitData.append("profilePhoto", formData.profilePhoto);
    }

    addMember(
      {
        teamId,
        email: formData.email,
        fullName: formData.fullName,
        ...Object.fromEntries(submitData),
      },
      {
        onSuccess: () => {
          resetForm();
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog data-slot="dialog" open={isOpen} onOpenChange={handleClose}>
      <DialogContent data-slot="dialog-content" className="sm:max-w-[425px]">
        <DialogHeader data-slot="dialog-header">
          <DialogTitle data-slot="dialog-title">Add Team Member</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {error && (
            <Alert data-slot="alert" variant="destructive">
              {/* Replace h-4 w-4 with size-4 */}
              <AlertCircle className="size-4" />
              <p className="text-sm">
                {error instanceof Error ? error.message : "An error occurred"}
              </p>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email">Company Email*</Label>
            <Input
              data-slot="input"
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ email: e.target.value })}
              placeholder="member@example.com"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name*</Label>
            <Input
              data-slot="input"
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ fullName: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              data-slot="input"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ title: e.target.value })}
              placeholder="e.g., Developer"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="jobGrade">Job Grade</Label>
            <Select
              data-slot="select"
              value={formData.jobGradeId}
              onValueChange={(value) => setFormData({ jobGradeId: value })}
            >
              <SelectTrigger data-slot="select-trigger" id="jobGrade">
                <SelectValue data-slot="select-value" placeholder="Select job grade" />
              </SelectTrigger>
              <SelectContent data-slot="select-content">
                {jobGrades?.map((grade) => (
                  <SelectItem data-slot="select-item" key={grade.id} value={grade.id}>
                    {`${grade.level} / ${grade.grade}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="joinedDate">Joined Date</Label>
            <Input
              data-slot="input"
              id="joinedDate"
              type="date"
              value={formData.joinedDate}
              onChange={(e) => setFormData({ joinedDate: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="profilePhoto">Profile Photo</Label>
            <Input
              data-slot="input"
              id="profilePhoto"
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFormData({ profilePhoto: e.target.files[0] });
                }
              }}
              accept="image/*"
            />
          </div>

          <DialogFooter data-slot="dialog-footer">
            <Button
              data-slot="button"
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              data-slot="button"
              type="submit"
              disabled={isSubmitting || !formData.email || !formData.fullName}
            >
              {isSubmitting ? "Adding..." : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
