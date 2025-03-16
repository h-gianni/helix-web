"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/core/Card";
import { BaseBarChart } from "@/components/ui/charts/BaseBarChart";

// Sorted team performance data by rating
const teamPerformanceData = [
  { name: "Managers", rating: 4.3, members: 8 },
  { name: "Product Design", rating: 2.9, members: 5 },
  { name: "Design Technology", rating: 4.1, members: 6 },
  { name: "Research", rating: 3.9, members: 5 },
].sort((a, b) => b.rating - a.rating);

export function TeamPerformanceChart() {
  return (
    <Card>
      <CardHeader size="sm">
        <CardTitle>
          Team Performance Comparison
        </CardTitle>
        <CardDescription>
          Average performance rating across different teams, helping identify
          which teams are excelling or struggling.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BaseBarChart
          data={teamPerformanceData}
          xKey="name"
          yKeys={["rating"]}
          layout="horizontal"
          barSize={160}
          height={220}
          variant="categorical"
          domain={[1, 5]}
          showLegend={false}
          margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
        />
      </CardContent>
    </Card>
  );
}
