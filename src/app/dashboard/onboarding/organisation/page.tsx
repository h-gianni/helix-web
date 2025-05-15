"use client";

import React, { useState } from "react";
import PageNavigator from "../components/PageNavigator";
import { Input } from "@/components/ui/core/Input";
import { Label } from "@/components/ui/core/Label";
import { useConfigStore, useUpdateOrganization } from "@/store/config-store";
import { cn } from "@/lib/utils";

export default function OrganisationPage() {
  // Get organization data from store
  const orgConfig = useConfigStore((state) => state.config.organization);
  const updateOrganization = useConfigStore((state) => state.updateOrganization);
  const { mutate: updateOrgInDb, isPending: isLoading } = useUpdateOrganization();

  // Local state
  const [name, setName] = useState(orgConfig.name || "");
  const [siteDomain, setSiteDomain] = useState(orgConfig.siteDomain || "");
  const [showError, setShowError] = useState(false);

  // Validation function
  const isValid = () => Boolean(name.trim() && siteDomain.trim());

  // Handle name change
  const handleNameChange = (value: string) => {
    const trimmedValue = value.trim();
    setName(value);
    updateOrganization({
      ...orgConfig,
      name: trimmedValue,
      siteDomain: orgConfig.siteDomain,
    });
  };

  // Handle domain change
  const handleDomainChange = (value: string) => {
    const trimmedValue = value.trim();
    setSiteDomain(value);
    updateOrganization({
      ...orgConfig,
      siteDomain: trimmedValue,
      name: orgConfig.name,
    });
  };

  // Listen for Next button click
  const handleNextAttempt = async () => {
    if (!isValid()) {
      setShowError(true);
      return false;
    }

    try {
      // Update in database only when clicking Next
      await updateOrgInDb({
        name: name.trim(),
        siteDomain: siteDomain.trim(),
      });
      return true;
    } catch (error) {
      console.error("Error updating organization:", error);
      return false;
    }
  };

  return (
    <div>
      <PageNavigator
        title="Let's set up your organisation"
        description={
          <>
            First, let&apos;s get to know your organisation. This information
            will help us customize your experience and make it relevant to your
            needs.
          </>
        }
        previousHref="/dashboard/onboarding/intro"
        nextHref="/dashboard/onboarding/global-actions"
        canContinue={isValid()}
        currentStep={1}
        totalSteps={6}
        disabledTooltip="Please enter your organisation name and domain to continue"
        onValidationAttempt={handleNextAttempt}
        isLoading={isLoading}
      />

      <div className="max-w-sm mx-auto space-y-4">
        <div className="space-y-2">
          <Label htmlFor="org-name">
            Organisation Name <span className="text-primary">*</span>
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
              showError && !name.trim() && "border-destructive"
            )}
            aria-invalid={showError && !name.trim()}
            aria-describedby={
              showError && !name.trim() ? "org-name-error" : undefined
            }
            required
            autoFocus
            disabled={isLoading}
          />
          {showError && !name.trim() && (
            <p id="org-name-error" className="text-sm text-destructive">
              Organisation name is required
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="org-domain">
            Organisation Domain <span className="text-destructive">*</span>
          </Label>
          <Input
            id="org-domain"
            inputSize="xl"
            value={siteDomain}
            onChange={(e) => {
              handleDomainChange(e.target.value);
              // Clear error state when user starts typing after an error
              if (showError) setShowError(false);
            }}
            placeholder="Enter your organisation domain (e.g., example.com)"
            className={cn(
              "bg-white/30 backdrop-blur-lg shadow-sm",
              showError && !siteDomain.trim() && "border-destructive"
            )}
            aria-invalid={showError && !siteDomain.trim()}
            aria-describedby={
              showError && !siteDomain.trim()
                ? "ositeDg-domain-error"
                : undefined
            }
            required
            disabled={isLoading}
          />
          {showError && !siteDomain.trim() && (
            <p id="org-domain-error" className="text-sm text-destructive">
              Organisation domain is required
            </p>
          )}
        </div>

        <p className="text-sm text-foreground-weak">
          This information will be displayed throughout the application.
        </p>
      </div>
    </div>
  );
}
