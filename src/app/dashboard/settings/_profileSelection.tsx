import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
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
    return <div>Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
          <Button 
            variant="outline" 
            onClick={() => setIsEditModalOpen(true)}
          >
            <PenSquare className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  <Mail className="w-4 h-4 inline-block mr-2" />
                  Email
                </label>
                <p className="text-lg">{profile.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  <User className="w-4 h-4 inline-block mr-2" />
                  Full Name
                </label>
                <p className="text-lg">
                  {profile.firstName} {profile.lastName}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  <Building className="w-4 h-4 inline-block mr-2" />
                  Job Title
                </label>
                <p className="text-lg">{profile.title || "Not set"}</p>
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