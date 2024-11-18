import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

const EmptyTeamView = ({ onAddMember }: { onAddMember: () => void }) => {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="text-center space-y-6">
          <div className="bg-primary/5 rounded-full p-3 w-12 h-12 mx-auto">
            <UserPlus className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Start Building Your Team</h2>
            <p className="text-gray-500 max-w-[600px] mx-auto">
              Your team is ready to go! Begin by adding your first team member.
            </p>
          </div>
          <Button onClick={onAddMember} size="lg">
            <UserPlus className="w-4 h-4 mr-2" />
            Add First Member
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyTeamView;