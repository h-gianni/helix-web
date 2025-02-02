import { Users, UserPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

interface EmptyTeamsViewProps {
  onCreateTeam: () => void;
}

const EmptyTeamsView = ({ onCreateTeam }: EmptyTeamsViewProps) => {
  return (
    <Card>
      <CardContent className="py-xl">
        <div className="text-center space-y-xl">
          <div className="space-y-base">
            <div className="mx-auto size-12 rounded-pill bg-primary-weakest p-sm">
              <Users className="size-6 text-primary" />
            </div>
            <div className="space-y-sm">
              <h1 className="text-display-1">Teams</h1>
              <p className="text-copy-large max-w-xl mx-auto text-muted-foreground">
                Get started by creating your first team. Teams help you organize
                members and track their performance through various activities.
              </p>
            </div>
          </div>

          <div className="max-w-[1000px] mx-auto space-y-md">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  icon: Users,
                  title: "1. Create one or more Teams",
                  description:
                    "Start by creating your first team and add team members",
                },
                {
                  icon: UserPlus,
                  title: "2. Add Members to their team",
                  description:
                    "Invite your team members to join and collaborate",
                },
              ].map(({ icon: Icon, title, description }) => (
                <Card key={title} size="sm">
                  <CardContent>
                    <div className="flex flex-col items-center space-y-sm">
                      <div className="size-8 rounded-pill bg-primary-weakest p-xs">
                        <Icon className="text-primary" />
                      </div>
                      <div className="space-y-xxs">
                        <h3 className="text-heading-4">{title}</h3>
                        <p className="text-helper text-center">{description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center pt-base">
              <Button
                variant="primary"
                shape="rounded"
                size="lg"
                onClick={onCreateTeam}
                leadingIcon={<Plus />}
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
