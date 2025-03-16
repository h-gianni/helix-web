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

export function SkillGapAnalysis() {
  // Sample data for skill gaps
  const gapData = [
    { name: "Managers", current: 85, target: 90, gap: 5 },
    { name: "Product Design", current: 78, target: 88, gap: 10 },
    { name: "Design Technology", current: 82, target: 85, gap: 3 },
    { name: "Research", current: 75, target: 85, gap: 10 },
  ];

  return (
    <Card>
      <CardHeader size="sm">
        <CardTitle>
          Skill Gap Analysis
        </CardTitle>
        <CardDescription>
          Comparing current skill levels against target levels, identifying areas for training and development.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BaseBarChart
          data={gapData}
          xKey="name"
          yKeys={["current", "target", "gap"]}
          layout="horizontal"
          barSize={80}
          height={260}
          variant="categorical"
          domain={[0, 100]}
          stacked={false}
          margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
        />
      </CardContent>
    </Card>
  );
}
