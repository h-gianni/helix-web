"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/core/Card";
import { BaseAreaChart } from "@/components/ui/charts/BaseAreaChart";

export function FeedbackTrendChart() {
  // Sample data for feedback over time
  const feedbackData = [
    { month: 'Jan', feedback: 65, ratings: 120 },
    { month: 'Feb', feedback: 59, ratings: 110 },
    { month: 'Mar', feedback: 80, ratings: 140 },
    { month: 'Apr', feedback: 81, ratings: 145 },
    { month: 'May', feedback: 56, ratings: 120 },
    { month: 'Jun', feedback: 55, ratings: 110 },
    { month: 'Jul', feedback: 40, ratings: 90 },
  ];

  return (
    <Card>
      <CardHeader size="sm">
        <CardTitle>
          Feedback Trends
        </CardTitle>
        <CardDescription>
          Area chart showing the volume of feedback and ratings over time, helping track engagement with the feedback process.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BaseAreaChart
          data={feedbackData}
          xKey="month"
          yKeys={["feedback", "ratings"]}
          height={280}
          variant="categorical"
          domain={[0, 'auto']}
          stacked={false}
          curved={true}
          margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
        />
      </CardContent>
    </Card>
  );
}
