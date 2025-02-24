import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/core/Dialog";
import { Button } from "@/components/ui/core/Button";
import TeamSetup from './_teams';

interface TeamsEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const TeamsEditDialog: React.FC<TeamsEditDialogProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh]" scrollable>
        <DialogHeader className="p-6 border-b">
          <DialogTitle>Edit Teams</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <TeamSetup />
        </DialogBody>
        <DialogFooter className="p-6 border-t">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onClose}>Save changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeamsEditDialog;