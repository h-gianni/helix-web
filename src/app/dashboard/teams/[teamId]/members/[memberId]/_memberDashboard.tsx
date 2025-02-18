"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/core/Card";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import StarRating from "@/components/ui/core/Star-rating";
import { Loader } from "@/components/ui/core/Loader";
import {
  TrendingUp,
  TrendingDown,
  Trophy,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemberDashboard } from "@/store/member-store";

interface MemberDashboardProps {
  teamId: string;
  memberId: string;
}

export default function MemberDashboard({
  teamId,
  memberId,
}: MemberDashboardProps) {
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useMemberDashboard({ teamId, memberId });

  if (isLoading) {
    return <div className="loader"><Loader size="base" label="Loading..." /></div>;
  }

  if (error || !dashboardData) {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertDescription>
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
    totalFeedbacks,
    teamPosition,
    teamPositionTrend,
    topActivities,
    quarterlyPerformance,
  } = dashboardData;

  const TrendIcon = ({ trend }: { trend: "up" | "down" | "stable" }) => {
    if (trend === "up")
      return <TrendingUp className="h-4 w-4 text-success-500" />;
    if (trend === "down")
      return <TrendingDown className="h-4 w-4 text-danger-500" />;
    return null;
  };

  return (
    <div className="space-y-2">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {/* Overall Rating Card */}
        <Card>
          <CardHeader>
            <CardTitle data-size="sm" className="heading-5 -mt-1">
              Overall Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <StarRating
                  value={currentRating}
                  disabled={true}
                  size="sm"
                  ratingsCount={totalRatings}
                  showRatingsCount={true}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Quarter Performance */}
        <Card>
          <CardHeader>
            <CardTitle data-size="sm" className="heading-5 -mt-1">
              Current Quarter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <StarRating
                  value={currentQuarterRating}
                  disabled={true}
                  size="sm"
                  showRatingsCount={true}
                />
                <TrendIcon trend={quarterlyTrend} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Standing */}
        <Card>
          <CardHeader>
            <CardTitle data-size="sm" className="heading-5 -mt-1">
            Team Standing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="text-foreground-muted size-5" />
                  <span className="heading-1 text-foreground">{teamPosition}</span>
                </div>
                <TrendIcon trend={teamPositionTrend} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Count */}
        <Card>
          <CardHeader>
            <CardTitle data-size="sm" className="heading-5 -mt-1">
              Total Feedbacks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="">
              <div className="flex items-center gap-2">
                <MessageSquare className="text-foreground-muted size-5" />
                <span className="heading-1 text-foreground">{totalFeedbacks}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {/* Quarter Performance Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle data-size="sm" className="heading-5 -mt-1">
              Quarter Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 -ml-6 pr-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quarterlyPerformance}>
                  <XAxis dataKey="quarter" fontSize="12px" stroke="#6D8BA2" />
                  <YAxis domain={[0, 5]} fontSize="12px" stroke="#6D8BA2" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="averageRating"
                    stroke="#007bff"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Yearly Performance Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle data-size="sm" className="heading-5 -mt-1">
              Last 12 months Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 -ml-6 pr-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quarterlyPerformance}>
                <XAxis dataKey="quarter" fontSize="12px" stroke="#6D8BA2" />
                <YAxis domain={[0, 5]} fontSize="12px" stroke="#6D8BA2" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="averageRating"
                    stroke="#007bff"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strengths and Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Card>
          <CardHeader>
            <CardTitle data-size="sm" className="heading-5 -mt-1">
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="missing-text">Not ready to generate the content</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle data-size="sm" className="heading-5 -mt-1">
              Need to improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="missing-text">Not ready to generate the content</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Activities & Feedback */}
      <div className="grid grid-cols-3 gap-2">
        {/* Top Activities */}
        <Card>
          <CardHeader>
            <CardTitle data-size="sm" className="heading-5 -mt-1">
              Top Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {topActivities.map((activity) => (
                <div key={activity.id}>
                  <div className="flex gap-1 items-baseline">
                    <div className="heading-5 -mt-1">{activity.name}</div>
                    <div className="text-sm">
                      with {activity.ratingsCount} ratings
                    </div>
                  </div>
                  <StarRating
                    value={activity.averageRating}
                    disabled={true}
                    size="sm"
                    showRatingsCount={false}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
