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
  IconWrapper,
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
  RotateCcw,
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

export default function TeamDetailsPage({
  params,
}: {
  params: { teamId: string };
}) {
  const router = useRouter();
  const { fetchTeams } = useTeams();
  const [team, setTeam] = useState<TeamDetailsResponse | null>(null);
  const [performanceData, setPerformanceData] = useState<{ members: MemberPerformance[] }>({ members: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewType, setViewType] = useState<"table" | "grid">("table");

  const breadcrumbItems = [
    { href: "/dashboard/teams", label: "Teams" },
    { label: team?.name || "Team Details" },
  ];

  const fetchTeamPerformance = async () => {
    try {
      const response = await fetch(`/api/teams/${params.teamId}/performance`);
      const data = await response.json();
      if (data.success) setPerformanceData(data.data);
    } catch (error) {
      console.error("Error fetching performance data:", error);
    }
  };

  const fetchTeamDetails = useCallback(async (showRefreshIndicator = true) => {
    if (!params.teamId) {
      setError("Team ID is missing");
      return;
    }

    try {
      if (showRefreshIndicator) setIsRefreshing(true);
      setError(null);

      const response = await fetch(`/api/teams/${params.teamId}?t=${Date.now()}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data: ApiResponse<TeamDetailsResponse> = await response.json();
      if (!data.success) throw new Error(data.error || "Failed to fetch team details");

      setTeam(data.data || null);
      fetchTeamPerformance();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [params.teamId]);

  const handleSaveTeamDetails = async (name: string, description: string | null) => {
    try {
      const response = await fetch(`/api/teams/${params.teamId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) throw new Error("Failed to update team");

      const data = await response.json();
      if (data.success) await fetchTeamDetails();
    } catch (error) {
      console.error("Error updating team:", error);
      throw error;
    }
  };

  const handleAddMember = async (data: { teamId: string; email: string; title?: string; }) => {
    try {
      const response = await fetch(`/api/teams/${data.teamId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, title: data.title }),
      });

      const responseData = await response.json();
      if (!response.ok || !responseData.success) {
        throw new Error(responseData.error || "Failed to add member");
      }

      await fetchTeamDetails();
    } catch (err) {
      console.error("Error adding member:", err);
      throw err;
    }
  };

  const handleDeleteTeam = async () => {
    try {
      const response = await fetch(`/api/teams/${params.teamId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Failed to delete team");

      await fetchTeams();
      router.push("/dashboard/teams");
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  useEffect(() => {
    fetchTeamDetails(false);
  }, [fetchTeamDetails]);

  useEffect(() => {
    const handleFocus = () => fetchTeamDetails(false);
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchTeamDetails]);

  if (loading) return <div className="p-4">Loading team details...</div>;

  if (error) {
    return (
      <>
        <Alert variant="danger">
          <AlertCircle />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button
          iconOnly
          onClick={() => router.back()}
          leadingIcon={<ArrowLeft />}
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
      </>
    );
  }

  return (
    <>
      <PageBreadcrumbs items={breadcrumbItems} />
      
      <div className="mb-base">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Button
              variant="neutral"
              iconOnly
              size="sm"
              onClick={() => router.push("/dashboard/teams")}
              leadingIcon={<ArrowLeft />}
            />
            <div>
              <h1 className="text-2xl font-semibold">{team.name}</h1>
              {team.description && (
                <p className="text-muted-foreground mt-1">{team.description}</p>
              )}
              <p className="ui-text-body-caption">
                Team function | #members
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="primary"
              onClick={() => setIsAddMemberDialogOpen(true)}
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
     leadingIcon={<IconWrapper><EllipsisVertical /></IconWrapper>}
   />
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end">
   <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
     <IconWrapper><PenSquare /></IconWrapper>
     Team Settings
   </DropdownMenuItem>
   <DropdownMenuItem 
     destructive
     onClick={() => setIsDeleteDialogOpen(true)}
   >
     <IconWrapper><Trash2 /></IconWrapper>
     Delete Team
   </DropdownMenuItem>
 </DropdownMenuContent>
</DropdownMenu>
          </div>
        </div>
      </div>
  
      {!team.members?.length || !performanceData.members?.length ? (
        <EmptyTeamView onAddMember={() => setIsAddMemberDialogOpen(true)} />
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
        isOpen={isAddMemberDialogOpen}
        onClose={() => setIsAddMemberDialogOpen(false)}
        teamId={params.teamId}
        onSubmit={handleAddMember}
      />

      <TeamEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        teamName={team.name}
        teamDescription={team.description}
        onSave={handleSaveTeamDetails}
      />
  
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
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