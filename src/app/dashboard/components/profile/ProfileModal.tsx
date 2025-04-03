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
import { AlertCircle } from "lucide-react";
import { useUpdateProfile } from "@/store/user-store";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    firstName: string;
    lastName: string;
    title: string | null;
  };
  onUpdate: (data: { firstName: string; lastName: string; title: string | null }) => Promise<void>;
}

export function ProfileModal({
  isOpen,
  onClose,
  profile,
  onUpdate,
}: ProfileModalProps) {
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    title: profile.title || "",
  });
  const [error, setError] = useState<string | null>(null);
  
  // Use the mutation hook from our updated store
  const updateProfile = useUpdateProfile();
  const isSubmitting = updateProfile.isPending;

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
      setError(null);

      await onUpdate({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        title: formData.title.trim() || null,
      });
      
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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
          
          {updateProfile.error && (
            <Alert data-slot="alert" variant="destructive">
              <AlertCircle className="size-4" />
              <p className="text-sm">
                {updateProfile.error instanceof Error 
                  ? updateProfile.error.message 
                  : "Failed to update profile"}
              </p>
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