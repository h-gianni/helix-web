import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/core/Dialog";
import { Button } from "@/components/ui/core/Button";
import { Input } from "@/components/ui/core/Input";
import { Label } from "@/components/ui/core/Label";
import { Alert } from "@/components/ui/core/Alert";
import { AlertCircle } from "lucide-react";
import { useProfile, useUpdateOrgName } from "@/store/user-store";
import { useConfigStore } from "@/store/config-store";

interface OrganizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function OrganizationDialog({ isOpen, onClose }: OrganizationDialogProps) {
  // Get profile data
  const { data: profileData } = useProfile();
  
  // Get initial organization name
  const initialOrgName = profileData?.organization?.name || '';
  
  // Local state for the form
  const [orgName, setOrgName] = useState(initialOrgName);
  
  // Mutation hook for updating
  const updateOrgName = useUpdateOrgName();
  
  // For config store support
  const updateOrganization = useConfigStore(state => state.updateOrganization);

  // Reset form when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setOrgName(initialOrgName);
    }
  }, [isOpen, initialOrgName]);

  const handleSubmit = async () => {
    try {
      // Update in the API
      await updateOrgName.mutateAsync(orgName.trim());
      
      // Also update in config store for local state
      updateOrganization(orgName.trim());
      
      onClose();
    } catch (error) {
      console.error("Error updating organization name:", error);
    }
  };

  return (
    <Dialog
      data-slot="dialog"
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent data-slot="dialog-content">
        <DialogHeader data-slot="dialog-header">
          <DialogTitle data-slot="dialog-title">Edit Organization</DialogTitle>
        </DialogHeader>

        {/* Dialog content directly inside DialogContent */}
        <div data-slot="dialog-body" className="p-4">
          <div className="space-y-4">
            {updateOrgName.error && (
              <Alert data-slot="alert" variant="destructive">
                <AlertCircle className="size-4" />
                <p className="text-sm">
                  {updateOrgName.error instanceof Error 
                    ? updateOrgName.error.message 
                    : "Failed to update organization name"}
                </p>
              </Alert>
            )}
            
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label data-slot="label" htmlFor="org-name">
                Organisation name
              </Label>
              <Input
                data-slot="input"
                type="text"
                id="org-name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Enter organisation name"
              />
            </div>
          </div>
        </div>

        <DialogFooter data-slot="dialog-footer">
          <Button data-slot="button" variant="outline" onClick={onClose} disabled={updateOrgName.isPending}>
            Cancel
          </Button>
          <Button 
            data-slot="button" 
            onClick={handleSubmit} 
            disabled={updateOrgName.isPending || !orgName.trim() || orgName.trim() === initialOrgName}
          >
            {updateOrgName.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default OrganizationDialog;