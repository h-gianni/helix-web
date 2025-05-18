// app/dashboard/onboarding/members/page.tsx

"use client";

import React, { useState } from "react";
import { AlertCircle, UserPlus } from "lucide-react";
import PageNavigator from "../components/PageNavigator";
import { Card } from "@/components/ui/core/Card";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import TeamList from "../components/TeamList";
import MemberForm from "../components/MemberForm";
import { useConfigStore, useUpdateTeamMembers, useSaveMembersToDatabase } from "@/store/config-store";
import { useOnboardingConfig } from "@/hooks/useOnboardingConfig";
import { HeroBadge } from "@/components/ui/core/HeroBadge";
import { trimDomain } from "@/lib/utils/domainUtils";
import { useOrganizationData } from "@/store/config-store";
import { useRouter } from "next/navigation";

// Interface for TeamList compatible item
interface MemberListItem {
  id: string;
  name: string;
  subtitle: React.ReactNode;
  icon: "user";
  // Keep original member data
  fullName: string;
  email: string;
}

export default function MembersPage() {
  // Use our custom hooks
  const { config, isStepComplete } = useOnboardingConfig();
  const { data: orgData } = useOrganizationData();
  // const updateTeamMembers = useUpdateTeamMembers();
  const saveMembersToDatabase = useSaveMembersToDatabase();
  const teamMembers = useConfigStore((state) => state.config.teamMembers || []);
  const updateTeamMembers = useConfigStore((state) => state.updateTeamMembers);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });
  const [tempFormData, setTempFormData] = useState({
    fullName: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    email: "",
  });
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors = {
      fullName: "",
      email: "",
    };
    let isValid = true;

    if (!tempFormData.fullName.trim()) {
      errors.fullName = "Full name is required";
      isValid = false;
    }

    if (!tempFormData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempFormData.email)) {
      errors.email = "Invalid email format";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle adding/updating member
  const handleAddMember = async () => {
    if (!validateForm() || !orgData?.id) return;

    // Update the form data with the temporary values
    setFormData(tempFormData);

    const newMember = {
      id: selectedMemberId || crypto.randomUUID(),
      fullName: tempFormData.fullName,
      email: tempFormData.email,
      jobTitle: "",
    };

    // Update local storage through the store
    // updateTeamMembers.mutate({
    //   members: isEditing
    //     ? teamMembers.map((m) =>
    //         m.id === selectedMemberId ? newMember : m
    //       )
    //     : [...teamMembers, newMember],
    //   orgId: orgData.id,
    // });

    console.log('newMember:-------------', [...teamMembers, newMember]);

    updateTeamMembers([...teamMembers, newMember]);

    

    // Reset form
    setFormData({ fullName: "", email: "" });
    setTempFormData({ fullName: "", email: "" });
    setSelectedMemberId(null);
    setIsEditing(false);
  };

  // Handle removing member
  const handleRemoveMember = async (id: string) => {
    if (!orgData?.id) return;

    // Update local storage through the store
    // updateTeamMembers.mutate({
    //   members: teamMembers.filter((m) => m.id !== id),
    //   orgId: orgData.id,
    // });
  };

  // Handle editing member
  const handleEditMember = (id: string) => {
    const member = teamMembers.find((m) => m.id === id);
    if (member) {
      setTempFormData({
        fullName: member.fullName,
        email: member.email,
      });
      setSelectedMemberId(id);
      setIsEditing(true);
    }
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setTempFormData({ fullName: "", email: "" });
    setSelectedMemberId(null);
    setIsEditing(false);
  };

  // Transform members for TeamList component
  const memberListItems: MemberListItem[] = teamMembers.map((member) => ({
    id: member.id,
    name: member.fullName,
    subtitle: (
      <div className="flex items-center">
        <span>{member.email}</span>
      </div>
    ),
    icon: "user" as const,
    // Keep original data
    fullName: member.fullName,
    email: member.email,
  }));

  // Handle select item from list
  const handleSelectMember = (item: MemberListItem) => {
    handleEditMember(item.id);
  };

  // Check if we can continue - at least one member with name and email
  const canContinue = () => {
    return isStepComplete.members();
  };

  // Handle next button click
  const handleNextClick = async () => {
    if (!orgData?.id) return;

    // Just navigate to the teams page
    router.push('/dashboard/onboarding/teams');
  };

  return (
    <div>
      <PageNavigator
        title="Add Members"
        description={
          <>
            Add the members who will be part of your teams. You&apos;ll be able
            to assign them to specific teams in the next step.
          </>
        }
        previousHref="/dashboard/onboarding/function-actions"
        nextHref="/dashboard/onboarding/teams"
        canContinue={canContinue()}
        currentStep={4}
        totalSteps={6}
        disabledTooltip="Please add at least one team member to continue to the next step."
        onNext={handleNextClick}
      />

      <div className="max-w-5xl mx-auto space-y-4">
        {/* {members.length === 0 && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="size-4" />
            <AlertDescription>
              Please add at least one team member to continue to the next step.
            </AlertDescription>
          </Alert>
        )} */}
        <Card className="w-full">
          <div className="grid grid-cols-5">
            <div className="col-span-2">
              {/* Member Form Component */}
              <MemberForm
                fullName={tempFormData.fullName}
                email={tempFormData.email}
                formErrors={formErrors}
                isEditing={isEditing}
                onInputChange={handleInputChange}
                onAddMember={handleAddMember}
                onCancelEdit={handleCancelEdit}
                defaultDomain={
                  config?.organization.siteDomain
                    ? trimDomain(config.organization.siteDomain)
                    : ""
                }
              />
            </div>
            <div className="col-span-3">
              {/* Members List using TeamList component */}
              {teamMembers.length > 0 ? (
                <TeamList
                  items={memberListItems}
                  selectedItemId={selectedMemberId}
                  title={`Added ${teamMembers.length} Members`}
                  onSelectItem={handleSelectMember}
                  onRemoveItem={handleRemoveMember}
                  showRemoveButton={true}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center border-l border-border-weak">
                  <div className="flex flex-col items-center text-center p-8 max-w-md">
                    <HeroBadge variant="primary" size="lg" icon={UserPlus} />
                    <h3 className="heading-4 mt-4">No Team Members</h3>
                    <p className="text-foreground-weak mb-4">
                      Add your first team member using the form.
                    </p>
                    <div className="caption text-foreground-weak">
                      <p>
                        Required fields marked with{" "}
                        <span className="text-primary">*</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
