import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ProfileCard } from "@/components/ui/composite/ProfileCard";
import { ProfileModal } from "./ProfileModal";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { Loader } from "@/components/ui/core/Loader";
import { AlertCircle } from "lucide-react";
import { useProfile, useProfileStore, useUpdateProfile } from "@/store/user-store";

function ProfileSection() {
  // Get Clerk user data
  const { user, isLoaded: isClerkLoaded } = useUser();
  
  // Use the store for UI state
  const { isEditModalOpen, setEditModalOpen } = useProfileStore();
  
  // Use React Query hook for API data
  const { data: profileData, isLoading: isApiLoading, error: apiError } = useProfile();
  
  // Get mutation for updates
  const updateProfile = useUpdateProfile();

  // Combine loading states
  const isLoading = isApiLoading || !isClerkLoaded;
  
  // Format error message
  const error = apiError instanceof Error ? apiError.message : 
    apiError ? "Failed to load profile data" : null;

  const handleProfileUpdate = async (formData: { firstName: string; lastName: string; title: string | null }) => {
    try {
      // Use the mutation to update profile
      await updateProfile.mutateAsync({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        title: formData.title,
      });
      
      // Reload clerk user data to get latest changes
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

  // Prepare profile data for the modal
  const profileFormData = {
    firstName: profileData?.clerkProfile?.firstName || "",
    lastName: profileData?.clerkProfile?.lastName || "",
    title: profileData?.clerkProfile?.title || null,
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert data-slot="alert" variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription data-slot="alert-description">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div>
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
                <span className="body-sm">Not set</span>
              ),
            },
          ]}
          onEdit={() => setEditModalOpen(true)}
          editButtonPosition="topRight"
          editButtonText="Edit"
        />
      </div>

      <ProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        profile={profileFormData}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
}

export { ProfileSection };