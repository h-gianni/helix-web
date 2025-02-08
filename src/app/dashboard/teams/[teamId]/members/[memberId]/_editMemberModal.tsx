// _editMemberModal.tsx
import { useState, useEffect } from "react";
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
import { Alert, AlertIconContainer, AlertDescription } from "@/components/ui/core/Alert";
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

export const EditMemberModal = ({
  memberId,
  teamId,
}: EditMemberModalProps) => {
  const { isEditModalOpen, setEditModalOpen } = useMemberStore();
  const updateMember = useUpdateMember();
  const [formData, setFormData] = useState<MemberUpdateData>({
    firstName: "",
    lastName: "",
    title: "",
    isAdmin: false,
  });

  // Fetch current member data when modal opens
  useEffect(() => {
    const fetchMemberData = async () => {
      if (!isEditModalOpen) return;
      
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
      } catch (err) {
        console.error("Error fetching member:", err);
      }
    };

    fetchMemberData();
  }, [teamId, memberId, isEditModalOpen]);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      await updateMember.mutateAsync({
        teamId,
        memberId,
        ...formData
      });
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={isEditModalOpen} onOpenChange={() => setEditModalOpen(false)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {updateMember.error && (
            <Alert variant="danger">
              <AlertIconContainer />
              <AlertDescription>
                {updateMember.error instanceof Error 
                  ? updateMember.error.message 
                  : "Failed to update member"}
              </AlertDescription>
            </Alert>
          )}

          <Input
            withLabel
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            data-size="base"
            required
          />

          <Input
            withLabel
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            data-size="base"
            required
          />

          <Input
            withLabel
            label="Job Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            data-size="base"
          />

          <Checkbox
            label="Admin Access"
            description="Grant admin privileges to this member"
            id="isAdmin"
            name="isAdmin"
            checked={formData.isAdmin}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, isAdmin: checked === true }))
            }
          />
        </div>

        <DialogFooter>
          <Button
            variant="neutral"
            volume="moderate"
            onClick={() => setEditModalOpen(false)}
            disabled={updateMember.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={updateMember.isPending}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};