"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { PageBreadcrumbs } from "@/components/ui/composite/AppHeader";
import { PageHeader } from "@/components/ui/composite/PageHeader";
import { ProfileCard } from "@/components/ui/composite/ProfileCard";
import { ProfileModal } from "./profile/_components/_profileModal";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { Loader } from "@/components/ui/core/Loader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/core/Card";
import { Users, Target, AlertCircle } from "lucide-react";

const settingsGroups = [
  {
    title: "Team Management",
    items: [
      {
        title: "Teams",
        description: "Manage team settings and configurations",
        icon: Users,
        href: "/dashboard/settings/teams",
      },
      {
        title: "Business Activities",
        description: "Configure and track team activities and performance",
        icon: Target,
        href: "/dashboard/settings/business-activities",
      },
    ],
  },
];

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

      <main className="layout-page-main space-y-8">
        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
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
          </div>

          <ProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            profile={profile}
            onUpdate={handleProfileUpdate}
          />
        </div>

        {settingsGroups.map((group) => (
          <div key={group.title} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.title}
                    onClick={() => router.push(item.href)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50">
                          <Icon className="h-4 w-4 text-primary-600" />
                        </div>
                        <div>
                          <CardTitle>{item.title}</CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </main>
    </>
  );
}