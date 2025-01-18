"use client";

import React, { useEffect, useState } from "react";
import { PageBreadcrumbs } from "@/app/dashboard/_component/_appHeader";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Users, Target, Star, MessageSquare, Plus } from "lucide-react";
import TeamCreateModal from "../dashboard/teams/_teamCreateModal";
import PerformanceRatingModal from "./_component/_performanceRatingModal";
import {
  PerformersByCategory,
  performanceCategories,
  ViewSwitcher,
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

const breadcrumbItems = [{ label: "Dashboard" }];

// Empty State Component
const NoTeamsContent = ({ onCreateTeam }: { onCreateTeam: () => void }) => (
  <Card size="default" background={true} border={true}>
    <CardContent>
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <div className="bg-primary-50 rounded-full p-3 size-12 mx-auto">
            <Users className="size-6 text-primary-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-display-1">Welcome to UpScore</h2>
            <p className="max-w-xl mx-auto">
              Get started by following these steps:
            </p>
          </div>
        </div>

        <div className="grid gap-4 max-w-[1000px] mx-auto">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card size="sm" border={true} shadow="sm">
              <CardContent>
                <div className="flex flex-col justify-center space-y-2">
                  <div className="bg-primary-25 rounded-full p-2 size-8 mx-auto">
                    <Users className="size-4 text-primary-600" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-heading-4">1. Create a Team</h3>
                    <p className="text-p-small">
                      Start by creating your first team and adding team members
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card size="sm" border={true} shadow="sm">
              <CardContent>
                <div className="flex flex-col justify-center space-y-2">
                  <div className="bg-primary-25 rounded-full p-2 size-8 mx-auto">
                    <Target className="size-4 text-primary-600" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-heading-4">2. Configure Initiatives</h3>
                    <p className="text-p-small">
                      Set up performance initiatives for your team
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card size="sm" border={true} shadow="sm">
              <CardContent>
                <div className="flex flex-col justify-center space-y-2">
                  <div className="bg-primary-25 rounded-full p-2 size-8 mx-auto">
                    <Star className="size-4 text-primary-600" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-heading-4">3. Rate Performance</h3>
                    <p className="text-p-small">
                      Add ratings and track member performance on initiatives
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card size="sm" border={true} shadow="sm">
              <CardContent>
                <div className="flex flex-col justify-center space-y-2">
                  <div className="bg-primary-25 rounded-full p-2 size-8 mx-auto">
                    <MessageSquare className="size-4 text-primary-600" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-heading-4">4. Provide Feedback</h3>
                    <p className="text-p-small">
                      Give detailed feedback to help members improve
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              variant="primary"
              onClick={onCreateTeam}
              leadingIcon={<Plus className="size-4" />}
            >
              Create Your First Team
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Teams Content Component
const TeamsContent = ({
  performers,
  teams,
  onAddRating,
  router,
  initialViewType,
}: {
  performers: Performer[];
  teams: TeamResponse[];
  onAddRating: () => void;
  router: ReturnType<typeof useRouter>;
  initialViewType: "table" | "grid";
}) => {
  const [viewType, setViewType] = useState<"table" | "grid">(initialViewType);
  const [isLoadingPerformers, setIsLoadingPerformers] = useState(true);

  useEffect(() => {
    if (performers.length > 0) {
      setIsLoadingPerformers(false);
    }
  }, [performers]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-display-1">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button
            size="default"
            variant="neutral"
            appearance="default"
            leadingIcon={<MessageSquare />}
            onClick={() => router.push("/dashboard/feedback")}
          >
            Add Feedback on Member
          </Button>
          <Button
            size="default"
            variant="primary"
            appearance="default"
            leadingIcon={<Star />}
            onClick={onAddRating}
          >
            Rate Member Performance
          </Button>
        </div>
      </div>

      {/* Performance Categories */}
      <div>
        <div className="space-y-4">
          <div className="flex gap-4 justify-end">
            <ViewSwitcher viewType={viewType} onViewChange={setViewType} />
          </div>
          {performanceCategories.map((category) => (
            <PerformersByCategory
              key={category.label}
              category={category}
              performers={performers}
              teams={teams}
              isLoading={isLoadingPerformers}
              viewType={viewType}
              onViewChange={setViewType}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Page Component
export default function DashboardPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<TeamResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [viewType, setViewType] = useState<"table" | "grid">("table");

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

      await fetchPerformers();
      setIsRatingModalOpen(false);
    } catch (error) {
      console.error("Error saving rating:", error);
      throw error;
    }
  };

  if (loading) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  return (
    <>
      <PageBreadcrumbs items={breadcrumbItems} />
      {teams.length === 0 ? (
        <NoTeamsContent onCreateTeam={() => setIsCreateModalOpen(true)} />
      ) : (
        <TeamsContent
          performers={performers}
          teams={teams}
          onAddRating={() => setIsRatingModalOpen(true)}
          router={router}
          initialViewType={viewType}
        />
      )}

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
    </>
  );
}
