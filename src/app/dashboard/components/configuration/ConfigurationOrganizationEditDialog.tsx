import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/core/Dialog";
import { Button } from "@/components/ui/core/Button";
import OrganizationConfig from "./ConfigurationOrganization";

interface OrganizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function OrganizationDialog({ isOpen, onClose }: OrganizationDialogProps) {
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
          <OrganizationConfig />
        </div>

        <DialogFooter data-slot="dialog-footer">
          <Button data-slot="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button data-slot="button" onClick={onClose}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default OrganizationDialog;
