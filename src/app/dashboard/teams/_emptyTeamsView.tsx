// app/dashboard/teams/_emptyTeamsView.tsx
import { Users, UserPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

interface EmptyTeamsViewProps {
  onCreateTeam: () => void;
}

const EmptyTeamsView = ({ onCreateTeam }: EmptyTeamsViewProps) => {
  return (
    <Card size="default" background={true} border={true}>
      <CardContent>
        <div className="text-center space-y-4 py-4">
          <div className="bg-primary-25 rounded-full p-3 size-12 mx-auto">
            <Users className="size-6 text-primary-600" />
          </div>

          <div className="space-y-2">
            <p className="max-w-[600px] mx-auto">
              Get started by creating your first team. Teams help you organize
              members and track their performance through various initiatives.
            </p>
          </div>

          <div className="grid gap-4 max-w-[800px] mx-auto">
            <div className="grid gap-4 md:grid-cols-2">
              <Card size="sm" background={true} border={true} shadow="sm">
                <CardContent>
                  <div className="flex flex-col justify-center space-y-2">
                    <div className="bg-primary-25 rounded-full p-2 size-8 mx-auto">
                      <Users className="size-4 text-primary-600" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-heading-4">1. Create a Team</h3>
                      <p className="text-p-small">
                        Start by creating your first team and add team members
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card size="sm" background={true} border={true} shadow="sm">
                <CardContent>
                  <div className="flex flex-col justify-center space-y-2">
                    <div className="bg-primary-25 rounded-full p-2 size-8 mx-auto">
                      <UserPlus className="size-4 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-heading-4">2. Add Members</h3>
                      <p className="text-p-small">
                        Invite your team members to join and collaborate
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={onCreateTeam}
                leadingIcon={<Plus className="size-4" />}
              >
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
