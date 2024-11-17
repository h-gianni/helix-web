// app/dashboard/teams/_emptyTeamsView.tsx
import { Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

interface EmptyTeamsViewProps {
  onCreateTeam: () => void;
}

const EmptyTeamsView = ({ onCreateTeam }: EmptyTeamsViewProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center space-y-6 py-8">
          <div className="bg-primary/5 rounded-full p-3 w-12 h-12 mx-auto">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-2">
            {/* <h2 className="text-2xl font-bold">Welcome to UpScore</h2> */}
            <p className="text-gray-500 max-w-[600px] mx-auto">
              Get started by creating your first team. Teams help you organize members
              and track their performance through various initiatives.
            </p>
          </div>
          
          <div className="grid gap-6 max-w-[800px] mx-auto">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-4">
                <div className="flex gap-4">
                  <div className="bg-primary/10 rounded-lg p-2 h-fit">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">1. Create a Team</h3>
                    <p className="text-sm text-gray-500">Start by creating your first team and add team members</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex gap-4">
                  <div className="bg-primary/10 rounded-lg p-2 h-fit">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">2. Add Members</h3>
                    <p className="text-sm text-gray-500">Invite your team members to join and collaborate</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button onClick={onCreateTeam} size="lg">
                <Users className="w-4 h-4 mr-2" />
                Create Your First Team
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyTeamsView;