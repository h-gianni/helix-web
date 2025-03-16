"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/core/Card";
import { BaseRadarChart } from "@/components/ui/charts/BaseRadarChart";

export function FeedbackQualityMetrics() {
  // Sample data for feedback quality metrics
  const qualityData = [
    { name: 'Specific', value: 65 },
    { name: 'Actionable', value: 59 },
    { name: 'Timely', value: 80 },
    { name: 'Constructive', value: 81 },
    { name: 'Balanced', value: 56 },
  ];

  return (
    <Card>
      <CardHeader size="sm">
        <CardTitle>
          Feedback Quality Metrics
        </CardTitle>
        <CardDescription>
          Radar chart analyzing the quality of feedback across dimensions, ensuring feedback effectiveness.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BaseRadarChart
          data={qualityData}
          dataKeys={["value"]}
          labelKey="name"
          height={280}
          variant="categorical"
          outerRadius={90}
          domain={[0, 100]}
          showLegend={false}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        />
      </CardContent>
    </Card>
  );
}
