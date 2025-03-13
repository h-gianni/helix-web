"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { PageBreadcrumbs } from "@/components/ui/composite/AppHeader";
import { PageHeader } from "@/components/ui/composite/PageHeader";
import { ProfileCard } from "@/components/ui/composite/ProfileCard";
import { ProfileModal } from "../components/profile/ProfileModal";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { Loader } from "@/components/ui/core/Loader";

import { Users, Target, AlertCircle } from "lucide-react";
import { useConfigStore } from "@/store/config-store";
import OrganizationSummary from "../components/configuration/ConfigurationOrganizationSummary";
import TeamsSummary from "../components/configuration/ConfigurationTeamsSummary";
import OrgActionsSummary from "../components/configuration/ConfigurationActionsSummary";
import { useProfileStore, useProfileSync } from "@/store/user-store";
import TeamsEditDialog from "../components/configuration/ConfigurationTeamsEditDialog";
import ActionsDialog from "../components/configuration/ConfigurationActionsEditDialog";

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  title: string | null;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoaded: isClerkLoaded } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTeamsDialogOpen, setIsTeamsDialogOpen] = useState(false);
  const [isActionsDialogOpen, setIsActionsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the profile sync hook to load and sync profile data with the store
  const { isLoading: isApiLoading, error: apiError } = useProfileSync();

  // Get profile data from the store
  const { profile } = useProfileStore();

  // Combine loading states from both Clerk and API
  const isLoading = isApiLoading || !isClerkLoaded;

  // Set error state if API error occurs
  useEffect(() => {
    if (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Failed to load profile data");
    }
  }, [apiError]);

  const handleProfileUpdate = async () => {
    try {
      setError(null);
      
      // Reload clerk user data
      if (user) {
        await user.reload();
      }
      
      // This will trigger a re-fetch of the profile from the API
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
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
  const profileData = {
    id: profile?.id || "",
    email: profile?.email || "",
    firstName: profile?.clerkProfile?.firstName || "",
    lastName: profile?.clerkProfile?.lastName || "",
    title: profile?.teamMembers?.[0]?.title || null,
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
      imageUrl={"/api/placeholder/96/96"}
      fields={[
        {
          label: "Full Name",
          value: `${profileData.firstName} ${profileData.lastName}`,
          variant: "title",
        },
        {
          label: "Email (account ID)",
          value: profileData.email,
          variant: "strong",
        },
        {
          label: "Job Title",
          value: profileData.title || (
            <span className="ui-text-body-helper">Not set</span>
          ),
        },
      ]}
      onEdit={() => setIsEditModalOpen(true)}
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
    onClose={() => setIsEditModalOpen(false)}
    profile={profileData}
    onUpdate={handleProfileUpdate}
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