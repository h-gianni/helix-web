import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/core/Dialog";
import { Button } from "@/components/ui/core/Button";
import { Badge } from "@/components/ui/core/Badge";
import { Heart, GripHorizontal, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { activityData, actionsCategories } from "@/data/org-actions-data";
import { useConfigStore } from '@/store/config-store';

interface Team {
  id: string;
  name: string;
  functions: string[];
}

export interface TeamActionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
}

const TeamActionsDialog: React.FC<TeamActionsDialogProps> = ({
  isOpen,
  onClose,
  team,
}) => {
  const selectedActivities = useConfigStore((state) => state.config.activities.selected);
  
  const getTeamActivities = () => {
    return team.functions.reduce((acc: Record<string, string[]>, func) => {
      if (activityData[func]) {
        acc[func] = activityData[func].filter(activity => selectedActivities.includes(activity));
      }
      return acc;
    }, {});
  };

  const handleFavorite = (activity: string) => {
    // TODO: Implement favorite functionality
    console.log('Favorite:', activity);
  };

  const teamActivities = getTeamActivities();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh]" scrollable>
        <DialogHeader className="p-6 border-b">
          <DialogTitle>
            <div className="flex flex-col gap-2">
              <h2 className="heading-2">{team.name}'s Actions</h2>
              <div className="flex gap-2">
                {team.functions.map((func) => (
                  <Badge key={func} variant="secondary">
                    {func}
                  </Badge>
                ))}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-6">
            {Object.entries(teamActivities).map(([category, activities]) => (
              activities.length > 0 && (
                <div key={category} className="space-y-2">
                  <h3 className="heading-4 capitalize">{category}</h3>
                  <div className="w-full -space-y-px">
                    {activities.map((activity) => (
                      <div
                        key={activity}
                        className="flex items-center justify-between bg-white text-foreground border px-4 py-3 border-border"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <GripHorizontal className="h-4 w-4 cursor-grab text-foreground/25" />
                          <span className="text-base">{activity}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFavorite(activity)}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => console.log('View:', activity)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </DialogBody>

        <DialogFooter className="p-6 border-t">
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeamActionsDialog;