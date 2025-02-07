import { useState } from "react";
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
import type { ApiResponse } from "@/lib/types/api";

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  teamId: string;
  onUpdate: () => void;
}

interface MemberUpdateData {
  firstName: string;
  lastName: string;
  title: string;
  isAdmin: boolean;
}

export const EditMemberModal = ({
  isOpen,
  onClose,
  memberId,
  teamId,
  onUpdate,
}: EditMemberModalProps) => {
  const [formData, setFormData] = useState<MemberUpdateData>({
    firstName: "",
    lastName: "",
    title: "",
    isAdmin: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current member data when modal opens
  const fetchMemberData = async () => {
    try {
      const response = await fetch(`/api/teams/${teamId}/members/${memberId}`);
      const data: ApiResponse<any> = await response.json();

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
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/teams/${teamId}/members/${memberId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: ApiResponse<any> = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to update member");
      }

      onUpdate();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && (
            <Alert variant="danger">
              <AlertIconContainer />
              <AlertDescription>{error}</AlertDescription>
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
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={loading}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};