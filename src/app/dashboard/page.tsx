"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Users, Target, Star, MessageSquare } from "lucide-react";
import TeamCreateModal from "../dashboard/teams/_teamCreateModal";
import PerformanceRatingModal from "./_component/_performanceRatingModal";
import {
  PerformersByCategory,
  performanceCategories,
} from "./_component/_performersByCategory";
import type { TeamResponse } from "@/lib/types/api";

interface Performer {
  id: string;
  name: string;
  title: string | null;
  teamId: string;
  teamName: string;
  averageRating: number;
  ratingsCount: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<TeamResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [performers, setPerformers] = useState<Performer[]>([]);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/teams");
      const data = await response.json();

      if (data.success) {
        setTeams(data.data);
        if (data.data.length > 0) {
          fetchPerformers();
        }
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformers = async () => {
    try {
      const response = await fetch("/api/dashboard/performers");
      const data = await response.json();

      if (data.success) {
        setPerformers(data.data.performers);
      }
    } catch (error) {
      console.error("Error fetching performers:", error);
    }
  };

  const handleCreateTeam = async (name: string) => {
    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (data.success) {
        setIsCreateModalOpen(false);
        router.push("/dashboard/teams");
      }
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const handleRatingSubmit = async (data: {
    teamId: string;
    memberId: string;
    initiativeId: string;
    rating: number;
    feedback?: string;
  }) => {
    try {
      const response = await fetch(
        `/api/teams/${data.teamId}/members/${data.memberId}/ratings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            initiativeId: data.initiativeId,
            rating: data.rating,
            feedback: data.feedback,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save rating");
      }

      // Only fetch performers data
      await fetchPerformers();
      setIsRatingModalOpen(false);
    } catch (error) {
      console.error("Error saving rating:", error);
      throw error;
    }
  };

  const NoTeamsContent = () => (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center space-y-6">
          <div className="bg-primary/5 rounded-full p-3 w-12 h-12 mx-auto">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Welcome to UpScore</h2>
            <p className="text-gray-500 max-w-[600px] mx-auto">
              Get started by following these steps:
            </p>
          </div>

          <div className="grid gap-6 max-w-[800px] mx-auto">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-4">
                <div className="flex gap-4">
                  <div className="bg-primary/10 rounded-lg p-2 h-fit">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">1. Create a Team</h3>
                    <p className="text-sm text-gray-500">
                      Start by creating your first team and adding team members
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex gap-4">
                  <div className="bg-primary/10 rounded-lg p-2 h-fit">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">2. Configure Initiatives</h3>
                    <p className="text-sm text-gray-500">
                      Set up performance initiatives for your team
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex gap-4">
                  <div className="bg-primary/10 rounded-lg p-2 h-fit">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">3. Rate Performance</h3>
                    <p className="text-sm text-gray-500">
                      Add ratings and track member performance on initiatives
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex gap-4">
                  <div className="bg-primary/10 rounded-lg p-2 h-fit">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">4. Provide Feedback</h3>
                    <p className="text-sm text-gray-500">
                      Give detailed feedback to help members improve
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button size="lg" onClick={() => setIsCreateModalOpen(true)}>
                <Users className="w-4 h-4 mr-2" />
                Create Your First Team
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const TeamsContent = () => {
    const [isLoadingPerformers] = useState(true);

    return (
      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/dashboard/feedback")}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Add Feedback on Member
          </Button>
          <Button size="lg" onClick={() => setIsRatingModalOpen(true)}>
            <Star className="w-4 h-4 mr-2" />
            Rate Member Performance
          </Button>
        </div>

        {/* Performance Categories */}
        <div>
          <div className="space-y-6">
            {performanceCategories.map((category) => (
              <PerformersByCategory
                key={category.title}
                category={category}
                performers={performers}
                isLoading={isLoadingPerformers}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  return (
    <div className="p-4">
      {teams.length === 0 ? <NoTeamsContent /> : <TeamsContent />}

      <TeamCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTeam={handleCreateTeam}
      />

      <PerformanceRatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onSubmit={handleRatingSubmit}
      />
    </div>
  );
}
