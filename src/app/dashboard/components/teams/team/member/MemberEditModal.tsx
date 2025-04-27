"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/core/Dialog";
import { Button } from "@/components/ui/core/Button";
import { Input } from "@/components/ui/core/Input";
import { Checkbox } from "@/components/ui/core/Checkbox";
import { Alert } from "@/components/ui/core/Alert";
import { Label } from "@/components/ui/core/Label";
import { AlertCircle } from "lucide-react";
import { useMemberStore, useUpdateMember } from "@/store/member-store";

interface EditMemberModalProps {
  memberId: string;
  teamId: string;
}

interface MemberUpdateData {
  firstName: string;
  lastName: string;
  title: string;
  isAdmin: boolean;
}

function EditMemberModal({ memberId, teamId }: EditMemberModalProps) {
  const { isEditModalOpen, setEditModalOpen } = useMemberStore();
  const updateMember = useUpdateMember();

  const [formData, setFormData] = useState<MemberUpdateData>({
    firstName: "",
    lastName: "",
    title: "",
    isAdmin: false,
  });

  useEffect(() => {
    if (!isEditModalOpen) return;

    async function fetchMemberData() {
      try {
        const response = await fetch(`/api/teams/${teamId}/members/${memberId}`);
        const data = await response.json();

        if (!data.success || !data.data) {
          throw new Error(data.error || "Failed to fetch member details");
        }

        setFormData({
          firstName: data.data.firstName || "",
          lastName: data.data.lastName || "",
          title: data.data.title || "",
          isAdmin: data.data.isAdmin || false,
        });
      } catch (error) {
        console.error("Error fetching member:", error);
      }
    }

    fetchMemberData();
  }, [teamId, memberId, isEditModalOpen]);

  async function handleSubmit() {
    try {
      await updateMember.mutateAsync({
        teamId,
        memberId,
        ...formData,
      });
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating member:", error);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <Dialog
      data-slot="dialog"
      open={isEditModalOpen}
      onOpenChange={setEditModalOpen}
    >
      <DialogContent data-slot="dialog-content" className="sm:max-w-[425px]">
        <DialogHeader data-slot="dialog-header">
          <DialogTitle data-slot="dialog-title">Edit Member</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {updateMember.error && (
            <Alert data-slot="alert" variant="destructive">
              {/* Replaced h-4 w-4 with size-4 */}
              <AlertCircle className="size-4" />
              <p className="text-sm">
                {updateMember.error instanceof Error
                  ? updateMember.error.message
                  : "Failed to update member"}
              </p>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
        </div>

        <DialogFooter data-slot="dialog-footer">
          <Button
            data-slot="button"
            variant="outline"
            onClick={() => setEditModalOpen(false)}
            disabled={updateMember.isPending}
          >
            Cancel
          </Button>
          <Button
            data-slot="button"
            variant="primary"
            onClick={handleSubmit}
            disabled={updateMember.isPending}
          >
            {updateMember.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { EditMemberModal };
