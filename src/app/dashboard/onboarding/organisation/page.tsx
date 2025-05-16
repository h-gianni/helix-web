"use client";

import React, { useEffect, useState } from "react";
import PageNavigator from "../components/PageNavigator";
import { Input } from "@/components/ui/core/Input";
import { useConfigStore, useUpdateOrganization, useOrganizationData } from "@/store/config-store";
import { useRouter } from "next/navigation";

export default function OrganizationPage() {
  const router = useRouter();
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: updateOrgInDb } = useUpdateOrganization();
  const orgConfig = useConfigStore((state) => state.config.organization);
  const updateOrganization = useConfigStore((state) => state.updateOrganization);

  // Fetch organization data using the hook from config store
  const { data: orgData, isLoading: isLoadingOrg } = useOrganizationData();

  // Local state for inputs
  const [name, setName] = useState("");
  const [siteDomain, setSiteDomain] = useState("");

  // Update local state when org data is loaded
  useEffect(() => {
    if (orgData) {
      setName(orgData.name || "");
      setSiteDomain(orgData.siteDomain || "");
    }
  }, [orgData]);

  // Validation function
  const isValid = () => {
    return name.trim() !== "" && siteDomain.trim() !== "";
  };

  // Handle input changes (only update local state)
  const handleNameChange = (value: string) => {
    setName(value);
    if (showError) setShowError(false);
  };

  const handleDomainChange = (value: string) => {
    setSiteDomain(value);
    if (showError) setShowError(false);
  };

  // Handle Next button click
  const handleNextAttempt = async () => {
    if (!isValid()) {
      setShowError(true);
      return false;
    }

    try {
      setIsSubmitting(true);
      
      // Update in database and wait for response
      await updateOrgInDb({
        name: name.trim(),
        siteDomain: siteDomain.trim(),
      });

      // Only update Zustand/localStorage after successful DB update
      updateOrganization({
        ...orgConfig,
        name: name.trim(),
        siteDomain: siteDomain.trim(),
      });

      setIsSubmitting(false);
      return true;
    } catch (error) {
      console.error("Error updating organization:", error);
      setIsSubmitting(false);
      return false;
    }
  };

  return (
    <div>
      <PageNavigator
        title="Organization Details"
        description={
          <>
            Enter your organization details to get started.
            <br />
            This information will be used to identify your organization.
          </>
        }
        previousHref="/dashboard/onboarding"
        nextHref="/dashboard/onboarding/global-actions"
        canContinue={isValid()}
        currentStep={1}
        totalSteps={6}
        disabledTooltip="Please enter both organization name and domain"
        onNext={handleNextAttempt}
        isLoading={isSubmitting || isLoadingOrg}
      />
      <div className="max-w-5xl mx-auto">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="org-name"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Organization Name <span className="text-primary">*</span>
            </label>
            <Input
              id="org-name"
              inputSize="xl"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter your organization name"
              aria-invalid={showError && !name.trim()}
              aria-describedby={showError && !name.trim() ? "org-name-error" : undefined}
              disabled={isLoadingOrg}
            />
            {showError && !name.trim() && (
              <p id="org-name-error" className="text-sm text-destructive mt-1">
                Organization name is required
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="org-domain"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Organization Domain <span className="text-primary">*</span>
            </label>
            <Input
              id="org-domain"
              inputSize="xl"
              value={siteDomain}
              onChange={(e) => handleDomainChange(e.target.value)}
              placeholder="Enter your organization domain"
              aria-invalid={showError && !siteDomain.trim()}
              aria-describedby={showError && !siteDomain.trim() ? "org-domain-error" : undefined}
              disabled={isLoadingOrg}
            />
            {showError && !siteDomain.trim() && (
              <p id="org-domain-error" className="text-sm text-destructive mt-1">
                Organization domain is required
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
