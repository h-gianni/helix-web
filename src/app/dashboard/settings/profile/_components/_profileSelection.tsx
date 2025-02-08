import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ProfileCard } from "@/components/ui/composite/ProfileCard";
import { ProfileModal } from "./_profileModal";

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
  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || "",
    email: user?.emailAddresses[0]?.emailAddress || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    title: (user?.unsafeMetadata.title as string) || "",
  });

  const handleProfileUpdate = async () => {
    if (user) {
      await user.reload();
      setProfile({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        title: (user.unsafeMetadata.title as string) || "",
      });
    }
  };

  if (!isLoaded) {
    return <div className="text-muted">Loading profile...</div>;
  }

  return (
    <main className="ui-layout-page-main">
      <ProfileCard
        align="horizontal"
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
    </main>
  );
}
