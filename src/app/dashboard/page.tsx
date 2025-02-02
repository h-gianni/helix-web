"use client";

import React, { useEffect, useState } from "react";
import { PageBreadcrumbs } from "@/app/dashboard/_component/_appHeader";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { MessageSquare, Star } from "lucide-react";
import TeamCreateModal from "../dashboard/teams/_teamCreateModal";
import PerformanceRatingModal from "./_component/_performanceRatingModal";
import EmptyDashboardView from "./_component/_emptyDashboardView";
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
            appearance="outline"
            onClick={() => router.push("/dashboard/feedback")}
            className="gap-2"
          >
            <MessageSquare />
            Add Feedback
          </Button>
          <Button
            variant="primary"
            onClick={onAddRating}
          >
            <Star />
            Rate Performance
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-end bg-surface-hollowed rounded-base p-sm border-t border-neutral-weak">
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

  const handleCreateTeam = async (name: string, teamFunctionId: string) => {
    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name,
          teamFunctionId,  // Updated from businessFunctionId to teamFunctionId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create team');
      }

      const data = await response.json();
      if (data.success) {
        setIsCreateModalOpen(false);
        router.push("/dashboard/teams");
      } else {
        throw new Error(data.error || 'Failed to create team');
      }
    } catch (error) {
      console.error("Error creating team:", error);
      throw error; // Re-throw to be handled by the modal
    }
  };

  const handleRatingSubmit = async (data: {
    teamId: string;
    memberId: string;
    activityId: string;
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
            activityId: data.activityId,
            value: data.rating, 
            feedback: data.feedback,
          }),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save rating");
      }
  
      const responseData = await response.json();
      if (!responseData.success) {
        throw new Error(responseData.error || "Failed to save rating");
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
        <EmptyDashboardView onCreateTeam={() => setIsCreateModalOpen(true)} />
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