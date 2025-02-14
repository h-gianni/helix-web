"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/core/Dialog";
import { Button } from "@/components/ui/core/Button";
import { Input } from "@/components/ui/core/Input";
import { Textarea } from "@/components/ui/core/Textarea";
import { Label } from "@/components/ui/core/Label";
import { Alert } from "@/components/ui/core/Alert";
import {
  AlertCircle,
} from "lucide-react";

interface TeamEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  teamDescription?: string | null;
  onSave?: (name: string, description: string | null) => Promise<void>;
}

export function TeamEditModal({
  isOpen,
  onClose,
  teamName,
  teamDescription,
  onSave,
}: TeamEditModalProps) {
  const [name, setName] = useState(teamName);
  const [description, setDescription] = useState(teamDescription || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      if (!onSave) {
        throw new Error("Save handler is not defined");
      }
      setIsSubmitting(true);
      setError(null);
      await onSave(name.trim(), description.trim() || null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (name !== teamName || description !== (teamDescription || '')) {
      if (!confirm('You have unsaved changes. Are you sure you want to close?')) {
        return;
      }
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Team Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{error}</p>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="name">Team Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter team name"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter team description"
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}