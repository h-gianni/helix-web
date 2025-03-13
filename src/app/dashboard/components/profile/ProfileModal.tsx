"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
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
import { AlertCircle } from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    firstName: string;
    lastName: string;
    title: string | null;
  };
  onUpdate: () => Promise<void>;
}

function ProfileModal({
  isOpen,
  onClose,
  profile,
  onUpdate,
}: ProfileModalProps) {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    title: profile.title || "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      title: profile.title || "",
    });
    setError(null);
  }, [profile, isOpen]);

  const hasChanges = () =>
    formData.firstName !== profile.firstName ||
    formData.lastName !== profile.lastName ||
    formData.title !== (profile.title || "");

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (user) {
        // Clerk user data
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            title: formData.title.trim() || null,
          },
        });

        // Our own backend
        const response = await fetch("/api/user/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to update profile");
        }

        await onUpdate();
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (hasChanges() && !confirm("Discard unsaved changes?")) return;
    onClose();
  };

  return (
    <Dialog data-slot="dialog" open={isOpen} onOpenChange={handleClose}>
      <DialogContent data-slot="dialog-content" className="sm:max-w-[425px]">
        <DialogHeader data-slot="dialog-header">
          <DialogTitle data-slot="dialog-title">Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {error && (
            <Alert data-slot="alert" variant="destructive">
              <AlertCircle className="size-4" />
              <p className="text-sm">{error}</p>
            </Alert>
          )}

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                data-slot="input"
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                }
                placeholder="Enter first name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                data-slot="input"
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                }
                placeholder="Enter last name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                data-slot="input"
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g., Senior Developer"
              />
            </div>
          </div>
        </div>

        <DialogFooter data-slot="dialog-footer">
          <Button
            data-slot="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            data-slot="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !hasChanges()}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ProfileModal };
