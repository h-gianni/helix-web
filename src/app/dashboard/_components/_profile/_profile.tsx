import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { ProfileCard } from "@/components/ui/composite/Profile-card";
import { ProfileModal } from "./_profile-modal";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { Loader } from "@/components/ui/core/Loader";
import { AlertCircle } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  title: string | null;
}

function ProfileSection() {
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
    <div className="space-y-6">
      {error && (
        <Alert data-slot="alert" variant="destructive">
          {/* If you had an h/w class here, you'd replace it with size-# */}
          <AlertCircle className="size-4" />
          <AlertDescription data-slot="alert-description">
            {error}
          </AlertDescription>
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
  );
}

export { ProfileSection };
