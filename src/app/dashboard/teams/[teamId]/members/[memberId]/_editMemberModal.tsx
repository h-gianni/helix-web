'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Save } from "lucide-react";
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
      console.error('Error updating member:', err);
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

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen && originalData) {
      resetForm();
    }
  }, [isOpen, originalData]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Edit Member Details"
      size="md"
    >
      {loading ? (
        <div className="py-8 text-center">Loading member details...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Job Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Senior Developer"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || !hasChanges()}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}