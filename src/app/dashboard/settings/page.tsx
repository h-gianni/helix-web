"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { PageBreadcrumbs } from "@/components/ui/composite/App-header";
import { PageHeader } from "@/components/ui/composite/Page-header";
import { ProfileCard } from "@/components/ui/composite/Profile-card";
import { ProfileModal } from "../_components/_profile/_profile-modal";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { Loader } from "@/components/ui/core/Loader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/core/Card";
import { Users, Target, AlertCircle } from "lucide-react";
import { useConfigStore } from "@/store/config-store";
import OrganizationSummary from "../_components/_configuration/_organization-summary";
import TeamsSummary from "../_components/_configuration/_teams-summary";
import OrgActionsSummary from "../_components/_configuration/_actions-summary";

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  title: string | null;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    title: null,
  });

  useEffect(() => {
    if (isLoaded && user) {
      setProfile({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        title: (user.unsafeMetadata.title as string) || null,
      });
      setIsLoading(false);
    }
  }, [isLoaded, user]);

  const handleProfileUpdate = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (user) {
        await user.reload();
        setProfile({
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          title: (user.unsafeMetadata.title as string) || null,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loader">
        <Loader size="base" label="Loading..." />
      </div>
    );
  }

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
              imageUrl="/api/placeholder/96/96"
              fields={[
                {
                  label: "Full Name",
                  value: `${profile.firstName} ${profile.lastName}`,
                  variant: "title",
                },
                {
                  label: "Email (account ID)",
                  value: profile.email,
                  variant: "strong",
                },
                {
                  label: "Job Title",
                  value: profile.title || (
                    <span className="ui-text-body-helper">Not set</span>
                  ),
                },
              ]}
              onEdit={() => setIsEditModalOpen(true)}
              editButtonPosition="topRight"
              editButtonText="Edit"
            />
            
          <OrganizationSummary
            onEdit={() =>
              router.push("/dashboard/settings/business-activities")
            }
          />
          <TeamsSummary
            onEdit={() => router.push("/dashboard/settings/teams")}
          />
          <OrgActionsSummary
            onEdit={() =>
              router.push("/dashboard/settings/business-activities")
            }
          />

        <ProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profile={profile}
          onUpdate={handleProfileUpdate}
        />
      </main>
    </>
  );
}
