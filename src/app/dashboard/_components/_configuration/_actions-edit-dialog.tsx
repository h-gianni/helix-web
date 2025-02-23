import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/core/Dialog";
import ActionsConfig from './_actions';

interface ActionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ActionsDialog: React.FC<ActionsDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("engineering");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Organization Actions</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <ActionsConfig 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActionsDialog;