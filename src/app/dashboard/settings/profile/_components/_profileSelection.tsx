import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardDescription 
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
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
  const { user, isLoaded: isUserLoaded } = useUser();
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

  if (!isUserLoaded) {
    return <div className="text-muted-foreground">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <Card size="default" background={true} border={true}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary-600" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Manage your personal information and settings.
              </CardDescription>
            </div>
            <Button
              variant="neutral"
              appearance="outline"
              onClick={() => setIsEditModalOpen(true)}
              leadingIcon={<PenSquare className="h-4 w-4" />}
            >
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email
                </Label>
                <p className="text-heading-4 text-foreground">{profile.email}</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Full Name
                </Label>
                <p className="text-heading-4 text-foreground">
                  {profile.firstName} {profile.lastName}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  Job Title
                </Label>
                <p className="text-heading-4 text-foreground">
                  {profile.title || <span className="text-muted-foreground">Not set</span>}
                </p>
              </div>
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