// src/components/EmptyDashboardView.tsx
import { useRouter } from "next/navigation";
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/core/Button";
import { Card, CardContent } from "@/components/ui/core/Card";
import { SetupGuide } from "./_setupGuide";
import { useTeams } from "@/store/team-store";
import { useSetupStore } from "@/store/setup-store";

interface EmptyDashboardViewProps {
  onCreateTeam: () => void;
}

const EmptyDashboardView = ({ onCreateTeam }: EmptyDashboardViewProps) => {
  const { steps } = useSetupStore();
  const { data: teams = [] } = useTeams();
  const router = useRouter();
  const showSuccessMessage = steps.configureTeamActivities;
  const firstTeam = teams[0];

  return (
    <Card>
      <CardContent className="py-xl">
        <div className="text-center space-y-xl">
          <div className="space-y-base">
            <div className="mx-auto size-12 rounded-pill ui-background-primary-weakest p-sm">
              <Users className="size-6 text-primary" />
            </div>

            {!showSuccessMessage ? (
              <div className="space-y-sm">
                <h1 className="ui-text-display-1">Welcome to UpScore</h1>
                <p className="ui-text-copy-large max-w-xl mx-auto">
                  Get started by following these steps:
                </p>
              </div>
            ) : (
              <div className="space-y-sm">
                <h1 className="ui-text-display-1">
                  You have successfully set up UpScore
                </h1>
                <p className="ui-text-copy-large max-w-xl mx-auto">
                  Now you can create more teams and add your members to the
                  relevant team. Enjoy.
                </p>
                <div className="flex gap-sm justify-center py-base">
                  <Button
                    shape="rounded"
                    size="base"
                    variant="neutral"
                    volume="moderate"
                    onClick={() => router.push('/dashboard/teams')}
                  >
                    Go to teams
                  </Button>
                  <Button
                    shape="rounded"
                    size="base"
                    variant="primary"
                    onClick={() =>
                      router.push(`/dashboard/teams/${firstTeam?.id}`)
                    }
                  >
                    Add members to {firstTeam?.name || "team"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="max-w-[1200px] mx-auto space-y-md">
            <SetupGuide onCreateTeam={() => onCreateTeam()} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyDashboardView;
