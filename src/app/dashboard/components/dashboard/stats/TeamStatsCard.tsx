"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/core/Card";
import { TrendingUp, TrendingDown, MoveRight } from "lucide-react";
import type { Member } from "@/store/member";
import type { TeamResponse } from "@/lib/types/api";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  trendLabel?: string;
}

function StatCard({ title, value, trend, trendValue, trendLabel }: StatCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-rose-500" />;
      case "neutral":
        return <MoveRight className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-emerald-500";
      case "down":
        return "text-rose-500";
      case "neutral":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="">
      <div className="flex flex-col gap-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
        </div>
        <div className="mt-1">
          <span className="heading-1">{value}</span>
        </div>
        {(trendLabel || trend) && (
          <div className="flex items-center gap-1 body-sm text-foreground-weak">
            {trend && (
              <>
                {getTrendIcon()}
                {trendValue && <span className={`text-xs font-medium ${getTrendColor()}`}>{trendValue}</span>}
              </>
            )}
            {trendLabel && <span>{trendLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

interface TeamStatsCardProps {
  teams: TeamResponse[];
  performers: Member[];
  previousStats?: {
    teamsCount: number;
    membersCount: number;
    averageRating: number;
    notRatedCount: number;
  };
}

export function TeamStatsCard({ teams, performers, previousStats }: TeamStatsCardProps) {
  // Calculate average rating
  const ratedPerformers = performers.filter(p => p.ratingsCount > 0);
  const averageRating = ratedPerformers.length > 0
    ? (ratedPerformers.reduce((sum, p) => sum + p.averageRating, 0) / ratedPerformers.length).toFixed(1)
    : "N/A";
  
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

  return (
    <Card>
      <CardContent className="py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-200">
          <div className="pr-4">
            <StatCard
              title="Total Teams"
              value={teams.length}
              trend={calculateTrend(teams.length, previousStats?.teamsCount)}
              trendValue={calculateTrendValue(teams.length, previousStats?.teamsCount)}
              trendLabel="vs last period"
            />
          </div>
          <div className="px-4">
            <StatCard
              title="Total Members"
              value={performers.length}
              trend={calculateTrend(performers.length, previousStats?.membersCount)}
              trendValue={calculateTrendValue(performers.length, previousStats?.membersCount)}
              trendLabel="vs last period"
            />
          </div>
          <div className="px-4">
            <StatCard
              title="Avg Rating"
              value={averageRating}
              trend={typeof averageRating === 'string' ? undefined : 
                calculateTrend(parseFloat(averageRating), previousStats?.averageRating)}
              trendValue={typeof averageRating === 'string' ? undefined : 
                calculateTrendValue(parseFloat(averageRating), previousStats?.averageRating)}
              trendLabel="vs last period"
            />
          </div>
          <div className="pl-4">
            <StatCard
              title="Not Rated"
              value={notRatedCount}
              trend={calculateTrend(notRatedCount, previousStats?.notRatedCount)}
              trendValue={calculateTrendValue(notRatedCount, previousStats?.notRatedCount)}
              trendLabel="vs last period"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}