// app/dashboard/onboarding/components/PageNavigator.tsx

"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, AlertCircle, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { Badge } from "@/components/ui/core/Badge";

interface PageNavigatorProps {
  title: string;
  description: React.ReactNode;
  previousHref: string;
  nextHref: string;
  canContinue?: boolean;
  className?: string;
  currentStep?: number;
  totalSteps?: number;
  isLastStep?: boolean;
  disabledTooltip?: string;
  onValidationAttempt?: () => void; // New prop for handling validation attempts
}

export default function PageNavigator({
  title,
  description,
  previousHref,
  nextHref,
  canContinue = true,
  className = "",
  currentStep,
  totalSteps,
  isLastStep = false,
  disabledTooltip = "Please complete all required fields to continue",
  onValidationAttempt, // New prop
}: PageNavigatorProps) {
  const router = useRouter();
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const handleNextClick = useCallback(() => {
    if (canContinue) {
      router.push(nextHref);
    } else {
      // Show error alert
      setShowErrorAlert(true);

      // Notify the parent component about the validation attempt
      if (onValidationAttempt) {
        onValidationAttempt();
      }
    }
  }, [canContinue, nextHref, router, onValidationAttempt]);

  return (
    <div>
      <div className={`grid grid-cols-5 gap-8 ${className}`}>
        {/* Previous button - only show if not first step */}
        {currentStep === 1 ? (
          <div className="w-[25%]"></div> // Empty spacer to maintain layout
        ) : (
          <button
            className="flex flex-col justify-center items-center bg-white p-16 rounded-br-xl cursor-pointer hover:bg-neutral-lightest"
            onClick={() => router.push(previousHref)}
            aria-label="Go to previous step"
          >
            <div className="flex gap-2 items-center font-semibold">
              <ArrowLeft className="size-7 mr-1" />{" "}
              <span className="heading-3">Previous</span>
            </div>
          </button>
        )}

        {/* Title and description */}
        <div className="col-span-3 flex flex-col text-center items-center space-y-2 py-12">
          {/* {currentStep !== undefined && totalSteps !== undefined && (
              <Badge variant="secondary" className="mb-4">
              Step {currentStep} of {totalSteps}
              </Badge>
          )} */}
          {/* <div className="flex-shrink-0 mx-auto">
            <div className="flex size-12 items-center justify-center rounded-full bg-neutral-lightest">
              <User className="size-6 text-primary" />
            </div>
          </div> */}
          <h1 className="heading-1">{title}</h1>
          <p className="body-base text-foreground-weak">{description}</p>
        </div>

        {/* Next button - only show if not last step */}
        {isLastStep ? (
          <div></div> // Empty spacer to maintain layout
        ) : (
          <button
            className="flex flex-col justify-center items-center bg-white p-16 rounded-bl-xl cursor-pointer hover:bg-neutral-lightest"
            onClick={handleNextClick}
            aria-label="Go to next step"
          >
            <div className="flex items-center gap-2 text-primary font-semibold">
              <span className="heading-3 !text-primary">Next</span>{" "}
              <ArrowRight className="size-7 ml-1" />
            </div>
          </button>
        )}
      </div>
      {/* Show error alert if validation fails */}
      <div className="pb-4">
      {showErrorAlert && !canContinue && (
        <Alert
          variant="destructive"
          className="w-min whitespace-nowrap mx-auto"
        >
          <AlertCircle className="size-4" />
          <AlertDescription>{disabledTooltip}</AlertDescription>
        </Alert>
      )}
      </div>
    </div>
  );
}
