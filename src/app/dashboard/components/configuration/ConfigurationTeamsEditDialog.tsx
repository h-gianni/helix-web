import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/core/Dialog";
import { Button } from "@/components/ui/core/Button";
import TeamSetup from "./ConfigurationTeams";
import { useConfigStore } from "@/store/config-store"; // Add this import

interface TeamsEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function TeamsEditDialog({ isOpen, onClose }: TeamsEditDialogProps) {
  // Add the store access to ensure data is persisted on close
  const updateTeams = useConfigStore(state => state.updateTeams);
  const teams = useConfigStore(state => state.config.teams);

  // Add a save handler to ensure changes are saved
  const handleSave = () => {
    // Nothing special needed here since teams are already synced
    // Just close the dialog
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="w-[96%] h-[96%] max-w-7xl p-0 m-auto rounded-md flex flex-col overflow-hidden">
        <DialogHeader className="p-6 border-b shrink-0">
          <DialogTitle>
            <div className="flex flex-col gap-2 w-full">
              <span className="heading-2">Edit Teams</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable content area that takes available height */}
        <div className="flex-1 px-6 pt-2 pb-6 overflow-y-auto">
          <TeamSetup />
        </div>

        {/* Fixed footer */}
        <DialogFooter className="relative p-6 border-t shrink-0">
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TeamsEditDialog;