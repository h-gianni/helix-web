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

export function SkillAreaChart() {
  // Sample data for radar chart
  const skillData = [
    { subject: 'Communication', Managers: 120, "Product Design": 110, "Design Technology": 90, "Research": 105 },
    { subject: 'Technical Skills', Managers: 98, "Product Design": 130, "Design Technology": 140, "Research": 115 },
    { subject: 'Leadership', Managers: 86, "Product Design": 130, "Design Technology": 95, "Research": 120 },
    { subject: 'Teamwork', Managers: 99, "Product Design": 100, "Design Technology": 115, "Research": 130 },
    { subject: 'Problem Solving', Managers: 85, "Product Design": 90, "Design Technology": 125, "Research": 135 },
    { subject: 'Creativity', Managers: 65, "Product Design": 85, "Design Technology": 110, "Research": 95 },
  ];

  return (
    <Card>
      <CardHeader size="sm">
        <CardTitle>
          Performance by Skill Area
        </CardTitle>
        <CardDescription>
          Radar chart comparing performance across different skill dimensions, revealing strengths and weaknesses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BaseRadarChart
          data={skillData}
          dataKeys={["Managers", "Product Design", "Design Technology", "Research"]}
          labelKey="subject"
          height={280}
          variant="categorical"
          outerRadius={90}
          domain={[0, 150]}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        />
      </CardContent>
    </Card>
  );
}
