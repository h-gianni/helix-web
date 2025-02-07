import { useState, useEffect } from 'react';
import { DialogWithConfig } from "@/components/ui/core/Dialog";
import { Button } from "@/components/ui/core/Button";
import { Input } from "@/components/ui/core/Input";
import { Textarea } from "@/components/ui/core/Textarea";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { Save, AlertCircle } from "lucide-react";
import type { BusinessActivityResponse } from "@/lib/types/api";

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity?: BusinessActivityResponse | null;
  onUpdate: () => Promise<void>;
}

export function ActivityModal({ 
  isOpen, 
  onClose, 
  activity,
  onUpdate 
}: ActivityModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (activity) {
      setName(activity.name);
      setDescription(activity.description || '');
    } else {
      setName('');
      setDescription('');
    }
    setError(null);
  }, [activity, isOpen]);

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);

      const method = activity ? 'PATCH' : 'POST';
      const url = activity
        ? `/api/business-activities/${activity.id}`
        : '/api/business-activities';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to save business activity');
      }

      await onUpdate();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = () => {
    if (!activity) return name.trim() !== '' || description.trim() !== '';
    return (
      name !== activity.name ||
      description !== (activity.description || '')
    );
  };

  const handleClose = () => {
    if (hasChanges() && !confirm('You have unsaved changes. Are you sure you want to close?')) {
      return;
    }
    onClose();
  };

  const footerConfig = {
    primaryAction: {
      label: 'Save Activity',
      onClick: handleSubmit,
      isLoading: saving,
      disabled: saving || !hasChanges() || !name.trim(),
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
      title={activity ? 'Edit Business Activity' : 'Create Business Activity'}
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter activity name"
            required
            data-size="base"
            withLabel
            label="Name"
          />

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter activity description"
            rows={3}
            data-size="base"
            withLabel
            label="Description"
          />
        </div>
      </div>
    </DialogWithConfig>
  );
}