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
  usePerformanceRatingStore,
  useSubmitRating,
} from "@/store/performance-rating-store";
import StarRating from "@/components/ui/core/StarRating";
import { Loader } from "@/components/ui/core/Loader";
import { useToast } from "@/components/ui/core/Toast";

// Import the updated step components
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

  const { toast } = useToast();
  const submitRating = useSubmitRating();
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(4);

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
        setTotalSteps(2); // Just activity selection and rating steps
      } else if (teamId) {
        setTotalSteps(3); // Member selection, activity, and rating
      } else {
        setTotalSteps(4); // All steps
      }
      
      // Initialize with 1 star if no rating is set
      if (rating === 0) {
        setRating(1);
      }
    }
  }, [isOpen, teamId, memberId, setSelectedTeamId, setSelectedMemberId, rating, setRating]);

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

      // Close the modal first
      setIsOpen(false);
      
      // Reset form state
      handleReset();
      
      // Show success toast after modal is closed
      setTimeout(() => {
        toast({
          variant: "success",
          title: "Score Submitted",
          description: "Your performance rating has been recorded successfully!",
          duration: 3000,
        });
      }, 100);
    } catch (error) {
      console.error("Failed to submit rating:", error);
      
      // Show error toast
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was a problem submitting your score. Please try again.",
        duration: 5000,
      });
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
        return "Select Action";
      case 4:
        return "";
      default:
        return "Score Performance";
    }
  };

  return (
    <Modal 
      open={isOpen} 
      onOpenChange={(open) => {
        // Don't allow manual closing during submission
        if (submitRating.isPending && !open) return;
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
                disabled={submitRating.isPending}
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
            <ScoringStepActions
              teamId={selectedTeamId || teamId || ""}
              selectedActivityId={selectedActivityId}
              setSelectedActivityId={setSelectedActivityId}
              onNext={() => setCurrentStep(4)}
            />
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
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
              
              <div className="max-w-lg mx-auto w-full text-center">
                <div className="heading-4 mb-2">Your Score</div>
                <div className="flex justify-center mb-8">
                  <StarRating
                    value={rating}
                    onChange={setRating}
                    size="xl"
                    showValue
                    disabled={submitRating.isPending}
                    activeScore={true} // Using the new prop for the scoring interface
                  />
                </div>
                
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={rating === 0 || submitRating.isPending}
                >
                  {submitRating.isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader />
                      <span>Saving...</span>
                    </span>
                  ) : (
                    "Submit Score"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
}