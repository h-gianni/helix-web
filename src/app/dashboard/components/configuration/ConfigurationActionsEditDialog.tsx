import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/core/Dialog";
import { Button } from "@/components/ui/core/Button";
import ActionsConfig from './ConfigurationActions';
import { useConfigStore } from "@/store/config-store";
import { useProfileStore } from "@/store/user-store";

interface ActionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function ActionsDialog({
  isOpen,
  onClose,
}: ActionsDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // Get organization name from config store or profile
  const configOrgName = useConfigStore(state => state.config.organization.name);
  const { profile } = useProfileStore();
  
  // Determine organization name to display
  const orgName = configOrgName || 
    (profile?.orgName && profile.orgName.length > 0 ? profile.orgName[0]?.name : "Organization");

    
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[96%] h-[96%] max-w-7xl p-0 m-auto rounded-md flex flex-col overflow-hidden">
        <DialogHeader className="p-6 border-b shrink-0">
          <DialogTitle>
            <div className="flex flex-col gap-2 w-full">
              <span className="heading-2">Edit {orgName} Actions</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        {/* Scrollable content area that takes available height */}
        <div className="flex-1 px-6 pt-2 pb-6 overflow-y-auto">
          <ActionsConfig 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
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
            <Button onClick={onClose}>
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ActionsDialog;