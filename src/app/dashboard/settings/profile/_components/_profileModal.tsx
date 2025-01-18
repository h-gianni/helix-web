// app/dashboard/settings/_profileModal.tsx
import { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Save, AlertCircle } from "lucide-react";

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

export function ProfileModal({
  isOpen,
  onClose,
  profile,
  onUpdate
}: ProfileModalProps) {
  const { user } = useUser();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setTitle(profile.title || '');
    setError(null);
  }, [profile, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);

      if (user) {
        // Update metadata first
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            title: title.trim() || null,
          },
        });

        // Update name using the API route
        const response = await fetch('/api/user/profile', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to update profile');
        }

        await onUpdate();
        onClose();
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = () => {
    return (
      firstName !== profile.firstName ||
      lastName !== profile.lastName ||
      title !== (profile.title || '')
    );
  };

  const handleClose = () => {
    if (hasChanges()) {
      const message = 'You have unsaved changes. Are you sure you want to close?';
      if (!window.confirm(message)) return;
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent size="base">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information and job title.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="danger">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                inputSize="base"
                withLabel
                label="First Name"
              />
            </div>

            <div className="space-y-2">
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                inputSize="base"
                withLabel
                label="Last Name"
              />
            </div>

            <div className="space-y-2">
              <Input
                id="jobTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Senior Developer"
                inputSize="base"
                withLabel
                label="Job Title"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="neutral"
              appearance="outline"
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={saving || !hasChanges()}
              isLoading={saving}
              leadingIcon={<Save className="h-4 w-4" />}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}