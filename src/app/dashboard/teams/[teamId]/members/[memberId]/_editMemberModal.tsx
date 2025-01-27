'use client';

import { useState, useEffect } from 'react';
import {
 DialogWithConfig,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogDescription,
 DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Save, AlertCircle } from "lucide-react";
import type { ApiResponse } from "@/lib/types/api";

interface MemberDetails {
 id: string;
 firstName: string | null;
 lastName: string | null;
 title: string | null;
 isAdmin: boolean;
 user: {
   email: string;
   name: string | null;
 };
}

interface EditMemberModalProps {
 isOpen: boolean;
 onClose: () => void;
 memberId: string;
 teamId: string;
 onUpdate: () => Promise<void>;
}

export function EditMemberModal({ 
 isOpen, 
 onClose, 
 memberId, 
 teamId,
 onUpdate 
}: EditMemberModalProps) {
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [firstName, setFirstName] = useState('');
 const [lastName, setLastName] = useState('');
 const [title, setTitle] = useState('');
 const [originalData, setOriginalData] = useState<MemberDetails | null>(null);

 useEffect(() => {
   const fetchMemberDetails = async () => {
     if (!isOpen) return;
     
     try {
       setLoading(true);
       setError(null);
       const response = await fetch(`/api/teams/${teamId}/members/${memberId}`);
       const data: ApiResponse<MemberDetails> = await response.json();

       if (!data.success || !data.data) {
         throw new Error(data.error || 'Failed to fetch member details');
       }

       setOriginalData(data.data);
       setFirstName(data.data.firstName || '');
       setLastName(data.data.lastName || '');
       setTitle(data.data.title || '');
     } catch (err) {
       setError(err instanceof Error ? err.message : 'An error occurred');
     } finally {
       setLoading(false);
     }
   };

   fetchMemberDetails();
 }, [isOpen, memberId, teamId]);

 const hasChanges = () => {
   if (!originalData) return false;
   return (
     firstName !== (originalData.firstName || '') ||
     lastName !== (originalData.lastName || '') ||
     title !== (originalData.title || '')
   );
 };

 const handleSubmit = async () => {
   try {
     setSaving(true);
     setError(null);

     const response = await fetch(
       `/api/teams/${teamId}/members/${memberId}`,
       {
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           firstName: firstName.trim() || null,
           lastName: lastName.trim() || null,
           title: title.trim() || null,
         }),
       }
     );

     const data = await response.json();

     if (!response.ok || !data.success) {
       throw new Error(data.error || 'Failed to update member');
     }

     await onUpdate();
     onClose();
   } catch (err) {
     setError(err instanceof Error ? err.message : 'An error occurred');
   } finally {
     setSaving(false);
   }
 };

 const handleCancel = () => {
   if (hasChanges() && !confirm('You have unsaved changes. Are you sure you want to cancel?')) {
     return;
   }
   setError(null);
   onClose();
 };

 const footerConfig = {
   primaryAction: {
     label: 'Save Changes',
     onClick: handleSubmit,
     isLoading: saving,
     disabled: !hasChanges(),
     icon: <Save className="h-4 w-4" />
   },
   secondaryAction: {
     label: 'Cancel',
     onClick: handleCancel,
     disabled: saving
   }
 };

 if (loading) {
   return (
     <DialogContent size="base">
       <div className="py-8 text-center text-muted-foreground">
         Loading member details...
       </div>
     </DialogContent>
   );
 }

 return (
   <DialogWithConfig 
     open={isOpen}
     onOpenChange={handleCancel}
     size="base"
     title="Edit Member Details"
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
           value={firstName}
           onChange={(e) => setFirstName(e.target.value)}
           placeholder="Enter first name"
           inputSize="base"
           withLabel
           label="First Name"
         />

         <Input
           value={lastName}
           onChange={(e) => setLastName(e.target.value)}
           placeholder="Enter last name"
           inputSize="base"
           withLabel
           label="Last Name"
         />

         <Input
           value={title}
           onChange={(e) => setTitle(e.target.value)}
           placeholder="e.g., Senior Developer"
           inputSize="base"
           withLabel
           label="Job Title"
         />
       </div>
     </div>
   </DialogWithConfig>
 );
}