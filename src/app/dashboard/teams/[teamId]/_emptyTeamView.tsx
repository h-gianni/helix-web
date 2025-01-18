import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

const EmptyTeamView = ({ onAddMember }: { onAddMember: () => void }) => {
  return (
    <Card size="default" background={true} border={true} className="w-full">
      <CardContent>
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="bg-primary-50 rounded-full p-3 w-12 h-12 mx-auto">
              <UserPlus className="w-6 h-6 text-primary-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-display-2">Start Building Your Team</h2>
              <p className="text-p max-w-xl mx-auto">
                Your team is ready to go! Begin by adding your first team
                member.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={onAddMember}
              leadingIcon={<UserPlus className="size-4" />}
            >
              Add First Member
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyTeamView;
