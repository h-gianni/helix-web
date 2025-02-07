// app/dashboard/teams/[teamId]/_teamEditModal.tsx
import { useState } from 'react';
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogDescription,
 DialogFooter,
 DialogWithConfig
} from "@/components/ui/core/Dialog";
import { Button } from "@/components/ui/core/Button";
import { Input } from "@/components/ui/core/Input";
import { Textarea } from "@/components/ui/core/Textarea";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { AlertCircle } from "lucide-react";

interface TeamEditModalProps {
 isOpen: boolean;
 onClose: () => void;
 teamName: string;
 teamDescription?: string | null;
 onSave: (name: string, description: string | null) => Promise<void>;
}

export default function TeamEditModal({
 isOpen,
 onClose,
 teamName,
 teamDescription,
 onSave,
}: TeamEditModalProps) {
 const [name, setName] = useState(teamName);
 const [description, setDescription] = useState(teamDescription || '');
 const [saving, setSaving] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const handleSubmit = async () => {
   try {
     setSaving(true);
     setError(null);
     await onSave(name.trim(), description.trim() || null);
     onClose();
   } catch (err) {
     setError(err instanceof Error ? err.message : 'An error occurred');
   } finally {
     setSaving(false);
   }
 };

 const handleClose = () => {
   if (name !== teamName || description !== (teamDescription || '')) {
     if (!confirm('You have unsaved changes. Are you sure you want to close?')) {
       return;
     }
   }
   onClose();
 };

 const footerConfig = {
   primaryAction: {
     label: 'Save Changes',
     onClick: handleSubmit,
     isLoading: saving,
   },
   secondaryAction: {
     label: 'Cancel',
     onClick: handleClose,
   }
 };

 return (
   <DialogWithConfig 
     open={isOpen} 
     onOpenChange={handleClose}
     title="Edit Team Details"
     footer="two-actions"
     footerConfig={footerConfig}
     size="base"
   >
     <div className="space-y-4">
       {error && (
         <Alert variant="danger">
           <AlertCircle className="h-4 w-4" />
           <AlertDescription>{error}</AlertDescription>
         </Alert>
       )}
       
       <Input
         value={name}
         onChange={(e) => setName(e.target.value)}
         placeholder="Enter team name"
         required
         data-size="base"
         withLabel
         label="Team Name"
       />
       
       <Textarea
         value={description}
         onChange={(e) => setDescription(e.target.value)}
         placeholder="Enter team description"
         rows={3}
         data-size="base"
         withLabel
         label="Description"
       />
     </div>
   </DialogWithConfig>
 );
}