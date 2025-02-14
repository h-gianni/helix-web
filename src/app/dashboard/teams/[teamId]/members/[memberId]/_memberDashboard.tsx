"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/core/Card";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import StarRating from "@/components/ui/core/Star-rating";
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
    error 
  } = useMemberDashboard({ teamId, memberId });

  if (isLoading) {
    return <div className="p-base text-foreground">Loading dashboard...</div>;
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
    <div className="space-y-base">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-base">
        {/* Overall Rating Card */}
        <Card>
          <CardHeader>
            <CardTitle data-size="sm">Overall Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-sm">
              <div className="flex items-center gap-sm">
                <StarRating
                  value={currentRating}
                  disabled={true}
                  size="sm"
                  ratingsCount={totalRatings}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Quarter Performance */}
        <Card>
          <CardHeader>
            <CardTitle data-size="sm">Current Quarter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-sm">
              <div className="flex items-center justify-between">
                <StarRating
                  value={currentQuarterRating}
                  disabled={true}
                  size="sm"
                  showRatingsCount={false}
                />
                <TrendIcon trend={quarterlyTrend} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Standing */}
        <Card>
          <CardHeader>
            <CardTitle data-size="sm">Team Standing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-sm">
                  <Trophy className="ui-text-success" />
                  <span className="text-lg">#{teamPosition}</span>
                </div>
                <TrendIcon trend={teamPositionTrend} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-base">
        {/* Performance Trend Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle data-size="sm">Quarterly Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quarterlyPerformance}>
                  <XAxis dataKey="quarter" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="averageRating"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Activities & Feedback */}
        <div className="space-y-base">
          {/* Feedback Count */}
          <Card>
            <CardHeader>
              <CardTitle data-size="sm">Total Feedbacks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="">
                <div className="flex items-center gap-sm">
                  <MessageSquare />
                  <span className="text-lg">{totalFeedbacks}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Activities */}
          <Card>
            <CardHeader>
              <CardTitle data-size="sm">Top Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-sm">
                {topActivities.map((activity) => (
                  <div key={activity.id}>
                    <div className="flex gap-xs items-baseline">
                      <div className="">{activity.name}</div>
                      <div className="ui-text-body-helper">
                        ({activity.ratingsCount} ratings)
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

      {/* Strengths and Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-base">
        <Card>
          <CardHeader>
            <CardTitle data-size="sm">Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="">Content coming soon</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle data-size="sm">Need to improve</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="">Content coming soon</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}