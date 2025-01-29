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

const NoTeamsContent = ({ onCreateTeam }: { onCreateTeam: () => void }) => (
  <Card>
    <CardContent className="py-8">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <div className="mx-auto size-12 rounded-full bg-primary-weakest p-sm">
            <Users className="size-6 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-display-1 text-strongest">
              Welcome to UpScore
            </h2>
            <p className="text-weak max-w-xl mx-auto">
              Get started by following these steps:
            </p>
          </div>
        </div>

        <div className="grid gap-4 max-w-[1000px] mx-auto">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Users,
                title: "1. Create a Team",
                description:
                  "Start by creating your first team and adding team members",
              },
              {
                icon: Target,
                title: "2. Configure Initiatives",
                description: "Set up performance initiatives for your team",
              },
              {
                icon: Star,
                title: "3. Rate Performance",
                description:
                  "Add ratings and track member performance on initiatives",
              },
              {
                icon: MessageSquare,
                title: "4. Provide Feedback",
                description: "Give detailed feedback to help members improve",
              },
            ].map(({ icon: Icon, title, description }) => (
              <Card key={title} size="sm">
                <CardContent>
                  <div className="flex flex-col items-center space-y-sm">
                    <div className="size-8 rounded-full bg-primary-weakest p-2">
                      <Icon className="size-4 text-primary" />
                    </div>
                    <div className="space-y-xxs">
                      <h3 className="text-heading-4 text-strongest">{title}</h3>
                      <p className="text-body-small text-weakest text-center">
                        {description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="neutral"
            leadingIcon={<MessageSquare className="size-4" />}
            onClick={() => router.push("/dashboard/feedback")}
          >
            Add Feedback
          </Button>
          <Button
            variant="primary"
            leadingIcon={<Star className="size-4" />}
            onClick={onAddRating}
          >
            Rate Performance
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-end">
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
  );
};

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
        headers: { "Content-Type": "application/json" },
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            initiativeId: data.initiativeId,
            rating: data.rating,
            feedback: data.feedback,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to save rating");
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
