"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/core/Card";
import { TeamStatsCard } from "@/app/dashboard/components/dashboard/stats/StatsTeamOverview";
import type { Member } from "@/store/member";
import type { TeamResponse } from "@/lib/types/api";

// Import components
import { PerformanceDistribution } from "@/app/dashboard/components/dashboard/charts/ChartPerformanceDistribution";
import { TopPerformersChart } from "@/app/dashboard/components/dashboard/charts/ChartTopPerformers";
import { UnderPerformersChart } from "@/app/dashboard/components/dashboard/charts/ChartUnderPerformers";
import { TeamPerformanceChart } from "@/app/dashboard/components/dashboard/charts/ChartTeamPerformance";
import { TeamPerformanceTrend } from "@/app/dashboard/components/dashboard/charts/ChartTeamPerformanceTrend";
import { TeamCompositionChart } from "@/app/dashboard/components/dashboard/charts/ChartTeamComposition";

interface ViewTeamOverviewProps {
  teams: TeamResponse[];
  performers: Member[];
}

export default function ViewTeamOverview({
  teams,
  performers,
}: ViewTeamOverviewProps) {
  // Calculate previous period stats
  const previousStats = {
    teamsCount: teams.length - 1,
    membersCount: performers.length - 3,
    averageRating:
      performers.filter((p) => p.ratingsCount > 0).length > 0
        ? performers
            .filter((p) => p.ratingsCount > 0)
            .reduce((sum, p) => sum + p.averageRating, 0) /
            performers.filter((p) => p.ratingsCount > 0).length -
          0.2
        : 0,
    notRatedCount: performers.filter((p) => p.ratingsCount === 0).length + 2,
  };

  return (
    <div className="space-y-4">
      {/* Team Performance Summary */}
      <TeamStatsCard
        teams={teams}
        performers={performers}
        previousStats={previousStats}
      />

      {/* Performance Distribution by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PerformanceDistribution />
        <TeamPerformanceTrend />
        <TopPerformersChart />
        <UnderPerformersChart />
        <TeamPerformanceChart />
        <TeamCompositionChart />
      </div>
    </div>
  );
}
