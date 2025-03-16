"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/core/Card";
import { BasePieChart } from "@/components/ui/charts/BasePieChart";

const distributionData = [
  { name: "Star", value: 2 },
  { name: "Strong", value: 3 },
  { name: "Solid", value: 3 },
  { name: "Lower", value: 1 },
  { name: "Poor", value: 1 },
  { name: "Not Scored", value: 1 },
];

export function PerformanceDistribution() {
  return (
    <Card>
      <CardHeader size="sm">
        <CardTitle>
          Performance Distribution
        </CardTitle>
        <CardDescription>
          Distribution of team members across different performance categories.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BasePieChart
          data={distributionData}
          dataKey="value"
          nameKey="name"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={2}
          labelType="name-percent"
          height={260}
          variant="categorical"
          showLegend={false}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        />
      </CardContent>
    </Card>
  );
}
