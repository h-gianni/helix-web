"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { PageBreadcrumbs } from "@/components/ui/composite/AppHeader";
import { PageHeader } from "@/components/ui/composite/PageHeader";
import { ProfileCard } from "@/components/ui/composite/ProfileCard";
import { ProfileModal } from "../components/profile/ProfileModal";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { Loader } from "@/components/ui/core/Loader";

import { AlertCircle } from "lucide-react";
import { useConfigStore } from "@/store/config-store";
import OrganizationSummary from "../components/configuration/ConfigurationOrganizationSummary";
import TeamsSummary from "../components/configuration/ConfigurationTeamsSummary";
import OrgActionsSummary from "../components/configuration/ConfigurationActionsSummary";
import { useProfile, useProfileStore, useUpdateProfile } from "@/store/user-store";
import TeamsEditDialog from "../components/configuration/ConfigurationTeamsEditDialog";
import ActionsDialog from "../components/configuration/ConfigurationActionsEditDialog";

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoaded: isClerkLoaded } = useUser();
  const [isTeamsDialogOpen, setIsTeamsDialogOpen] = useState(false);
  const [isActionsDialogOpen, setIsActionsDialogOpen] = useState(false);

  // Use the React Query hook for data fetching
  const { data: profileData, isLoading: isApiLoading, error: apiError } = useProfile();
  
  // Get UI state from the store
  const { isEditModalOpen, setEditModalOpen } = useProfileStore();

  // Get the mutation for updating profile
  const updateProfile = useUpdateProfile();

  // Combine loading states from both Clerk and API
  const isLoading = isApiLoading || !isClerkLoaded;

  // Handle error display
  const error = apiError instanceof Error ? apiError.message : 
    apiError ? "Failed to load profile data" : null;

  const handleProfileUpdate = async (formData: { firstName: string; lastName: string; title: string | null }) => {
    try {
      // Call the mutation function with the form data
      await updateProfile.mutateAsync({
        firstName: formData.firstName,
        lastName: formData.lastName,
        title: profileData_editable.title
      });
      
      // Reload clerk user data
      if (user) {
        await user.reload();
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="loader">
        <Loader size="base" label="Loading..." />
      </div>
    );
  }

  // Construct profile data for the ProfileModal component
  const profileData_editable = {
    firstName: profileData?.clerkProfile?.firstName || "",
    lastName: profileData?.clerkProfile?.lastName || "",
     title: profileData?.clerkProfile?.title ?? null,
  };

  return (
    <>
      <PageBreadcrumbs items={[{ label: "Settings" }]} />
      <PageHeader title="Settings" />

      <main className="layout-page-main">
        {error && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-6">
          <ProfileCard
            align="horizontal"
            imageUrl={profileData?.clerkProfile?.imageUrl || "/api/placeholder/96/96"}
            fields={[
              {
                label: "Full Name",
                value: `${profileData?.clerkProfile?.firstName || ''} ${profileData?.clerkProfile?.lastName || ''}`.trim() || "Not set",
                variant: "title",
              },
              {
                label: "Email (account ID)",
                value: profileData?.email || '',
                variant: "strong",
              },
              {
                label: "Job Title",
                value: profileData?.clerkProfile?.title || (
                  <span className="ui-text-body-helper">Not set</span>
                ),
              },
            ]}
            onEdit={() => setEditModalOpen(true)}
            editButtonPosition="topRight"
            editButtonText="Edit"
          />
              
          <TeamsSummary
            onEdit={() => setIsTeamsDialogOpen(true)}
            variant="settings"
          />
          
          <OrgActionsSummary
            onEdit={() => setIsActionsDialogOpen(true)}
            variant="settings"
          />
        </div>

        {/* Modals and Dialogs */}
        <ProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          profile={profileData_editable}
          onUpdate={() => handleProfileUpdate({ firstName: '', lastName: '', title: null })}
        />
        
        <TeamsEditDialog
          isOpen={isTeamsDialogOpen}
          onClose={() => setIsTeamsDialogOpen(false)}
        />
        
        <ActionsDialog
          isOpen={isActionsDialogOpen}
          onClose={() => setIsActionsDialogOpen(false)}
        />
      </main>
    </>
  );
}