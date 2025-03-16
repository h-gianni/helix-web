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

// Sample data
const compositionData = [
  { name: "Managers", Senior: 5, Mid: 8, Junior: 4 },
  { name: "Product Design", Senior: 2, Mid: 3, Junior: 1 },
  { name: "Design Technology", Senior: 2, Mid: 4, Junior: 2 },
  { name: "Research", Senior: 1, Mid: 3, Junior: 2 },
];

export function TeamCompositionChart() {
  return (
    <Card>
      <CardHeader size="sm">
        <CardTitle>
          Team Composition
        </CardTitle>
        <CardDescription>
          Composition of each team by seniority level, providing insights into
          team structure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BaseBarChart
          data={compositionData}
          xKey="name"
          yKeys={["Senior", "Mid", "Junior"]}
          stacked={true}
          layout="horizontal"
          barSize={160}
          height={260}
          variant="categorical"
          margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
        />
      </CardContent>
    </Card>
  );
}