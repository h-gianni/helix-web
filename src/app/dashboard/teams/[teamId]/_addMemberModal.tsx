"use client";

import React, { useState, useEffect } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { UserPlus } from "lucide-react";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/core/Select";

interface JobGrade {
 id: string;
 level: number;
 grade: string;
 typicalResponsibilities?: string | null;
}

interface AddMemberModalProps {
 isOpen: boolean;
 onClose: () => void;
 teamId?: string;
 onSubmit?: (data: {
   teamId: string;
   email: string;
   fullName: string;
   title?: string;
   jobGradeId?: string;
   joinedDate?: string;
   profilePhoto?: File;
 }) => Promise<void>;
}

export default function AddMemberModal({
 isOpen,
 onClose,
 teamId,
 onSubmit,
}: AddMemberModalProps) {
 const [email, setEmail] = useState("");
 const [fullName, setFullName] = useState("");
 const [title, setTitle] = useState("");
 const [jobGradeId, setJobGradeId] = useState("");
 const [joinedDate, setJoinedDate] = useState("");
 const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
 const [error, setError] = useState<string | null>(null);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [jobGrades, setJobGrades] = useState<JobGrade[]>([]);
 const [isLoadingGrades, setIsLoadingGrades] = useState(false);

 useEffect(() => {
   if (isOpen) {
     fetchJobGrades();
   }
 }, [isOpen]);

 const fetchJobGrades = async () => {
   try {
     setIsLoadingGrades(true);
     const response = await fetch('/api/job-grades');
     const data = await response.json();
     
     if (data.success) {
       setJobGrades(data.data);
     } else {
       console.error("Failed to fetch job grades:", data.error);
     }
   } catch (error) {
     console.error("Error fetching job grades:", error);
   } finally {
     setIsLoadingGrades(false);
   }
 };

 const handleSubmit = async () => {
   try {
     setIsSubmitting(true);
     setError(null);

     const trimmedEmail = email.trim();
     const trimmedFullName = fullName.trim();

     if (!trimmedEmail || !trimmedFullName) {
       throw new Error("Email and full name are required");
     }

     if (!teamId) {
       throw new Error("Team ID is required");
     }

     await onSubmit({
       teamId,
       email: trimmedEmail,
       fullName: trimmedFullName,
       title: title.trim() || undefined,
       jobGradeId: jobGradeId || undefined,
       joinedDate: joinedDate || undefined,
       profilePhoto: profilePhoto || undefined,
     });

     handleReset();
     onClose();
   } catch (err) {
     setError(err instanceof Error ? err.message : "An error occurred");
   } finally {
     setIsSubmitting(false);
   }
 };

 const handleReset = () => {
   setEmail("");
   setFullName("");
   setTitle("");
   setJobGradeId("");
   setJoinedDate("");
   setProfilePhoto(null);
   setError(null);
 };

 const footerConfig = {
   primaryAction: {
     label: 'Add Member',
     onClick: handleSubmit,
     isLoading: isSubmitting,
   },
   secondaryAction: {
     label: 'Cancel',
     onClick: () => {
       handleReset();
       onClose();
     },
   }
 };

 return (
   <DialogWithConfig
     open={isOpen}
     onOpenChange={onClose}
     title="Add Team Member"
     size="base"
     footer="two-actions"
     footerConfig={footerConfig}
   >
     <div className="space-y-4">
       {error && (
         <Alert variant="danger">
           <AlertDescription>{error}</AlertDescription>
         </Alert>
       )}

       <Input
         type="email"
         value={email}
         onChange={(e) => setEmail(e.target.value)}
         placeholder="member@example.com"
         data-size="base"
         withLabel
         label="Company Email*"
         required
       />

       <Input
         type="text"
         value={fullName}
         onChange={(e) => setFullName(e.target.value)}
         placeholder="John Doe"
         data-size="base"
         withLabel
         label="Full Name*"
         required
       />

       <Input
         type="text"
         value={title}
         onChange={(e) => setTitle(e.target.value)}
         placeholder="e.g., Developer"
         data-size="base"
         withLabel
         label="Job Title"
       />

       <Select
         value={jobGradeId}
         onValueChange={setJobGradeId}
         withLabel
         label="Job Grade"
         width="full"
       >
         <SelectTrigger>
           <SelectValue placeholder="Select job grade" />
         </SelectTrigger>
         <SelectContent>
           {jobGrades.map((grade) => (
             <SelectItem key={grade.id} value={grade.id}>
               {`${grade.level} / ${grade.grade}`}
             </SelectItem>
           ))}
         </SelectContent>
       </Select>

       <Input
         type="date"
         value={joinedDate}
         onChange={(e) => setJoinedDate(e.target.value)}
         data-size="base"
         withLabel
         label="Joined Date"
       />

       <Input
         type="file"
         onChange={(e) => {
           if (e.target.files?.[0]) {
             setProfilePhoto(e.target.files[0]);
           }
         }}
         data-size="base"
         withLabel
         label="Profile Photo"
         accept="image/*"
       />
     </div>
   </DialogWithConfig>
 );
}