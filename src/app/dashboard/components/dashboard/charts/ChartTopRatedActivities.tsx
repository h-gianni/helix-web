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

  // Sorted activity data by rating
  const activityData = [
    { name: "Code Reviews", rating: 4.7, count: 45 },
    { name: "Client Meetings", rating: 4.5, count: 32 },
    { name: "Problem Solving", rating: 4.4, count: 38 },
    { name: "Documentation", rating: 4.2, count: 25 },
    { name: "Knowledge Sharing", rating: 4.1, count: 40 },
  ].sort((a, b) => b.rating - a.rating);

export function TopRatedActivities() {

  return (
    <Card>
      <CardHeader size="sm">
        <CardTitle>
          Top 5 Rated Activities
        </CardTitle>
        <CardDescription>
          Shows which specific activities receive the highest ratings across
          teams, highlighting areas where teams excel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BaseBarChart
          data={activityData}
          xKey="name"
          yKeys={["rating"]}
          layout="horizontal"
          barSize={80}
          height={260}
          variant="categorical"
          domain={[0, 5]}
          showLegend={false}
          margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
        />
      </CardContent>
    </Card>
  );
}
