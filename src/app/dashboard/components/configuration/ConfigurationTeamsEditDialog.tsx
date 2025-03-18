import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/core/Dialog";
import { Button } from "@/components/ui/core/Button";
import TeamSetup from "./ConfigurationTeams";
import { useConfigStore } from "@/store/config-store";
import { useUpdateTeamActivities } from "@/store/team-activities-store";
// import { useToast } from "@/components/ui/core/use-toast";
import { Loader2 } from "lucide-react";

interface TeamsEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function TeamsEditDialog({ isOpen, onClose }: TeamsEditDialogProps) {
  // const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // Get store access to ensure data is persisted
  const teams = useConfigStore(state => state.config.teams);
  const activities = useConfigStore(state => state.config.activities);
  
  // Get the mutation for updating team activities
  const updateTeamActivitiesMutation = useUpdateTeamActivities();

  // Save handler to persist changes to the database
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Save each team's functions to the database  
      for (const team of teams.filter(t => !t.id.startsWith("temp-"))) {
        // Map category IDs to actual action IDs
        let actionIds = [];
        
        // Collect action IDs from selected categories
        team.categories.forEach(categoryId => {
          const actionsForCategory = activities.selectedByCategory[categoryId] || [];
          actionIds = [...actionIds, ...actionsForCategory];
        });
        
        // Remove duplicates
        actionIds = [...new Set(actionIds)];
        
        // Call the API to update team activities
        await updateTeamActivitiesMutation.mutateAsync({
          teamId: team.id,
          activityIds: actionIds // Send the action IDs to the API
        });
      }
      
      // toast({
      //   title: "Success",
      //   description: "Team functions saved successfully!",
      // });
      
      onClose();
      
    } catch (error) {
      console.error("Error saving team functions:", error);
      
      // toast({
      //   title: "Error",
      //   description: "Failed to save team functions. Please try again.",
      //   variant: "destructive",
      // });
      
      setIsSaving(false);
    }
  };

  // Cancel handler
  const handleCancel = () => {
    // Simply close without saving to DB
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSaving) {
          onClose();
        }
      }}
    >
      <DialogContent className="w-[96%] h-[96%] max-w-7xl p-0 m-auto rounded-md flex flex-col overflow-hidden">
        <DialogHeader className="p-6 border-b shrink-0">
          <DialogTitle>
            <div className="flex flex-col gap-2 w-full">
              <span className="heading-2">Edit Teams</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable content area that takes available height */}
        <div className="flex-1 px-6 pt-2 pb-6 overflow-y-auto">
          <TeamSetup />
        </div>

        {/* Fixed footer with loading state */}
        <DialogFooter className="relative p-6 border-t shrink-0">
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TeamsEditDialog;