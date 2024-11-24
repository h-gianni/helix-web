"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import { Users, Target, User, PenSquare } from "lucide-react";
import { InitiativesSection } from "./_initiativesSection";
import { ProfileSection } from "./_profileSelection";
import type { TeamResponse, InitiativeResponse } from "@/lib/types/api";
import { TeamInitiative } from "@/lib/types/intiative";

interface TeamWithDescription extends TeamResponse {
  description?: string | null;
}

export default function SettingsPage() {
  const [teams, setTeams] = useState<TeamWithDescription[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<TeamWithDescription | null>(
    null
  );
  const [initiatives, setInitiatives] = useState<InitiativeResponse[]>([]);
  const [selectedInitiatives, setSelectedInitiatives] = useState<string[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(loading, error);
    const fetchData = async () => {
      try {
        setLoading(true);
        const [teamsRes, initiativesRes] = await Promise.all([
          fetch("/api/teams"),
          fetch("/api/initiatives"),
        ]);

        const teamsData = await teamsRes.json();
        const initiativesData = await initiativesRes.json();

        if (teamsData.success && initiativesData.success) {
          setTeams(teamsData.data);
          setInitiatives(initiativesData.data);

          if (teamsData.data.length > 0) {
            setSelectedTeam(teamsData.data[0]);
            await fetchTeamInitiatives(teamsData.data[0].id);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchTeamInitiatives = async (teamId: string) => {
    try {
      const response = await fetch(`/api/teams/${teamId}/initiatives`);
      const data = await response.json();

      if (data.success) {
        setSelectedInitiatives(
          data.data.map((ti: TeamInitiative) => ti.initiativeId)
        );
      }
    } catch (err) {
      console.error("Error fetching team initiatives:", err);
    }
  };

  const handleTeamSelect = async (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    if (team) {
      setSelectedTeam(team);
      await fetchTeamInitiatives(teamId);
    }
  };

  const handleInitiativeToggle = async (initiativeId: string) => {
    const updatedSelectedInitiatives = selectedInitiatives.includes(
      initiativeId
    )
      ? selectedInitiatives.filter((id) => id !== initiativeId)
      : [...selectedInitiatives, initiativeId];

    setSelectedInitiatives(updatedSelectedInitiatives);

    // Automatically save changes
    if (selectedTeam) {
      try {
        await fetch(`/api/teams/${selectedTeam.id}/initiatives`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initiativeIds: updatedSelectedInitiatives }),
        });
      } catch (err) {
        console.error("Error saving initiatives:", err);
      }
    }
  };

  const handleSelectAll = async () => {
    const allInitiativeIds = initiatives.map((initiative) => initiative.id);
    setSelectedInitiatives(allInitiativeIds);

    // Automatically save all selections
    if (selectedTeam) {
      try {
        await fetch(`/api/teams/${selectedTeam.id}/initiatives`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initiativeIds: allInitiativeIds }),
        });
      } catch (err) {
        console.error("Error saving initiatives:", err);
      }
    }
  };

  const handleSaveTeamDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;

    try {
      const response = await fetch(`/api/teams/${selectedTeam.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName.trim(),
          description: teamDescription.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update team");
      }

      setTeams(
        teams.map((team) =>
          team.id === selectedTeam.id
            ? { ...team, name: teamName, description: teamDescription }
            : team
        )
      );
      setSelectedTeam({
        ...selectedTeam,
        name: teamName,
        description: teamDescription,
      });
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error updating team:", err);
    }
  };

  const TeamManagementContent = () => (
    <div className="space-y-6">
      {teams.length > 1 && (
        <div>
          <label className="text-sm font-medium mb-1 block">Select Team</label>
          <Select value={selectedTeam?.id} onValueChange={handleTeamSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select a team" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedTeam && (
        <>
          <Card>
            <CardHeader>
              <div>
                <label className="text-sm font-medium block">Team Name</label>
                <CardTitle>{selectedTeam.name}</CardTitle>
                <label className="text-sm font-medium mt-4 block">
                  Team Description
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedTeam.description || "No description available"}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setTeamName(selectedTeam.name);
                  setTeamDescription(selectedTeam.description || "");
                  setIsEditModalOpen(true);
                }}
              >
                <PenSquare className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Initiatives</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                The selected initiatives are associated with this team&apos;s
                member performance rating.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <button
                  onClick={handleSelectAll}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Select All
                </button>
                {initiatives.map((initiative) => (
                  <div
                    key={initiative.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`initiative-${initiative.id}`}
                      checked={selectedInitiatives.includes(initiative.id)}
                      onCheckedChange={() =>
                        handleInitiativeToggle(initiative.id)
                      }
                    />
                    <label
                      htmlFor={`initiative-${initiative.id}`}
                      className="text-sm font-medium"
                    >
                      {initiative.name}
                    </label>
                  </div>
                ))}
              </div>
              <button
                onClick={() =>
                  (window.location.href = "/dashboard/settings?tab=initiatives")
                }
                className="text-blue-600 hover:underline text-sm mt-4 block"
              >
                Need more initiatives?
              </button>
              {selectedInitiatives.length < 5 && (
                <p className="text-red-500 text-sm mt-2">
                  Please select at least 5 initiatives.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="teams">
        <TabsList>
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Teams
          </TabsTrigger>
          <TabsTrigger value="initiatives" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Initiatives
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="mt-6">
          <TeamManagementContent />
        </TabsContent>

        <TabsContent value="initiatives" className="mt-6">
          <InitiativesSection onUpdate={() => {}} />
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <ProfileSection />
        </TabsContent>
      </Tabs>

      {/* Edit Team Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveTeamDetails} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Team Name</label>
              <Input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                placeholder="Enter team description"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
