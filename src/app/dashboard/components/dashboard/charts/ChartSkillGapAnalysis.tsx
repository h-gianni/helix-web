"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/core/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function SkillGapAnalysis() {
  // Sample data for skill gaps
  // In a real implementation, this would come from your API
  const gapData = [
    { name: "Engineering", current: 85, target: 90, gap: 5 },
    { name: "Product", current: 78, target: 88, gap: 10 },
    { name: "Design", current: 82, target: 85, gap: 3 },
    { name: "Marketing", current: 75, target: 85, gap: 10 },
    { name: "Sales", current: 70, target: 82, gap: 12 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Gap Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={gapData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="current" fill="#3b82f6" name="Current Level" />
              <Bar dataKey="target" fill="#10b981" name="Target Level" />
              <Bar dataKey="gap" fill="#ef4444" name="Skill Gap" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}