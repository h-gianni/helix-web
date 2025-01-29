import { useState, useEffect } from 'react';
import { DialogWithConfig } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Save, AlertCircle } from "lucide-react";
import type { BusinessActivityResponse as InitiativeResponse } from "@/lib/types/api";

interface InitiativeModalProps {
 isOpen: boolean;
 onClose: () => void;
 initiative?: InitiativeResponse | null;
 onUpdate: () => Promise<void>;
}

export function InitiativeModal({ 
 isOpen, 
 onClose, 
 initiative,
 onUpdate 
}: InitiativeModalProps) {
 const [name, setName] = useState('');
 const [description, setDescription] = useState('');
 const [error, setError] = useState<string | null>(null);
 const [saving, setSaving] = useState(false);

 useEffect(() => {
   if (initiative) {
     setName(initiative.name);
     setDescription(initiative.description || '');
   } else {
     setName('');
     setDescription('');
   }
   setError(null);
 }, [initiative, isOpen]);

 const handleSubmit = async () => {
   try {
     setSaving(true);
     setError(null);

     const method = initiative ? 'PATCH' : 'POST';
     const url = initiative
       ? `/api/initiatives/${initiative.id}`
       : '/api/initiatives';

     const response = await fetch(url, {
       method,
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         name: name.trim(),
         description: description.trim() || null,
       }),
     });

     const data = await response.json();

     if (!data.success) {
       throw new Error(data.error || 'Failed to save initiative');
     }

     await onUpdate();
     onClose();
   } catch (err) {
     setError(err instanceof Error ? err.message : 'An error occurred');
   } finally {
     setSaving(false);
   }
 };

 const hasChanges = () => {
   if (!initiative) return name.trim() !== '' || description.trim() !== '';
   return (
     name !== initiative.name ||
     description !== (initiative.description || '')
   );
 };

 const handleClose = () => {
   if (hasChanges() && !confirm('You have unsaved changes. Are you sure you want to close?')) {
     return;
   }
   onClose();
 };

 const footerConfig = {
   primaryAction: {
     label: 'Save Initiative',
     onClick: handleSubmit,
     isLoading: saving,
     disabled: saving || !hasChanges() || !name.trim(),
   },
   secondaryAction: {
     label: 'Cancel',
     onClick: handleClose,
     disabled: saving
   }
 };

 return (
   <DialogWithConfig
     open={isOpen} 
     onOpenChange={handleClose}
     title={initiative ? 'Edit Initiative' : 'Create Initiative'}
     size="base"
     footer="two-actions"
     footerConfig={footerConfig}
   >
     <div className="space-y-6">
       {error && (
         <Alert variant="danger">
           <AlertCircle className="h-4 w-4" />
           <AlertDescription>{error}</AlertDescription>
         </Alert>
       )}
       
       <div className="space-y-4">
         <Input
           value={name}
           onChange={(e) => setName(e.target.value)}
           placeholder="Enter initiative name"
           required
           inputSize="base"
           withLabel
           label="Name"
         />

         <Textarea
           value={description}
           onChange={(e) => setDescription(e.target.value)}
           placeholder="Enter initiative description"
           rows={3}
           inputSize="base"
           withLabel
           label="Description"
         />
       </div>
     </div>
   </DialogWithConfig>
 );
}