// app/dashboard/teams/[teamId]/_teamPerformanceSummary.tsx
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TeamPerformanceView } from "@/app/dashboard/components/TeamPerformanceView";
import { ViewSwitcher } from "@/components/ui/composite/ViewSwitcher";
import { MemberPerformance } from "@/store/member";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/core/AlertDialog";
import { Button } from "@/components/ui/core/Button";

interface TeamPerformanceSummaryProps {
  teamId: string;
  teamName: string;
  members: MemberPerformance[];
  viewType: "table" | "grid";
  onViewChange: (value: "table" | "grid") => void;
}

export function TeamPerformanceSummary({
  teamId,
  members,
  viewType,
  onViewChange,
}: TeamPerformanceSummaryProps) {
  const router = useRouter();
  const [memberToDelete, setMemberToDelete] =
    useState<MemberPerformance | null>(null);

  if (!members || members.length === 0) {
    return null;
  }

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;

    try {
      const response = await fetch(
        `/api/teams/${teamId}/members/${memberToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (data.success) {
        window.location.reload();
      } else {
        throw new Error(data.error || "Failed to delete member");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
    } finally {
      setMemberToDelete(null);
    }
  };

  return (
    <main className="layout-page-main">
      <div className="ui-view-controls-bar">
        {/* Hide ViewSwitcher on mobile */}
        <div className="hidden md:block">
          <ViewSwitcher viewType={viewType} onViewChange={onViewChange} />
        </div>
      </div>

      <TeamPerformanceView
        teamId={teamId}
        members={members}
        showAvatar
        showActions
        mode="desktop"
        viewType={viewType}
        onViewChange={onViewChange}
        onMemberDelete={setMemberToDelete}
      />

      <AlertDialog
        open={!!memberToDelete}
        onOpenChange={(open) => !open && setMemberToDelete(null)}
      >
        <AlertDialogContent data-slot="alert-dialog-content">
          <AlertDialogHeader data-slot="alert-dialog-header">
            <AlertDialogTitle data-slot="alert-dialog-title">
              Delete Team Member
            </AlertDialogTitle>
            <AlertDialogDescription data-slot="alert-dialog-description">
              Are you sure you want to remove {memberToDelete?.name} from the
              team? This action cannot be undone. All associated ratings and
              performance data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter data-slot="alert-dialog-footer">
            <AlertDialogCancel asChild>
              <Button data-slot="button" variant="secondary">
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                data-slot="button"
                variant="destructive"
                onClick={handleDeleteMember}
              >
                Delete Member
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
