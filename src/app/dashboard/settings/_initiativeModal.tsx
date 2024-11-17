// app/dashboard/settings/_initiativeModal.tsx
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Save } from "lucide-react";
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initiative ? 'Edit Initiative' : 'Create Initiative'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter initiative name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description (Optional)
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter initiative description"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
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
              disabled={saving || !hasChanges() || !name.trim()}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Initiative'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}