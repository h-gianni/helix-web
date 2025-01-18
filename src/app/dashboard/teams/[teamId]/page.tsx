"use client";

import React, { useEffect, useState, useCallback, MouseEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import AddMemberModal from "./_addMemberModal";
import { MemberPerformance } from "@/app/dashboard/types/member";
import { PageBreadcrumbs } from "@/app/dashboard/_component/_appHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
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
import { TeamPerformanceSummary } from "./_teamPerformanceSummary";
import EmptyTeamView from "./_emptyTeamView";
import TeamEditModal from "./_teamEditModal";
import { Label } from "@/components/ui/Label";
import type { ApiResponse, TeamDetailsResponse } from "@/lib/types/api";
import { useTeams } from "@/lib/context/teams-context";

interface PageParams {
  teamId: string;
  [key: string]: string;
}

export default function TeamDetailsPage({
  params,
}: {
  params: { teamId: string };
}) {
  const router = useRouter();
  const { fetchTeams } = useTeams();
  const [team, setTeam] = useState<TeamDetailsResponse | null>(null);
  const [performanceData, setPerformanceData] = useState<{
    members: MemberPerformance[];
  }>({ members: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addMemberEmail, setAddMemberEmail] = useState("");
  const [addMemberTitle, setAddMemberTitle] = useState("");
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
      if (data.success) {
        setPerformanceData(data.data);
      }
    } catch (error) {
      console.error("Error fetching performance data:", error);
    }
  };

  const fetchTeamDetails = useCallback(
    async (showRefreshIndicator = true) => {
      if (!params.teamId) {
        setError("Team ID is missing");
        return;
      }

      try {
        if (showRefreshIndicator) {
          setIsRefreshing(true);
        }
        setError(null);

        const response = await fetch(
          `/api/teams/${params.teamId}?t=${new Date().getTime()}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse<TeamDetailsResponse> = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch team details");
        }

        setTeam(data.data || null);
        fetchTeamPerformance();
      } catch (err) {
        console.error("Error fetching team details:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [params.teamId]
  );

  const handleSaveTeamDetails = async (
    name: string,
    description: string | null
  ) => {
    try {
      const response = await fetch(`/api/teams/${params.teamId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        throw new Error("Failed to update team");
      }

      const data = await response.json();
      if (data.success) {
        await fetchTeamDetails();
      }
    } catch (error) {
      console.error("Error updating team:", error);
      throw error;
    }
  };

  const handleAddMember = async (data: {
    teamId: string;
    email: string;
    title?: string;
  }) => {
    try {
      const response = await fetch(`/api/teams/${data.teamId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          title: data.title,
        }),
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

  const handleDeleteTeam = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      const response = await fetch(`/api/teams/${params.teamId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to delete team");
      }

      await fetchTeams(); // Fetch updated teams list before redirecting
      router.push("/dashboard/teams"); // Redirect after successful deletion and data refresh
    } catch (error) {
      console.error("Error deleting team:", error);
      // Handle error appropriately
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchTeamDetails(false);
  }, [fetchTeamDetails]);

  // Refresh on window focus
  useEffect(() => {
    const handleFocus = () => {
      fetchTeamDetails(false);
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchTeamDetails]);

  if (loading) {
    return <div className="p-4">Loading team details...</div>;
  }

  if (error) {
    return (
      <>
        <Alert variant="danger">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button
          variant="primary"
          onClick={() => router.back()}
          leadingIcon={<RotateCcw className="size-4" />}
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
          leadingIcon={<RotateCcw className="size-4" />}
        >
          Go Back
        </Button>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumbs items={breadcrumbItems} />
      
      {/* Header */}
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
              <h1 className="text-display-1">{team.name}</h1>
              {team.description && (
                <p className="text-p-small mt-1">{team.description}</p>
              )}
              <p className="text-p-small mt-1">
                Created: {new Date(team.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <AddMemberModal
              isOpen={isAddMemberDialogOpen}
              onClose={() => setIsAddMemberDialogOpen(false)}
              teamId={params.teamId}
              onSubmit={handleAddMember}
            />
            <Button
              variant="primary"
              onClick={() => setIsAddMemberDialogOpen(true)}
              leadingIcon={<UserPlus className="size-4" />}
            >
              Add Member
            </Button>
  
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="neutral"
                  appearance="icon-only"
                  size="default"
                  leadingIcon={<EllipsisVertical className="size-4" />}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                  <PenSquare className="size-4 mr-2" />
                  Edit Team
                </DropdownMenuItem>
                <DropdownMenuItem
                  destructive
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="size-4 mr-2" />
                  Delete Team
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
  
      {/* Content */}
      {!team.members ||
      team.members.length === 0 ||
      !performanceData.members ||
      performanceData.members.length === 0 ? (
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
  
      {/* Team Edit Modal */}
      <TeamEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        teamName={team.name}
        teamDescription={team.description}
        onSave={handleSaveTeamDetails}
      />
  
      {/* Delete Team Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent variant="danger" withIcon>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this team? This action cannot be
              undone. All team members, initiatives, and performance data will
              be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTeam} variant="danger">
              Delete Team
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
