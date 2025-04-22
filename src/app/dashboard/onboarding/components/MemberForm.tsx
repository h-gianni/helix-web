import React from "react";
import { Button } from "@/components/ui/core/Button";
import { Plus, Save, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/core/Input";
import { Label } from "@/components/ui/core/Label";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";

interface MemberFormProps {
  fullName: string;
  email: string;
  formErrors: {
    fullName?: string;
    email?: string;
  };
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddMember: () => void;
  onCancelEdit: () => void;
}

export default function MemberForm({
  fullName,
  email,
  formErrors,
  isEditing,
  onInputChange,
  onAddMember,
  onCancelEdit,
}: MemberFormProps) {
  return (
    <div>
      <div className="p-8 space-y-4">
        <h3 className="heading-3">
          {isEditing ? "Edit Member" : "Add New Member"}
        </h3>
        
        {/* {(formErrors.fullName || formErrors.email) && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>
              {formErrors.fullName || formErrors.email}
            </AlertDescription>
          </Alert>
        )} */}
        
        <div className="flex flex-col gap-3 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">
              Full Name <span className="text-primary">*</span>
            </Label>
            <Input
              id="fullName"
              name="fullName"
              value={fullName}
              inputSize="xl"
              onChange={onInputChange}
              placeholder="Enter full name"
              className={formErrors.fullName ? "border-destructive" : ""}
            />
            {formErrors.fullName && (
              <p className="text-destructive text-xs mt-1">
                {formErrors.fullName}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">
              Email <span className="text-primary">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              inputSize="xl"
              value={email}
              onChange={onInputChange}
              placeholder="Enter email address"
              className={formErrors.email ? "border-destructive" : ""}
            />
            {formErrors.email && (
              <p className="text-destructive text-xs mt-1">
                {formErrors.email}
              </p>
            )}
          </div>
        </div>
        
        <div className="pt-4 flex flex-row-reverse gap-3">
          {isEditing ? (
            <>
              <Button
                variant="primary"
                onClick={onAddMember}
                size="xl"
              >
                Update Member
              </Button>
              <Button variant="default" onClick={onCancelEdit} size="xl" className="w-full">
                Cancel Edit
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              onClick={onAddMember}
              size="xl"
              className="gap-2 w-full"
            >
              <Plus className="size-4" /> Add Member
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}