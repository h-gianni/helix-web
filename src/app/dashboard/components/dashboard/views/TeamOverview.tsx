"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/core/Card";
import { TeamStatsCard } from "@/app/dashboard/components/dashboard/stats/TeamStatsCard"; 
import type { Member } from "@/store/member";
import type { TeamResponse } from "@/lib/types/api";

// Import components
import * as PerfDist from "@/app/dashboard/components/dashboard/charts/ChartPerformanceDistribution";
import * as TopPerf from "@/app/dashboard/components/dashboard/charts/ChartTopPerformers";
import * as TeamPerf from "@/app/dashboard/components/dashboard/charts/ChartTeamPerformance";
import * as TeamTrend from "@/app/dashboard/components/dashboard/charts/ChartTeamPerformanceTrend";
import * as TeamComp from "@/app/dashboard/components/dashboard/charts/ChartTeamComposition";

// Create typed wrappers
const PerformanceDistribution = (props: { performers: Member[] }) => 
  React.createElement(PerfDist.PerformanceDistribution, props);

const TopPerformersChart = (props: { performers: Member[] }) => 
  React.createElement(TopPerf.TopPerformersChart, props);

const TeamPerformanceChart = (props: { teams: TeamResponse[], performers: Member[] }) => 
  React.createElement(TeamPerf.TeamPerformanceChart, props);

const TeamPerformanceTrend = (props: { teams: TeamResponse[] }) => 
  React.createElement(TeamTrend.TeamPerformanceTrend, props);

const TeamCompositionChart = (props: { teams: TeamResponse[], performers: Member[] }) => 
  React.createElement(TeamComp.TeamCompositionChart, props);

interface TeamOverviewTabProps {
  teams: TeamResponse[];
  performers: Member[];
}

export default function TeamOverviewTab({ teams, performers }: TeamOverviewTabProps) {
  // Calculate previous period stats
  const previousStats = {
    teamsCount: teams.length - 1,
    membersCount: performers.length - 3,
    averageRating: performers.filter(p => p.ratingsCount > 0).length > 0
      ? (performers.filter(p => p.ratingsCount > 0).reduce((sum, p) => sum + p.averageRating, 0) / 
         performers.filter(p => p.ratingsCount > 0).length) - 0.2
      : 0,
    notRatedCount: performers.filter(p => p.ratingsCount === 0).length + 2
  };

  return (
    <div className="space-y-4">
      {/* Team Performance Summary */}
      <TeamStatsCard teams={teams} performers={performers} previousStats={previousStats} />
      
      {/* Performance Distribution by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PerformanceDistribution performers={performers} />
        <TopPerformersChart performers={performers} />
        <TeamPerformanceChart teams={teams} performers={performers} />
        <TeamPerformanceTrend teams={teams} />
      </div>
      
      <TeamCompositionChart teams={teams} performers={performers} />
    </div>
  );
}