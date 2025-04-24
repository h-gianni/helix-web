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
  useFeedbackStore,
  useSubmitFeedback,
} from "@/store/feedback-store";

// Import step components
import ScoringStepTeam from "@/app/dashboard/components/scoring/ScoringStepTeam";
import ScoringStepMember from "@/app/dashboard/components/scoring/ScoringStepMember";
import FeedbackStepInput from "@/app/dashboard/components/feedback/FeedbackStepInput";

interface FeedbackModalProps {
  teamId?: string;
  memberId?: string;
  memberName?: string;
  memberTitle?: string | null;
}

export default function FeedbackModal({
  teamId,
  memberId,
  memberName,
  memberTitle,
}: FeedbackModalProps) {
  const {
    isOpen,
    selectedTeamId,
    selectedMemberId,
    feedback,
    setIsOpen,
    setSelectedTeamId,
    setSelectedMemberId,
    setFeedback,
    reset,
  } = useFeedbackStore();

  const submitFeedback = useSubmitFeedback();
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(3);

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
        setTotalSteps(1); // Just feedback input step
      } else if (teamId) {
        setTotalSteps(2); // Member selection and feedback input
      } else {
        setTotalSteps(3); // All steps
      }
    }
  }, [isOpen, teamId, memberId, setSelectedTeamId, setSelectedMemberId]);

  // Reset steps when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      // Don't reset selected values to allow returning to previous selections
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    const currentTeamId = selectedTeamId || teamId || "";
    const currentMemberId = selectedMemberId || memberId || "";

    if (
      !currentTeamId ||
      !currentMemberId ||
      !feedback.trim()
    )
      return;

    try {
      await submitFeedback.mutateAsync({
        teamId: currentTeamId,
        memberId: currentMemberId,
        feedback,
      });

      handleReset();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
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
        return "Add Feedback";
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
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
            <FeedbackStepInput
              teamId={selectedTeamId || teamId || ""}
              memberId={selectedMemberId || memberId || ""}
              feedback={feedback}
              setFeedback={setFeedback}
              onSubmit={handleSubmit}
              isSubmitting={submitFeedback.isPending}
              error={submitFeedback.error}
            />
          )}
        </div>
      </ModalContent>
    </Modal>
  );
}