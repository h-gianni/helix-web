'use client';

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
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Save, AlertCircle } from "lucide-react";
import type { ApiResponse } from "@/lib/types/api";

interface MemberDetails {
  id: string;
  firstName: string | null;
  lastName: string | null;
  title: string | null;
  isAdmin: boolean;
  user: {
    email: string;
    name: string | null;
  };
}

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  teamId: string;
  onUpdate: () => Promise<void>;
}

export function EditMemberModal({ 
  isOpen, 
  onClose, 
  memberId, 
  teamId,
  onUpdate 
}: EditMemberModalProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('');
  const [originalData, setOriginalData] = useState<MemberDetails | null>(null);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      if (!isOpen) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/teams/${teamId}/members/${memberId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch member details');
        }

        const data: ApiResponse<MemberDetails> = await response.json();

        if (!data.success || !data.data) {
          throw new Error(data.error || 'Failed to fetch member details');
        }

        setOriginalData(data.data);
        setFirstName(data.data.firstName || '');
        setLastName(data.data.lastName || '');
        setTitle(data.data.title || '');
      } catch (err) {
        console.error('Error fetching member:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberDetails();
  }, [isOpen, memberId, teamId]);

  const hasChanges = () => {
    if (!originalData) return false;
    return (
      firstName !== (originalData.firstName || '') ||
      lastName !== (originalData.lastName || '') ||
      title !== (originalData.title || '')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const response = await fetch(
        `/api/teams/${teamId}/members/${memberId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: firstName.trim() || null,
            lastName: lastName.trim() || null,
            title: title.trim() || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update member');
      }

      await onUpdate();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges() && !confirm('You have unsaved changes. Are you sure you want to cancel?')) {
      return;
    }
    setError(null);
    onClose();
  };

  const resetForm = () => {
    if (originalData) {
      setFirstName(originalData.firstName || '');
      setLastName(originalData.lastName || '');
      setTitle(originalData.title || '');
    }
    setError(null);
  };

  useEffect(() => {
    if (isOpen && originalData) {
      resetForm();
    }
  }, [isOpen, originalData]);

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent size="base">
        <DialogHeader>
          <DialogTitle>Edit Member Details</DialogTitle>
          <DialogDescription>
            Update the member's profile information.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading member details...
          </div>
        ) : (
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
                onClick={handleCancel}
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
        )}
      </DialogContent>
    </Dialog>
  );
}