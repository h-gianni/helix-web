// src/app/dashboard/components/teams/team/member/MemberScoresSection.tsx
"use client";

import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/core/Table";
import { Button } from "@/components/ui/core/Button";
import { 
  RotateCcw, 
  AlertCircle, 
  Star, 
  CalendarClock, 
  BarChart4, 
  TrendingUp,
  Activity
} from "lucide-react";
import StarRating from "@/components/ui/core/StarRating";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { Loader } from "@/components/ui/core/Loader";
import { useMemberRatings } from "@/store/member-store";
import { NoContentFound } from "@/components/ui/composite/NoContentFound";
import { StatsCard } from "@/components/ui/composite/StatsCard";

interface ScoresSectionProps {
  teamId: string;
  memberId: string;
  onAddRating: () => void;
}

// Type for the trend to match StatsCard requirements
type TrendType = "up" | "down" | "neutral" | undefined;

function ScoresSection({ teamId, memberId, onAddRating }: ScoresSectionProps) {
  const { data, isLoading, error, refetch } = useMemberRatings({
    teamId,
    memberId,
  });

  // Calculate score statistics from the ratings data
  const scoreStats = useMemo(() => {
    if (!data?.ratings || data.ratings.length === 0) {
      return {
        totalScores: 0,
        last12MonthsScores: 0,
        lastQuarterScores: 0,
        weeklyAverage: 0,
        averageScore: 0,
        scoreTrend: "neutral" as TrendType,
      };
    }

    const now = new Date();
    const last12Months = new Date(now);
    last12Months.setFullYear(now.getFullYear() - 1);
    
    const lastQuarter = new Date(now);
    lastQuarter.setMonth(now.getMonth() - 3);
    
    const ratings = data.ratings.map(rating => ({
      ...rating,
      createdDate: new Date(rating.createdAt)
    }));
    
    // Filter ratings for different time periods
    const ratingsLast12Months = ratings.filter(r => r.createdDate >= last12Months);
    const ratingsLastQuarter = ratings.filter(r => r.createdDate >= lastQuarter);
    
    // Calculate weekly average based on last quarter
    const weeklyAverage = ratingsLastQuarter.length / 12; // ~12 weeks in a quarter
    
    // Calculate average score
    const averageScore = ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length;
    
    // Determine trend (simplified calculation for illustration)
    // In a real app, we would compare current quarter average to previous quarter
    const recentAvg = ratingsLastQuarter.reduce((sum, r) => sum + r.value, 0) / 
                     (ratingsLastQuarter.length || 1);
    const olderAvg = ratingsLast12Months.length > ratingsLastQuarter.length ?
                    (ratingsLast12Months.filter(r => r.createdDate < lastQuarter)
                      .reduce((sum, r) => sum + r.value, 0) / 
                    (ratingsLast12Months.length - ratingsLastQuarter.length || 1)) :
                    recentAvg;
    
    let scoreTrend: TrendType;
    if (recentAvg > olderAvg) {
      scoreTrend = "up";
    } else if (recentAvg < olderAvg) {
      scoreTrend = "down";
    } else {
      scoreTrend = "neutral";
    }
    
    return {
      totalScores: ratings.length,
      last12MonthsScores: ratingsLast12Months.length,
      lastQuarterScores: ratingsLastQuarter.length,
      weeklyAverage: parseFloat(weeklyAverage.toFixed(1)),
      averageScore: parseFloat(averageScore.toFixed(1)),
      scoreTrend,
    };
  }, [data?.ratings]);

  // Calculate ideal weekly scoring frequency (for comparison)
  const idealWeeklyScoring = 1; // Example: one rating per week is ideal
  const weeklyScoreComparison = scoreStats.weeklyAverage >= idealWeeklyScoring ? 
                              "On track" : "Below target";
  
  // Ensure weekly trend is properly typed
  const weeklyTrend: TrendType = scoreStats.weeklyAverage >= idealWeeklyScoring ? "up" : "down";

  if (isLoading) {
    return (
      <div className="py-8 flex justify-center">
        <Loader label="Loading ratings..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load ratings"}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button variant="secondary" onClick={() => refetch()}>
            <RotateCcw className="size-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!data?.ratings || data.ratings.length === 0) {
    return (
      <NoContentFound
        icon={Star}
        title="No Performance Scores"
        description="There are no performance scores for this team member. Add a rating to evaluate their performance on specific activities."
        actionLabel="Add Rating"
        onAction={onAddRating}
        variant="section"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Card for Performance Scoring Metrics */}
      <StatsCard
        items={[
          {
            title: "Average Score",
            value: scoreStats.averageScore.toString(),
            trend: scoreStats.scoreTrend,
            trendValue: scoreStats.scoreTrend === "up" ? "Improving" : 
                       scoreStats.scoreTrend === "down" ? "Decreasing" : "Stable",
            icon: Star,
          },
          {
            title: "Total Scores",
            value: scoreStats.totalScores.toString(),
            trendLabel: "All time",
            icon: BarChart4,
          },
          {
            title: "Last 12 Months",
            value: scoreStats.last12MonthsScores.toString(),
            trendLabel: `${scoreStats.lastQuarterScores} in last quarter`,
            icon: CalendarClock,
          },
          {
            title: "Weekly Frequency",
            value: scoreStats.weeklyAverage.toString(),
            trend: weeklyTrend,
            trendValue: weeklyScoreComparison,
            trendLabel: `Target: ${idealWeeklyScoring}/week`,
            icon: Activity,
          },
        ]}
        columns={4}
      />

      <Table>
        {/* <TableHeader>
          <TableRow>
            <TableHead>Activity</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader> */}
        <TableBody>
          {data.ratings.map((rating) => (
            <TableRow key={rating.id}>
              <TableCell className="font-medium">
                {rating.activity?.name || "N/A"}
              </TableCell>
              <TableCell>
                <StarRating
                  value={rating.value}
                  disabled
                  size="sm"
                  showValue
                  showRatingsCount={false}
                />
              </TableCell>
              <TableCell className="text-foreground max-w-md">
                {rating.activity?.description || "No description"}
              </TableCell>
              <TableCell>
                {new Date(rating.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ScoresSection;