"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PageBreadcrumbs } from "@/components/ui/composite/AppHeader";
import { PageHeader } from "@/components/ui/composite/PageHeader";
import { Button } from "@/components/ui/core/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconWrapper,
} from "@/components/ui/core/DropdownMenu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/core/AlertDialog";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import {
  UserPlus,
  Trash2,
  PenSquare,
  AlertCircle,
  ArrowLeft,
  EllipsisVertical,
} from "lucide-react";
import AddMemberModal from "./_addMemberModal";
import { TeamPerformanceSummary } from "./_teamPerformanceSummary";
import EmptyTeamView from "./_emptyTeamView";
import TeamEditModal from "./_teamEditModal";
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

  // Queries
  const {
    data: team,
    isLoading: isTeamLoading,
    error: teamError,
  } = useTeamDetails(params.teamId);

  const {
    data: performanceData,
    isLoading: isPerformanceLoading,
  } = useTeamPerformance(params.teamId);

  // Mutations
  const updateTeam = useUpdateTeam();
  const deleteTeam = useDeleteTeam();
  const addMember = useAddTeamMember();

  const isLoading = isTeamLoading || isPerformanceLoading;
  const error = teamError;

  const handleSaveTeamDetails = async (name: string, description: string | null) => {
    try {
      await updateTeam.mutateAsync({ teamId: params.teamId, name, description });
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating team:", error);
      throw error;
    }
  };

  const handleAddMember = async (data: { teamId: string; email: string; title?: string }) => {
    try {
      await addMember.mutateAsync(data);
      setAddMemberModalOpen(false);
    } catch (error) {
      console.error("Error adding member:", error);
      throw error;
    }
  };

  const handleDeleteTeam = async () => {
    try {
      await deleteTeam.mutateAsync(params.teamId);
      router.push("/dashboard/teams");
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  if (isLoading) {
    return <div className="ui-loader">Loading team details...</div>;
  }

  if (error) {
    return (
      <div className="ui-loader-error">
        <Alert variant="danger">
          <AlertCircle />
          <AlertDescription>
            {error instanceof Error ? error.message : "An error occurred"}
          </AlertDescription>
        </Alert>
        <Button
          variant="primary"
          onClick={() => router.back()}
          leadingIcon={<ArrowLeft />}
        >
          Go Back
        </Button>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="ui-loader-error">
        <Alert variant="warning">
          <AlertCircle />
          <AlertDescription>Team not found</AlertDescription>
        </Alert>
        <Button
          variant="primary"
          onClick={() => router.back()}
          leadingIcon={<ArrowLeft />}
        >
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
        caption={`${team.teamFunction?.name || 'No function'} | ${team.members?.length || 0} members`}
        backButton={{
          onClick: () => router.push("/dashboard/teams"),
        }}
        actions={
          <>
            <Button
              variant="primary"
              onClick={() => setAddMemberModalOpen(true)}
              leadingIcon={<UserPlus />}
            >
              Add Member
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="neutral"
                  volume="soft"
                  iconOnly
                  leadingIcon={
                    <IconWrapper>
                      <EllipsisVertical />
                    </IconWrapper>
                  }
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditModalOpen(true)}>
                  <IconWrapper>
                    <PenSquare />
                  </IconWrapper>
                  Team Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  destructive
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <IconWrapper>
                    <Trash2 />
                  </IconWrapper>
                  Delete Team
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

      <main className="ui-layout-page-main">
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
        // onSubmit={handleAddMember}
      />

      <TeamEditModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        teamName={team.name}
        teamDescription={team.description}
        // onSave={handleSaveTeamDetails}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this team? This action cannot be
              undone. All team members, activities, and performance data will be
              permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Team</AlertDialogCancel>
            <AlertDialogAction variant="danger" onClick={handleDeleteTeam}>
              Delete Team
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}