"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { PageBreadcrumbs } from "@/components/ui/composite/App-header";
import { PageHeader } from "@/components/ui/composite/Page-header";
import { ProfileCard } from "@/components/ui/composite/Profile-card";
import { ProfileModal } from "../_components/_profile/_profile-modal";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { Loader } from "@/components/ui/core/Loader";

import { Users, Target, AlertCircle } from "lucide-react";
import { useConfigStore } from "@/store/config-store";
import OrganizationSummary from "../_components/_configuration/_organization-summary";
import TeamsSummary from "../_components/_configuration/_teams-summary";
import OrgActionsSummary from "../_components/_configuration/_actions-summary";
import { useProfileStore, useProfileSync } from "@/store/user-store";

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  title: string | null;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoaded: isClerkLoaded  } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [profile, setProfile] = useState<UserProfile>({
  //   id: "",
  //   email: "",
  //   firstName: "",
  //   lastName: "",
  //   title: null,
  // });

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

  // useEffect(() => {
  //   if (isLoaded && user) {
  //     setProfile({
  //       id: user.id,
  //       email: user.emailAddresses[0]?.emailAddress || "",
  //       firstName: user.firstName || "",
  //       lastName: user.lastName || "",
  //       title: (user.unsafeMetadata.title as string) || null,
  //     });
  //     setIsLoading(false);
  //   }
  // }, [isLoaded, user]);

  // const handleProfileUpdate = async () => {
  //   try {
  //     setIsLoading(true);
  //     setError(null);

  //     if (user) {
  //       await user.reload();
  //       setProfile({
  //         id: user.id,
  //         email: user.emailAddresses[0]?.emailAddress || "",
  //         firstName: user.firstName || "",
  //         lastName: user.lastName || "",
  //         title: (user.unsafeMetadata.title as string) || null,
  //       });
  //     }
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "Failed to update profile");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // if (isLoading) {
  //   return (
  //     <div className="loader">
  //       <Loader size="base" label="Loading..." />
  //     </div>
  //   );
  // }

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
           <ProfileCard
          align="horizontal"
          // imageUrl={profile?.clerkProfile?.imageUrl || "/api/placeholder/96/96"}
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
            
          <OrganizationSummary
            // onEdit={() =>
            //   router.push("/dashboard/settings/business-activities")
            // }
          />
          <TeamsSummary
            onEdit={() => router.push("/dashboard/settings/teams")}
          />
          <OrgActionsSummary
            // onEdit={() =>
            //   router.push("/dashboard/settings/business-activities")
            // }
          />

        <ProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profile={profileData}
          onUpdate={handleProfileUpdate}
        />
      </main>
    </>
  );
}
