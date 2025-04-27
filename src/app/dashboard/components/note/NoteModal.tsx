"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/core/Button";
import { ArrowLeft } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
} from "@/components/ui/core/Modal";
import {
  useNoteStore,
} from "@/store/note-store";
import { Loader } from "@/components/ui/core/Loader";
import { useToast } from "@/components/ui/core/Toast/use-toast";

// Import step components
import ScoringStepTeam from "@/app/dashboard/components/scoring/ScoringStepTeam";
import ScoringStepMember from "@/app/dashboard/components/scoring/ScoringStepMember";
import NoteStepInput from "@/app/dashboard/components/note/NoteStepInput";

interface NoteModalProps {
  teamId?: string;
  memberId?: string;
  memberName?: string;
  memberTitle?: string | null;
}

export default function NoteModal({
  teamId,
  memberId,
  memberName,
  memberTitle,
}: NoteModalProps) {
  const {
    isOpen,
    selectedTeamId,
    selectedMemberId,
    note,
    setIsOpen,
    setSelectedTeamId,
    setSelectedMemberId,
    setNote,
    reset,
  } = useNoteStore();

  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize with props when the modal opens
  useEffect(() => {
    if (isOpen) {
      if (teamId) {
        setSelectedTeamId(teamId);
        setCurrentStep(teamId && memberId ? 3 : 2);
      }
      if (memberId) {
        setSelectedMemberId(memberId);
        setCurrentStep(3);
      }

      // Determine total steps based on provided props
      if (teamId && memberId) {
        setTotalSteps(1); // Just note input step
      } else if (teamId) {
        setTotalSteps(2); // Member selection and note input
      } else {
        setTotalSteps(3); // All steps
      }
    }
  }, [isOpen, teamId, memberId, setSelectedTeamId, setSelectedMemberId]);

  // Reset steps when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
    }
  }, [isOpen]);

  // Simple simulation of note submission
  const handleSubmit = () => {
    // Immediately show loading state
    setIsSubmitting(true);
    
    // Simulate a short delay for loading effect
    setTimeout(() => {
      // Close the modal first
      setIsOpen(false);
      
      // Reset form state
      reset();
      setNote("");
      
      // Show success toast after modal is closed
      setTimeout(() => {
        toast({
          variant: "success",
          title: "Note Submitted",
          description: "Your note has been sent successfully!",
          duration: 3000,
        });
        
        // Reset submission state
        setIsSubmitting(false);
      }, 100);
    }, 500); // Simulate network delay
  };

  const handleReset = () => {
    reset();
    // Preserve initial values if they exist
    if (teamId) setSelectedTeamId(teamId);
    if (memberId) setSelectedMemberId(memberId);
    setCurrentStep(1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      setIsOpen(false);
    }
  };

  // Get title for current step
  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Select Team";
      case 2:
        return "Select Team Member";
      case 3:
        return "";
      default:
        return "Add note";
    }
  };

  return (
    <Modal 
      open={isOpen} 
      onOpenChange={(open) => {
        // Don't allow manual closing during "submission"
        if (isSubmitting && !open) return;
        
        // If closing, we can reset everything
        if (!open) {
          setNote("");
        }
        
        setIsOpen(open);
      }}
    >
      <ModalContent size="base" fixed={true}>
        <ModalHeader>
          <div className="flex items-center justify-between w-full absolute left-0 top-0 z-20 bg-white p-2 bg-white/50 rounded-t-xl">
            {currentStep > 1 ? (
              <Button 
                onClick={handleBack}
                variant="ghost"
                icon
                aria-label="Back"
                className=""
                disabled={isSubmitting}
              >
                <ArrowLeft />
              </Button>
            ) : (
              <div className="w-10"></div>
            )}
            
            <ModalTitle className="w-full text-center py-2">{getStepTitle()}</ModalTitle>
            
            <div className="w-10"></div> {/* Spacer for symmetry */}
          </div>
        </ModalHeader>

        <div className="mt-6 px-4 pb-6">
          {currentStep === 1 && (
            <ScoringStepTeam
              selectedTeamId={selectedTeamId}
              setSelectedTeamId={setSelectedTeamId}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <ScoringStepMember
              teamId={selectedTeamId || teamId || ""}
              selectedMemberId={selectedMemberId}
              setSelectedMemberId={setSelectedMemberId}
              memberName={memberName}
              memberTitle={memberTitle}
              onNext={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 3 && (
            <NoteStepInput
              teamId={selectedTeamId || teamId || ""}
              memberId={selectedMemberId || memberId || ""}
              note={note}
              setNote={setNote}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              error={null} // No error in prototype
            />
          )}

          {isSubmitting && currentStep !== 3 && (
            <div className="flex justify-center items-center mt-4">
              <Loader size="base" label="Processing..." />
            </div>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
}