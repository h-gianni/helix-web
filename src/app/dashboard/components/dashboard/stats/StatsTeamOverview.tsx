"use client";

import React from "react";
import { StatsCard, StatItemProps } from "@/components/ui/composite/StatsCard";
import type { Member } from "@/store/member";
import type { TeamResponse } from "@/lib/types/api";

interface TeamStatsCardProps {
  teams: TeamResponse[];
  performers: Member[];
  previousStats?: {
    totalScores: number;
    averageRating: number;
  };
}

export function TeamStatsCard({ teams, performers, previousStats }: TeamStatsCardProps) {
  // Calculate scores metrics
  const totalScores = performers.reduce((sum, p) => sum + p.ratingsCount, 0);
  
  // Calculate average rating
  const ratedPerformers = performers.filter(p => p.ratingsCount > 0);
  const averageRating = "N/A";
  
  // Calculate not rated count
  const notRatedCount = performers.filter(p => p.ratingsCount === 0).length;
  
  // Calculate trends
  const calculateTrend = (current: number, previous?: number) => {
    if (previous === undefined) return undefined;
    if (current > previous) return "up";
    if (current < previous) return "down";
    return "neutral";
  };

  const calculateTrendValue = (current: number, previous?: number) => {
    if (previous === undefined) return undefined;
    const diff = ((current - previous) / previous) * 100;
    return `${Math.abs(diff).toFixed(1)}%`;
  };

  const statsItems: StatItemProps[] = [
    {
      title: "Total teams/members",
      value: `${teams.length}/${performers.length}`,
    },
    {
      title: "Total scores",
      value: totalScores,
      trend: calculateTrend(totalScores, previousStats?.totalScores),
      trendValue: calculateTrendValue(totalScores, previousStats?.totalScores),
      // trendLabel: "vs last quarter"
    },
    {
      title: "Avg rating",
      value: averageRating,
      trend: undefined,
      trendValue: undefined,
      trendLabel: "vs last quarter"
    },
    {
      title: "Not rated",
      value: notRatedCount,
      // trendLabel: "Find opportunities to score their performance"
    }
  ];

  return <StatsCard items={statsItems} columns={4} withDividers={true} />;
}