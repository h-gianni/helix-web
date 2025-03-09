"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PageBreadcrumbs } from "@/components/ui/composite/App-header";
import { PageHeader } from "@/components/ui/composite/Page-header";
import { Button } from "@/components/ui/core/Button";
import { Loader } from "@/components/ui/core/Loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/core/Dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/core/Alert-dialog";
import { Alert } from "@/components/ui/core/Alert";
import {
  UserPlus,
  Trash2,
  PenSquare,
  ArrowLeft,
  MoreVertical,
  AlertCircle,
} from "lucide-react";
import { AddMemberModal } from "../../_components/_team/_add-member-modal";
import { TeamPerformanceSummary } from "../../_components/_team/_team-performance-summary";
import EmptyTeamView from "../../_components/_team/_team-empty-view";
import { TeamEditModal } from "../../_components/_team/_team-edit-modal";
import {
  useTeamStore,
  useTeamDetails,
  useTeamPerformance,
  useUpdateTeam,
  useDeleteTeam,
  useAddTeamMember,
} from "@/store/team-store";

interface TeamDetailsPageProps {
  params: { teamId: string };
}

export default function TeamDetailsPage({ params }: TeamDetailsPageProps) {
  const router = useRouter();
  const {
    isAddMemberModalOpen,
    isEditModalOpen,
    isDeleteDialogOpen,
    viewType,
    setAddMemberModalOpen,
    setEditModalOpen,
    setDeleteDialogOpen,
    setViewType,
  } = useTeamStore();

  const {
    data: team,
    isLoading: isTeamLoading,
    error: teamError,
  } = useTeamDetails(params.teamId);

  const { data: performanceData, isLoading: isPerformanceLoading } =
    useTeamPerformance(params.teamId);

  const updateTeam = useUpdateTeam();
  const deleteTeam = useDeleteTeam();
  const addMember = useAddTeamMember();

  const isLoading = isTeamLoading || isPerformanceLoading;
  const error = teamError;

  const handleSaveTeamDetails = async (
    name: string,
    description: string | null
  ) => {
    await updateTeam.mutateAsync({ teamId: params.teamId, name, description });
    setEditModalOpen(false);
  };

  const handleAddMember = async (data: {
    teamId: string;
    email: string;
    title?: string;
  }) => {
    await addMember.mutateAsync(data);
    setAddMemberModalOpen(false);
  };

  const handleDeleteTeam = async () => {
    try {
      await deleteTeam.mutateAsync(params.teamId);
      router.push("/dashboard/teams");
    } catch (err) {
      console.error("Error deleting team:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="loader">
        <Loader size="base" label="Loading..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Alert data-slot="alert" variant="destructive">
          <AlertCircle className="size-4" />
          <p className="text-sm">
            {error instanceof Error ? error.message : "An error occurred"}
          </p>
        </Alert>
        <Button
          data-slot="button"
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="size-4" />
          Go Back
        </Button>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Alert data-slot="alert" variant="destructive">
          <AlertCircle className="size-4" />
          <p className="text-sm">Team not found</p>
        </Alert>
        <Button
          data-slot="button"
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="size-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageBreadcrumbs
        items={[
          { href: "/dashboard/teams", label: "Teams" },
          { label: team.name },
        ]}
      />
      <PageHeader
        title={team.name}
        caption={`${team.teamFunction?.name || "No function"} | ${
          team.members?.length || 0
        } members`}
        backButton={{
          onClick: () => router.push("/dashboard/teams"),
        }}
        actions={
          <>
            <Button
              data-slot="button"
              onClick={() => setAddMemberModalOpen(true)}
              className="gap-2"
            >
              <UserPlus className="size-4" />
              Add Member
            </Button>
            <DropdownMenu data-slot="dropdown-menu">
              <DropdownMenuTrigger data-slot="dropdown-menu-trigger" asChild>
                <Button
                  data-slot="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                >
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent data-slot="dropdown-menu-content" align="end">
                <DropdownMenuItem
                  data-slot="dropdown-menu-item"
                  onClick={() => setEditModalOpen(true)}
                >
                  <PenSquare className="size-4 mr-2" />
                  Team Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-slot="dropdown-menu-item"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="size-4 mr-2" />
                  Delete Team
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

      <main className="layout-page-main">
        {!team.members?.length || !performanceData?.members?.length ? (
          <EmptyTeamView onAddMember={() => setAddMemberModalOpen(true)} />
        ) : (
          <TeamPerformanceSummary
            teamId={team.id}
            teamName={team.name}
            members={performanceData.members}
            viewType={viewType}
            onViewChange={setViewType}
          />
        )}
      </main>

      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setAddMemberModalOpen(false)}
        teamId={params.teamId}
      />

      <TeamEditModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        teamName={team.name}
        teamDescription={team.description}
        onSave={handleSaveTeamDetails}
      />

      <AlertDialog
        data-slot="alert-dialog"
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent data-slot="alert-dialog-content">
          <AlertDialogHeader data-slot="alert-dialog-header">
            <AlertDialogTitle data-slot="alert-dialog-title">
              Delete Team
            </AlertDialogTitle>
            <AlertDialogDescription data-slot="alert-dialog-description">
              Are you sure you want to delete this team? This action cannot be
              undone. All team members, activities, and performance data will be
              permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter data-slot="alert-dialog-footer">
            <AlertDialogCancel data-slot="alert-dialog-cancel">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-slot="alert-dialog-action"
              onClick={handleDeleteTeam}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
