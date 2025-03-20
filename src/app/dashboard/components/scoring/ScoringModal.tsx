"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/core/Button";
import { ChevronLeft, ArrowLeft, ArrowRight, Tally5 } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/core/Modal";
import {
  usePerformanceRatingStore,
  useSubmitRating,
} from "@/store/performance-rating-store";
import StarRating from "@/components/ui/core/StarRating";

import ScoringStepTeam from "@/app/dashboard/components/scoring/ScoringStepTeam";
import ScoringStepMember from "@/app/dashboard/components/scoring/ScoringStepMember";
import ScoringStepActions from "@/app/dashboard/components/scoring/ScoringStepActions";
import ScoringStepStars from "@/app/dashboard/components/scoring/ScoringStepStars";

interface PerformanceRatingModalProps {
  teamId?: string;
  memberId?: string;
  memberName?: string;
  memberTitle?: string | null;
}

export default function PerformanceScoringModal({
  teamId,
  memberId,
  memberName,
  memberTitle,
}: PerformanceRatingModalProps) {
  const {
    isOpen,
    selectedTeamId,
    selectedMemberId,
    selectedActivityId,
    rating,
    feedback,
    setIsOpen,
    setSelectedTeamId,
    setSelectedMemberId,
    setSelectedActivityId,
    setRating,
    setFeedback,
    reset,
  } = usePerformanceRatingStore();

  const submitRating = useSubmitRating();
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(4);

  // Initialize with props when the modal opens
  useEffect(() => {
    if (isOpen) {
      if (teamId) {
        setSelectedTeamId(teamId);
        setCurrentStep(teamId && !memberId ? 2 : 1);
      }
      if (memberId) {
        setSelectedMemberId(memberId);
        setCurrentStep(3);
      }

      // Determine total steps based on provided props
      if (teamId && memberId) {
        setTotalSteps(2); // Just activity selection and rating steps
      } else if (teamId) {
        setTotalSteps(3); // Member selection, activity, and rating
      } else {
        setTotalSteps(4); // All steps
      }
    }
  }, [isOpen, teamId, memberId, setSelectedTeamId, setSelectedMemberId]);

  // Reset steps when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    const currentTeamId = selectedTeamId || teamId;
    const currentMemberId = selectedMemberId || memberId;

    if (
      !currentTeamId ||
      !currentMemberId ||
      !selectedActivityId ||
      rating === 0
    )
      return;

    try {
      await submitRating.mutateAsync({
        teamId: currentTeamId,
        memberId: currentMemberId,
        activityId: selectedActivityId,
        rating,
        feedback: feedback.trim() || undefined,
      });

      handleReset();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to submit rating:", error);
    }
  };

  const handleReset = () => {
    reset();
    // Preserve initial values if they exist
    if (teamId) setSelectedTeamId(teamId);
    if (memberId) setSelectedMemberId(memberId);
    setCurrentStep(1);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      setIsOpen(false);
    }
  };

  // Check if next button should be disabled
  const isNextDisabled = () => {
    switch (currentStep) {
      case 1: // Team selection
        return !selectedTeamId;
      case 2: // Member selection
        return !selectedMemberId;
      case 3: // Activity selection
        return !selectedActivityId;
      case 4: // Rating
        return rating === 0;
      default:
        return false;
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
        return "Select Action";
      case 4:
        return "Score Performance";
      default:
        return "Score Performance";
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalContent size="base" fixed={true}>
        <ModalHeader>
          <div className="flex items-center">
            <div className="flex flex-col space-y-1 items-center justify-center mx-auto pt-4 lg:pb-4">
              <ModalDescription>
                Step {currentStep} of {totalSteps}
              </ModalDescription>
              <ModalTitle>{getStepTitle()}</ModalTitle>
            </div>
          </div>
        </ModalHeader>

        <div className="px-2 lg:px-6 pb-24">
          {currentStep === 1 && !teamId && (
            <ScoringStepTeam
              selectedTeamId={selectedTeamId}
              setSelectedTeamId={setSelectedTeamId}
            />
          )}

          {currentStep === 2 && (
            <ScoringStepMember
              teamId={selectedTeamId || teamId || ""}
              selectedMemberId={selectedMemberId}
              setSelectedMemberId={setSelectedMemberId}
              memberName={memberName}
              memberTitle={memberTitle}
            />
          )}

          {currentStep === 3 && (
            <ScoringStepActions
              teamId={selectedTeamId || teamId || ""}
              selectedActivityId={selectedActivityId}
              setSelectedActivityId={setSelectedActivityId}
            />
          )}

          {currentStep === 4 && (
            <ScoringStepStars
              teamId={selectedTeamId || teamId || ""}
              memberId={selectedMemberId || memberId || ""}
              activityId={selectedActivityId || ""}
              feedback={feedback}
              setFeedback={setFeedback}
              isSubmitting={submitRating.isPending}
              error={submitRating.error}
              onChangeStep={setCurrentStep}
            />
          )}
        </div>

        <ModalFooter className="flex flex-col">
          {currentStep === 4 && (
            <div className="px-4 pt-6 w-full text-center border-t">
              <div className="heading-4 mb-2">What's your score?</div>
              <div className="flex justify-center">
                <StarRating
                  value={rating}
                  onChange={setRating}
                  size="xl"
                  showValue
                  disabled={submitRating.isPending}
                />
              </div>
            </div>
          )}

          <div className="flex gap-4 w-full p-4 lg:p-6">
            <Button
              variant="secondary"
              size="xl"
              className="w-full"
              onClick={handleBack}
              disabled={submitRating.isPending}
              type="button"
            >
              {currentStep === 1 ? (
                "Cancel"
              ) : (
                <>
                  <ArrowLeft />
                  Back
                </>
              )}
            </Button>
            <Button
              variant={currentStep === totalSteps ? "accent" : "default"}
              size="xl"
              className="w-full"
              onClick={handleNext}
              disabled={isNextDisabled() || submitRating.isPending}
            >
              {currentStep === totalSteps ? (
                submitRating.isPending ? (
                  "Saving..."
                ) : (
                  <>Save Score</>
                )
              ) : (
                <>
                  Next
                  <ArrowRight />
                </>
              )}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}