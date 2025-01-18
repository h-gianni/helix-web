// app/dashboard/teams/[teamId]/_teamEditModal.tsx
import { useState } from 'react';
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
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { AlertCircle } from "lucide-react";

interface TeamEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  teamDescription?: string | null;
  onSave: (name: string, description: string | null) => Promise<void>;
}

export default function TeamEditModal({
  isOpen,
  onClose,
  teamName,
  teamDescription,
  onSave,
}: TeamEditModalProps) {
  const [name, setName] = useState(teamName);
  const [description, setDescription] = useState(teamDescription || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await onSave(
        name.trim(),
        description.trim() || null
      );
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (
      name !== teamName ||
      description !== (teamDescription || '') &&
      !confirm('You have unsaved changes. Are you sure you want to close?')
    ) {
      return;
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent size="base">
        <DialogHeader>
          <DialogTitle>Edit Team Details</DialogTitle>
          <DialogDescription>
            Make changes to your team's information.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="danger">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Input
              id="teamName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter team name"
              required
              inputSize="base"
              withLabel
              label="Team Name"
            />
          </div>
          
          <div className="space-y-2">
            <Textarea
              id="teamDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter team description"
              rows={3}
              inputSize="base"
              withLabel
              label="Description"
            />
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
              disabled={saving || (!name.trim() || (name === teamName && description === (teamDescription || '')))}
              isLoading={saving}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}