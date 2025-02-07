import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/core/Card";
import { Button } from "@/components/ui/core/Button";
import { Label } from "@/components/ui/core/Label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/core/Avatar";
import { User, Mail, Building, PenSquare } from "lucide-react";
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
    <div className="ui-main-content">
      <Card>
        <CardContent className="relative pb-0">
          <div className="flex gap-lg p-base">
            <div className="w-content">
              <Avatar className="!size-48">
                <AvatarImage
                  alt="@shadcn"
                  src="https://github.com/shadcn.png"
                />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
            </div>

            <div className="p-base space-y-base">
              <div className="">
                <Label className="ui-text-body-helper">
                  Full Name
                </Label>
                <p className="ui-text-heading-2">
                  {profile.firstName} {profile.lastName}
                </p>
              </div>
              <div className="">
                <Label className="ui-text-body-helper">
                  Email (account ID)
                </Label>
                <p className="ui-text-body-strong">{profile.email}</p>
              </div>
              <div className="">
                <Label className="ui-text-body-helper">
                  Job Title
                </Label>
                <p className="ui-text-body">
                  {profile.title || (
                    <span className="ui-text-body-helper">Not set</span>
                  )}
                </p>
              </div>
            </div>

          <div className="absolute top-0 right-0">
            <Button
              variant="neutral"
              volume="soft"
              onClick={() => setIsEditModalOpen(true)}
              leadingIcon={<PenSquare />}
            >
              Edit
            </Button>
          </div>
          </div>
        </CardContent>
      </Card>

      <ProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
}
