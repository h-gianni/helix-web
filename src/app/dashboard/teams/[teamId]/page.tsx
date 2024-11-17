// app/dashboard/teams/[teamId]/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { UserPlus, Trash2, RotateCcw, PenSquare } from "lucide-react";
import { TeamPerformanceSummary } from "./_teamPerformanceSummary";
import EmptyTeamView from "./_emptyTeamView";
import TeamEditModal from "./_teamEditModal";
import type { ApiResponse, TeamDetailsResponse } from "@/lib/types/api";

interface PageParams {
  teamId: string;
  [key: string]: string;
}

interface PerformanceData {
  id: string;
  name: string;
  title: string | null;
  averageRating: number;
  ratingsCount: number;
}

export default function TeamDetailsPage() {
  const params = useParams() as PageParams;
  const router = useRouter();
  const [team, setTeam] = useState<TeamDetailsResponse | null>(null);
  const [performanceData, setPerformanceData] = useState<{
    members: PerformanceData[];
  }>({ members: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addMemberEmail, setAddMemberEmail] = useState("");
  const [addMemberTitle, setAddMemberTitle] = useState("");
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleAddMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const trimmedEmail = addMemberEmail.trim();
      const trimmedTitle = addMemberTitle.trim();

      if (!trimmedEmail) {
        throw new Error("Email is required");
      }

      const response = await fetch(`/api/teams/${params.teamId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          title: trimmedTitle || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to add member");
      }

      setIsAddMemberDialogOpen(false);
      setAddMemberEmail("");
      setAddMemberTitle("");
      await fetchTeamDetails();
    } catch (err) {
      console.error("Error adding member:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleDeleteTeam = async () => {
    try {
      const response = await fetch(`/api/teams/${params.teamId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        router.push("/dashboard/teams");
      } else {
        throw new Error(data.error || "Failed to delete team");
      }
    } catch (err) {
      console.error("Error deleting team:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
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
      <div className="p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="p-4">
        <div className="mb-4">Team not found</div>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{team.name}</h1>
            {team.description && (
              <p className="text-sm text-gray-500 mt-1">{team.description}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Created: {new Date(team.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/teams")}
            >
              Back to Teams
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchTeamDetails()}
              disabled={isRefreshing}
            >
              <RotateCcw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>

            <Dialog
              open={isAddMemberDialogOpen}
              onOpenChange={setIsAddMemberDialogOpen}
            >
              <Button onClick={() => setIsAddMemberDialogOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Team Member</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddMember} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={addMemberEmail}
                      onChange={(e) => setAddMemberEmail(e.target.value)}
                      placeholder="member@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Title (Optional)
                    </label>
                    <Input
                      type="text"
                      value={addMemberTitle}
                      onChange={(e) => setAddMemberTitle(e.target.value)}
                      placeholder="e.g., Developer"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddMemberDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!addMemberEmail.trim()}>
                      Add Member
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
              <PenSquare className="w-4 h-4 mr-2" />
              Edit Team
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Team
            </Button>
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this team? This action cannot be
              undone. All team members, initiatives, and performance data will
              be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogAction>
            <AlertDialogAction
              onClick={handleDeleteTeam}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete Team
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
