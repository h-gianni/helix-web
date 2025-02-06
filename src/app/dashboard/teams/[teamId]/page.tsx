"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageBreadcrumbs } from "@/app/dashboard/_component/_appHeader";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/AlertDialog";
import { Alert, AlertDescription } from "@/components/ui/Alert";
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
import type { ApiResponse, TeamDetailsResponse } from "@/lib/types/api";
import { useTeams } from "@/lib/context/teams-context";
import { MemberPerformance } from "@/app/dashboard/types/member";
import { useAddTeamMember, useDeleteTeam, useTeamDetails, useTeamDetailsStore, useTeamPerformance, useUpdateTeam } from "@/store/team-store";

export default function TeamDetailsPage({
  params,
}: {
  params: { teamId: string };
}) {
  const router = useRouter();
  const { fetchTeams } = useTeams();

  const {
    isAddMemberModalOpen,
    isEditModalOpen,
    isDeleteDialogOpen,
    viewType,
    setAddMemberModalOpen,
    setEditModalOpen,
    setDeleteDialogOpen,
    setViewType
  } = useTeamDetailsStore();

  const { 
    data: team, 
    isLoading, 
    error 
  } = useTeamDetails(params.teamId);
  
  const { data: performanceData } = useTeamPerformance(params.teamId);
  const { mutate: updateTeam } = useUpdateTeam();
  const { mutate: addMember } = useAddTeamMember();
  const { mutate: deleteTeam } = useDeleteTeam();

  const breadcrumbItems = [
    { href: "/dashboard/teams", label: "Teams" },
    { label: team?.name || "Team Details" },
  ];

  const handleSaveTeamDetails = (name: string, description: string | null) => {
    updateTeam({ id: params.teamId, name, description });
  };

  const handleAddMember = (data: { teamId: string; email: string; title?: string }) => {
    addMember(data);
  };

  const handleDeleteTeam = () => {
    deleteTeam(params.teamId, {
      onSuccess: () => {
        fetchTeams();
        router.push('/dashboard/teams');
      }
    });
  };

  if (isLoading) return <div className="p-4">Loading team details...</div>;

  if (error) {
    return (
      <>
        <Alert variant="danger">
          <AlertCircle className="size-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
        <Button
          variant="primary"
          onClick={() => router.back()}
          leadingIcon={<ArrowLeft className="size-4" />}
        >
          Go Back
        </Button>
      </>
    );
  }

  if (!team) {
    return (
      <>
        <Alert variant="warning">
          <AlertCircle className="size-4" />
          <AlertDescription>Team not found</AlertDescription>
        </Alert>
        <Button
          variant="primary"
          onClick={() => router.back()}
          leadingIcon={<ArrowLeft className="size-4" />}
        >
          Go Back
        </Button>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumbs items={breadcrumbItems} />
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Button
              variant="neutral"
              appearance="icon-only"
              size="sm"
              onClick={() => router.push("/dashboard/teams")}
              leadingIcon={<ArrowLeft className="size-4" />}
            />
            <div>
              <h1 className="text-2xl font-semibold">{team.name}</h1>
              {team.description && (
                <p className="text-muted-foreground mt-1">{team.description}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                Created: {new Date(team.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="primary"
              onClick={() => setAddMemberModalOpen(true)}
              leadingIcon={<UserPlus className="size-4" />}
            >
              Add Member
            </Button>
  
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="neutral"
                  appearance="icon-only"
                  leadingIcon={<EllipsisVertical className="size-4" />}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditModalOpen(true)}>
                  <PenSquare className="size-4 mr-2" />
                  Edit Team
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-danger-600"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="size-4 mr-2" />
                  Delete Team
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
  
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
              undone. All team members, activites, and performance data will
              be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="danger" onClick={handleDeleteTeam}>
              Delete Team
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}