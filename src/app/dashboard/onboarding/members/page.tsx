// app/dashboard/onboarding/members/page.tsx

"use client";

import React from "react";
import { AlertCircle, UserPlus } from "lucide-react";
import PageNavigator from "../components/PageNavigator";
import { Card } from "@/components/ui/core/Card";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import TeamList from "../components/TeamList";
import MemberForm from "../components/MemberForm";
import { useMemberManagement } from "@/hooks/useMemberManagement";
import { useOnboardingConfig } from "@/hooks/useOnboardingConfig";

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
  const { isStepComplete } = useOnboardingConfig();
  const {
    members,
    formData,
    formErrors,
    selectedMemberId,
    isEditing,
    handleInputChange,
    handleAddMember,
    handleRemoveMember,
    handleEditMember,
    handleCancelEdit,
  } = useMemberManagement();

  // Transform members for TeamList component
  const memberListItems: MemberListItem[] = members.map((member) => ({
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

  return (
    <div>
      <PageNavigator
        title="Add Members"
        description={
          <>
            Add the members who will be part of your teams. You'll be able to
            assign them to specific teams in the next step.
          </>
        }
        previousHref="/dashboard/onboarding/function-actions"
        nextHref="/dashboard/onboarding/teams"
        canContinue={canContinue()}
        currentStep={4}
        totalSteps={6}
        disabledTooltip="Please add at least one team member to continue to the next step."
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
                fullName={formData.fullName}
                email={formData.email}
                formErrors={formErrors}
                isEditing={isEditing}
                onInputChange={handleInputChange}
                onAddMember={handleAddMember}
                onCancelEdit={handleCancelEdit}
              />
            </div>
            <div className="col-span-3">
              {/* Members List using TeamList component */}
              {members.length > 0 ? (
                <TeamList
                  items={memberListItems}
                  selectedItemId={selectedMemberId}
                  title={`Added ${members.length} Members`}
                  onSelectItem={handleSelectMember}
                  onRemoveItem={handleRemoveMember}
                  showRemoveButton={true}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center border-l border-neutral-lighter">
                  <div className="text-center p-8 max-w-md">
                    <div className="bg-neutral-lightest rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <UserPlus className="text-primary size-8" />
                    </div>
                    <h3 className="heading-4 mb-2">No Team Members</h3>
                    <p className="text-foreground-weak mb-6">
                      Add your first team member using the form.
                    </p>
                    <div className="text-sm text-foreground-weak">
                      <p>
                        Required fields marked with{" "}
                        <span className="text-destructive">*</span>
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
