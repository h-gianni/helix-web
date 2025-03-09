import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/core/Dialog";
import { Button } from "@/components/ui/core/Button";
import TeamSetup from "./_teams";

interface TeamsEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function TeamsEditDialog({ isOpen, onClose }: TeamsEditDialogProps) {
  return (
    <Dialog
      data-slot="dialog"
      open={isOpen}
      onOpenChange={onClose}
    >
      {/* 
        Removed `scrollable` and `DialogBody`. 
        Use `overflow-y-auto` or similar if you need scrolling. 
      */}
      <DialogContent
        data-slot="dialog-content"
        className="max-w-4xl h-[90vh] overflow-y-auto"
      >
        <DialogHeader data-slot="dialog-header" className="p-6 border-b">
          <DialogTitle data-slot="dialog-title">Edit Teams</DialogTitle>
        </DialogHeader>

        {/* Replace DialogBody with a simple div/section */}
        <div className="p-4">
          <TeamSetup />
        </div>

        <DialogFooter data-slot="dialog-footer" className="p-6 border-t">
          <div className="flex justify-end gap-2">
            <Button data-slot="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button data-slot="button" onClick={onClose}>
              Save changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TeamsEditDialog;
