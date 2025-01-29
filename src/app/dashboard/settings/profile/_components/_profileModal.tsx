// app/dashboard/settings/_profileModal.tsx
import { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { DialogWithConfig } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
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

  const hasChanges = () => 
    firstName !== profile.firstName ||
    lastName !== profile.lastName ||
    title !== (profile.title || '');

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);

      if (user) {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            title: title.trim() || null,
          },
        });

        const response = await fetch('/api/user/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
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
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (hasChanges() && !confirm('You have unsaved changes. Are you sure you want to close?')) {
      return;
    }
    onClose();
  };

  const footerConfig = {
    primaryAction: {
      label: 'Save Changes',
      onClick: handleSubmit,
      isLoading: saving,
      disabled: !hasChanges(),
    },
    secondaryAction: {
      label: 'Cancel',
      onClick: handleClose,
      disabled: saving
    }
  };

  return (
    <DialogWithConfig 
      open={isOpen}
      onOpenChange={handleClose}
      title="Edit Profile"
      size="base"
      footer="two-actions"
      footerConfig={footerConfig}
    >
      <div className="space-y-6">
        {error && (
          <Alert variant="danger">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter first name"
            inputSize="base"
            withLabel
            label="First Name"
          />

          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter last name"
            inputSize="base"
            withLabel
            label="Last Name"
          />

          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Senior Developer"
            inputSize="base"
            withLabel
            label="Job Title"
          />
        </div>
      </div>
    </DialogWithConfig>
  );
}