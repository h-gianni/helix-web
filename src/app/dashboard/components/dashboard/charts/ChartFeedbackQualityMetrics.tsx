"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/core/Card";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function FeedbackQualityMetrics() {
  // Sample data for feedback quality metrics
  // In a real implementation, this would come from your API
  const qualityData = [
    { name: 'Specific', value: 65 },
    { name: 'Actionable', value: 59 },
    { name: 'Timely', value: 80 },
    { name: 'Constructive', value: 81 },
    { name: 'Balanced', value: 56 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback Quality Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={90} data={qualityData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar
                name="Quality Score"
                dataKey="value"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}