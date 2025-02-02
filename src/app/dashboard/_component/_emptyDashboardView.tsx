import { Users, Target, Star, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

interface EmptyDashboardViewProps {
  onCreateTeam: () => void;
}

const EmptyDashboardView = ({ onCreateTeam }: EmptyDashboardViewProps) => {
  const steps = [
    {
      icon: Users,
      title: "1. Create a Team",
      description: "Start by creating your first team and adding team members"
    },
    {
      icon: Target,
      title: "2. Configure activities",
      description: "Set up performance activities for your team"
    },
    {
      icon: Star,
      title: "3. Rate Performance",
      description: "Add ratings and track member performance on activities"
    },
    {
      icon: MessageSquare,
      title: "4. Provide Feedback",
      description: "Give detailed feedback to help members improve"
    }
  ];

  return (
  <Card>
    <CardContent className="py-xl">
      <div className="text-center space-y-xl">
        <div className="space-y-base">
          <div className="mx-auto size-12 rounded-pill bg-primary-weakest p-sm">
            <Users className="size-6 text-primary" />
          </div>
          <div className="space-y-sm">
            <h1 className="text-display-1">Welcome to UpScore</h1>
            <p className="text-copy-large max-w-xl mx-auto">
              Get started by following these steps:
            </p>
          </div>
        </div>

        <div className="max-w-[1000px] mx-auto space-y-md">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Users,
                title: "1. Create a Team",
                description:
                  "Start by creating your first team and adding team members",
              },
              {
                icon: Target,
                title: "2. Configure activities",
                description: "Set up performance activities for your team",
              },
              {
                icon: Star,
                title: "3. Rate Performance",
                description:
                  "Add ratings and track member performance on activities",
              },
              {
                icon: MessageSquare,
                title: "4. Provide Feedback",
                description: "Give detailed feedback to help members improve",
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
              size="lg"
              shape="rounded"
              variant="primary"
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

export default EmptyDashboardView;