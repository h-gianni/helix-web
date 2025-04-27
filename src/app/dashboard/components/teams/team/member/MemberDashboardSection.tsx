// app/dashboard/components/teams/team/member/MemberDashboard.tsx
"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/core/Card";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import StarRating from "@/components/ui/core/StarRating";
import { Loader } from "@/components/ui/core/Loader";
import {
  Trophy,
  AlertCircle,
  CalendarClock,
  Star,
  ThumbsUp,
  ThumbsDown,
  Flame,
  Target,
} from "lucide-react";
import { HeroBadge } from "@/components/ui/core/HeroBadge";
import { useMemberDashboard } from "@/store/member-store";
import { StatsCard } from "@/components/ui/composite/StatsCard";
import { BaseLineChart } from "@/components/ui/charts/BaseLineChart";
import { BaseAreaChart } from "@/components/ui/charts/BaseAreaChart";
import { BaseBarChart } from "@/components/ui/charts/BaseBarChart";
import { BasePieChart } from "@/components/ui/charts/BasePieChart";
import { BaseRadarChart } from "@/components/ui/charts/BaseRadarChart";

interface MemberDashboardProps {
  teamId: string;
  memberId: string;
}

function MemberDashboard({ teamId, memberId }: MemberDashboardProps) {
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useMemberDashboard({ teamId, memberId });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader size="base" label="Loading performance data..." />
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <Alert data-slot="alert" variant="destructive">
        <AlertCircle className="size-4" />
        <AlertDescription data-slot="alert-description">
          {error instanceof Error ? error.message : "Failed to load dashboard"}
        </AlertDescription>
      </Alert>
    );
  }

  const {
    currentRating,
    totalRatings,
    currentQuarterRating,
    quarterlyTrend,
    teamPosition,
    teamPositionTrend,
    topActivities,
    quarterlyPerformance,
  } = dashboardData;

  // Calculate improvement rate using existing data
  // For this example, we'll calculate it from the quarterly trend
  // In a real app, you'd want a more sophisticated calculation
  const getImprovementRate = () => {
    if (quarterlyTrend === "up") {
      return "+10%"; // Example value
    } else if (quarterlyTrend === "down") {
      return "-5%"; // Example value
    } else {
      return "0%"; // Stable
    }
  };

  // Convert the trend types to match the StatsCard requirements
  const mapTrendType = (
    trend?: "up" | "down" | "stable"
  ): "up" | "down" | "neutral" | undefined => {
    if (trend === "stable") return "neutral";
    return trend;
  };

  // Enhanced mock data for more detailed charts
  const monthlyPerformanceData = [
    { month: "Jan", rating: 3.8 },
    { month: "Feb", rating: 3.9 },
    { month: "Mar", rating: 4.1 },
    { month: "Apr", rating: 4.0 },
    { month: "May", rating: 4.2 },
    { month: "Jun", rating: 4.3 },
  ];

  const categoryPerformanceData = [
    { category: "Technical Skills", rating: 4.5, average: 4.0 },
    { category: "Communication", rating: 4.2, average: 3.8 },
    { category: "Teamwork", rating: 4.7, average: 4.1 },
    { category: "Leadership", rating: 3.8, average: 3.5 },
    { category: "Innovation", rating: 4.0, average: 3.7 },
  ];

  const skillRadarData = [
    { skill: "Technical", value: 4.5, average: 4.0 },
    { skill: "Communication", value: 4.2, average: 3.8 },
    { skill: "Leadership", value: 3.8, average: 3.5 },
    { skill: "Problem Solving", value: 4.6, average: 4.1 },
    { skill: "Teamwork", value: 4.7, average: 4.1 },
    { skill: "Initiative", value: 4.0, average: 3.7 },
  ];

  const completedActivitiesData = [
    { month: "Jan", completed: 4, total: 5 },
    { month: "Feb", completed: 5, total: 6 },
    { month: "Mar", completed: 7, total: 8 },
    { month: "Apr", completed: 6, total: 7 },
    { month: "May", completed: 8, total: 8 },
    { month: "Jun", completed: 7, total: 9 },
  ];

  // Fix the noteDistributionData to match the required format
  const noteDistributionData = [
    { name: "Positive", value: 65 },
    { name: "Constructive", value: 25 },
    { name: "Neutral", value: 10 },
  ];

  return (
    <div className="space-y-4">
      {/* Top Stats Cards */}
      <StatsCard
        items={[
          {
            title: "Last 12 months rating",
            value: currentRating.toFixed(1),
            trend: mapTrendType(quarterlyTrend),
            trendValue:
              quarterlyTrend === "up"
                ? "+0.2"
                : quarterlyTrend === "down"
                ? "-0.2"
                : "0",
            trendLabel: `vs previous year`,
            icon: Star,
          },
          {
            title: "Current quarter",
            value: currentQuarterRating.toFixed(1),
            trend: mapTrendType(quarterlyTrend),
            trendValue:
              quarterlyTrend === "up"
                ? "+0.2"
                : quarterlyTrend === "down"
                ? "-0.2"
                : "0",
            trendLabel: `vs last quarter`,
            icon: CalendarClock,
          },
          {
            title: "Team standing",
            value: `${teamPosition}`,
            trend: mapTrendType(teamPositionTrend),
            trendValue:
              teamPositionTrend === "up"
                ? "Improved"
                : teamPositionTrend === "down"
                ? "Decreased"
                : "No change",
            icon: Trophy,
          },
          {
            title: "Performance Target",
            value: getImprovementRate(),
            trend: mapTrendType(quarterlyTrend),
            trendLabel: "vs target goal",
            icon: Target,
          },
        ]}
        columns={4}
      />

      {/* Performance Trends & Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader size="sm">
            <CardTitle>Performance Trend</CardTitle>
            <CardDescription>
              Monthly performance rating over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-4">
              <BaseAreaChart
                data={monthlyPerformanceData}
                xKey="month"
                yKeys={["rating"]}
                height={220}
                curved={true}
                variant="primary"
                showDots={true}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader size="sm">
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>
              Performance across different categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-4">
              <BaseBarChart
                data={categoryPerformanceData}
                xKey="category"
                yKeys={["rating", "average"]}
                height={220}
                variant="primary"
                layout="horizontal"
                showLegend={true}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Radar & Activity Completion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader size="sm">
            <CardTitle>Skills Assessment</CardTitle>
            <CardDescription>
              Performance across key skill dimensions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="">
              <BaseRadarChart
                data={skillRadarData}
                dataKeys={["value", "average"]}
                labelKey="skill"
                height={360}
                variant="categorical"
                outerRadius={140}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader size="sm">
            <CardTitle>Notes Distribution</CardTitle>
            <CardDescription>Types of notes received</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="">
              <BasePieChart
                data={noteDistributionData}
                dataKey="value"
                nameKey="name"
                height={320}
                innerRadius={60}
                outerRadius={100}
                variant="categorical"
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top actions & notes Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader size="sm">
            <CardTitle>Actions Completion</CardTitle>
            <CardDescription>
              Completion rate of assigned activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-4">
              <BaseLineChart
                data={completedActivitiesData}
                xKey="month"
                yKeys={["completed", "total"]}
                height={180}
                curved={true}
                showDots={true}
                variant="primary"
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader size="sm">
            <CardTitle>Top scored actions</CardTitle>
            <CardDescription>Highest rated performance actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topActivities.map((activity, index) => (
                <div key={activity.id} className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-foreground">
                        {index + 1}.
                      </span>
                      <span className="heading-6 !text-foreground">
                        Activity {activity.name}
                      </span>
                    </div>
                    <div>
                      <StarRating
                        value={activity.averageRating}
                        disabled
                        size="sm"
                        showRatingsCount={true}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strengths & Areas for Improvement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex-shrink-0 mb-3">
                <HeroBadge variant="success" size="base" icon={ThumbsUp} />
              </div>
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div>
                  <p className="font-semibold">Technical Excellence</p>
                  <p className="text-sm text-muted-foreground">
                    Consistently delivers high-quality technical solutions with
                    attention to detail.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div>
                  <p className="font-semibold">Team Collaboration</p>
                  <p className="text-sm text-muted-foreground">
                    Actively supports team members and contributes positively to
                    group dynamics.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div>
                  <p className="font-semibold">Project Management</p>
                  <p className="text-sm text-muted-foreground">
                    Excellent at organizing work and meeting deadlines
                    consistently.
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex-shrink-0 mb-3">
                <HeroBadge variant="warning" size="base" icon={ThumbsDown} />
              </div>
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div>
                  <p className="font-semibold">
                    Communication with Stakeholders
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Could improve frequency and clarity of updates with project
                    stakeholders.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div>
                  <p className="font-semibold">Strategic Thinking</p>
                  <p className="text-sm text-muted-foreground">
                    Focus on developing more long-term perspective when
                    approaching solutions.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div>
                  <p className="font-semibold">Documentation</p>
                  <p className="text-sm text-muted-foreground">
                    More thorough documentation would help knowledge transfer to
                    the team.
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MemberDashboard;