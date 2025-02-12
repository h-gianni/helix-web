import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { ProfileCard } from "@/components/ui/composite/ProfileCard";
import { ProfileModal } from "./_profileModal";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { AlertCircle } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  title: string | null;
}

export function ProfileSection() {
  const { user, isLoaded } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    title: null
  });

  useEffect(() => {
    if (isLoaded && user) {
      setProfile({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        title: (user.unsafeMetadata.title as string) || null
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
          title: (user.unsafeMetadata.title as string) || null
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="ui-loader">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="danger">
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

      <ProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
}