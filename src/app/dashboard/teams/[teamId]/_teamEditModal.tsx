// app/dashboard/teams/[teamId]/_teamEditModal.tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";

interface TeamEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  teamDescription: string | null;
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Team Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="teamName">Team Name</Label>
            <Input
              id="teamName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter team name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="teamDescription">
              Description <span className="text-gray-500">(Optional)</span>
            </Label>
            <Textarea
              id="teamDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter team description"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || (!name.trim() || (name === teamName && description === (teamDescription || '')))}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}