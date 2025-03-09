// EmptyTeamView.tsx
import React from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/core/Button";
import { Card, CardContent } from "@/components/ui/core/Card";

interface EmptyTeamViewProps {
  onAddMember: () => void;
}

function EmptyTeamView({ onAddMember }: EmptyTeamViewProps) {
  return (
    <Card data-slot="card">
      <CardContent data-slot="card-content" className="py-8">
        <div className="space-y-8 text-center">
          <div className="space-y-4">
            {/* Replaced h-12 w-12 with size-12 */}
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary-50">
              {/* Replaced h-6 w-6 with size-6 */}
              <UserPlus className="size-6 text-primary-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Start Building Your Team</h2>
              <p className="mx-auto max-w-xl">
                Your team is ready to go! Begin by adding your first team member.
              </p>
            </div>
          </div>
          <Button data-slot="button" variant="default" size="lg" onClick={onAddMember}>
            <UserPlus className="size-4" />
            Add First Member
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default EmptyTeamView;
