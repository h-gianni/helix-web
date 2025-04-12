// app/dashboard/onboarding/organisation/page.tsx

"use client";

import React, { useState } from "react";
import PageNavigator from "../components/PageNavigator";
import { Input } from "@/components/ui/core/Input";
import { Label } from "@/components/ui/core/Label";
import { useConfigStore } from "@/store/config-store";
import { cn } from "@/lib/utils"

export default function OrganisationPage() {
  // Get organization data from store
  const orgConfig = useConfigStore((state) => state.config.organization);
  const updateOrganization = useConfigStore(state => state.updateOrganization);
  
  // Local state
  const [name, setName] = useState(orgConfig.name || "");
  const [showError, setShowError] = useState(false);
  
  // Validation function
  const isValid = () => Boolean(name.trim());
  
  // Handle name change
  const handleNameChange = (value: string) => {
    setName(value);
    updateOrganization(value.trim());
  };

  // Listen for Next button click
  const handleNextAttempt = () => {
    if (!isValid()) {
      setShowError(true);
    }
  };

  return (
    <div>
      <PageNavigator
        title="Let's set up your organisation"
        description={
          <>
            First, let's get to know your organisation. This information will help
            us customize your experience and make it relevant to your needs.
          </>
        }
        previousHref="/dashboard/onboarding/intro"
        nextHref="/dashboard/onboarding/global-actions"
        canContinue={isValid()}
        currentStep={1}
        totalSteps={6}
        disabledTooltip="Please enter your organisation name to continue"
        onValidationAttempt={handleNextAttempt}
      />

      <div className="max-w-sm mx-auto space-y-4">
        <div className="space-y-2">
          <Label htmlFor="org-name">
            Organisation Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="org-name"
            inputSize="xl"
            value={name}
            onChange={(e) => {
              handleNameChange(e.target.value);
              // Clear error state when user starts typing after an error
              if (showError) setShowError(false);
            }}
            placeholder="Enter your organisation name"
            className={cn(
              "bg-white/30 backdrop-blur-lg shadow-sm",
              showError && !isValid() && "border-destructive"
            )}
            aria-invalid={showError && !isValid()}
            aria-describedby={showError && !isValid() ? "org-name-error" : undefined}
            required
            autoFocus
          />
          {showError && !isValid() && (
            <p id="org-name-error" className="text-sm text-destructive">
              Organisation name is required
            </p>
          )}
        </div>
        <p className="text-sm text-foreground-weak">
          This name will be displayed throughout the application.
        </p>
      </div>
    </div>
  );
}