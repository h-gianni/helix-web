"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageBreadcrumbs } from "@/components/ui/composite/AppHeader";
import { PageHeader } from "@/components/ui/composite/PageHeader";
import { Button } from "@/components/ui/core/Button";
import { Loader } from "@/components/ui/core/Loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
import { Alert } from "@/components/ui/core/Alert";
import {
  UserPlus,
  Trash2,
  Pen,
  ArrowLeft,
  MoreVertical,
  AlertCircle,
  Settings,
} from "lucide-react";
import { AddMemberModal } from "@/app/dashboard/components/teams/team/TeamAddMemberModal";
import { TeamPerformanceSummary } from "@/app/dashboard/components/teams/team/TeamPerformanceSummary";
import EmptyTeamView from "@/app/dashboard/components/teams/team/TeamEmptyView";
import { TeamEditModal } from "@/app/dashboard/components/teams/team/TeamEditModal";
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

  // Create state for effective view type (to handle mobile responsiveness)
  const [effectiveViewType, setEffectiveViewType] = useState<"table" | "grid">(
    viewType
  );

  // Update view type based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Force card view on mobile
        setEffectiveViewType("grid");
      } else {
        // Use user's selected view on desktop
        setEffectiveViewType(viewType);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, [viewType]);

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

  // Handle view change
  const handleViewChange = (newViewType: "table" | "grid") => {
    setViewType(newViewType);

    // Only apply if not on mobile
    if (window.innerWidth >= 768) {
      setEffectiveViewType(newViewType);
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
              variant="outline"
              onClick={() => setAddMemberModalOpen(true)}
            >
              <UserPlus />
              Add Member
            </Button>
            <Button
              data-slot="button"
              variant="outline"
              onClick={() => setEditModalOpen(true)}
            >
              <Settings />
              Team Settings
            </Button>
            <DropdownMenu data-slot="dropdown-menu">
              <DropdownMenuTrigger data-slot="dropdown-menu-trigger" asChild>
                <Button data-slot="button" variant="outline" icon>
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                data-slot="dropdown-menu-content"
                align="end"
              >
                <DropdownMenuItem
                  data-slot="dropdown-menu-item"
                  onClick={() => setEditModalOpen(true)}
                >
                  <Settings />
                  Team Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-slot="dropdown-menu-item"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 />
                  Delete Team
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

      <div className="bg-neutral-100 h-64 flex flex-col items-center justify-center my-2 rounded-xl">Team Statistics</div>

      {!team.members?.length || !performanceData?.members?.length ? (
        <EmptyTeamView onAddMember={() => setAddMemberModalOpen(true)} />
      ) : (
        <TeamPerformanceSummary
          teamId={team.id}
          teamName={team.name}
          members={performanceData.members}
          viewType={viewType}
          onViewChange={handleViewChange}
        />
      )}

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
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
