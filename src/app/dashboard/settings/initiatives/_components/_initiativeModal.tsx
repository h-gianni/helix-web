// app/dashboard/settings/_initiativeModal.tsx
import { useState, useEffect } from 'react';
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
import { Save, AlertCircle } from "lucide-react";
import type { InitiativeResponse } from "@/lib/types/api";

interface InitiativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initiative?: InitiativeResponse | null;
  onUpdate: () => Promise<void>;
}

export function InitiativeModal({ 
  isOpen, 
  onClose, 
  initiative,
  onUpdate 
}: InitiativeModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initiative) {
      setName(initiative.name);
      setDescription(initiative.description || '');
    } else {
      setName('');
      setDescription('');
    }
    setError(null);
  }, [initiative, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);

      const method = initiative ? 'PATCH' : 'POST';
      const url = initiative
        ? `/api/initiatives/${initiative.id}`
        : '/api/initiatives';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to save initiative');
      }

      await onUpdate();
      onClose();
    } catch (err) {
      console.error('Error saving initiative:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = () => {
    if (!initiative) return name.trim() !== '' || description.trim() !== '';
    return (
      name !== initiative.name ||
      description !== (initiative.description || '')
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
          <DialogTitle>
            {initiative ? 'Edit Initiative' : 'Create Initiative'}
          </DialogTitle>
          <DialogDescription>
            {initiative 
              ? 'Update the details of this performance initiative.'
              : 'Create a new performance initiative for team members.'
            }
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
                id="initiative-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter initiative name"
                required
                inputSize="base"
                withLabel
                label="Name"
              />
            </div>

            <div className="space-y-2">
              <Textarea
                id="initiative-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter initiative description"
                rows={3}
                inputSize="base"
                withLabel
                label="Description"
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
              disabled={saving || !hasChanges() || !name.trim()}
              isLoading={saving}
              leadingIcon={<Save className="h-4 w-4" />}
            >
              Save Initiative
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}