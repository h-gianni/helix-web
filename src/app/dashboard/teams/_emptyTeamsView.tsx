import { Users, UserPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

interface EmptyTeamsViewProps {
  onCreateTeam: () => void;
}

const EmptyTeamsView = ({ onCreateTeam }: EmptyTeamsViewProps) => {
  return (
    <Card>
      <CardContent className="py-8">
        <div className="text-center space-y-6">
          <div className="mx-auto size-12 rounded-full bg-primary-50 p-3">
            <Users className="size-6 text-primary-600" />
          </div>

          <p className="text-muted-foreground max-w-[600px] mx-auto">
            Get started by creating your first team. Teams help you organize
            members and track their performance through various initiatives.
          </p>

          <div className="max-w-[800px] mx-auto space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  icon: Users,
                  title: "1. Create a Team",
                  description: "Start by creating your first team and add team members"
                },
                {
                  icon: UserPlus,
                  title: "2. Add Members",
                  description: "Invite your team members to join and collaborate"
                }
              ].map(({ icon: Icon, title, description }) => (
                <Card key={title} size="sm">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="size-8 rounded-full bg-primary-50 p-2">
                        <Icon className="size-4 text-primary-600" />
                      </div>
                      <h3 className="font-medium">{title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

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
      </CardContent>
    </Card>
  );
};

export default EmptyTeamsView;