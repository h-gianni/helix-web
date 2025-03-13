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
import type { Member } from "@/store/member";
import type { TeamResponse } from "@/lib/types/api";

interface TeamCompositionChartProps {
  teams: TeamResponse[];
  performers: Member[];
}

export function TeamCompositionChart({ teams, performers }: TeamCompositionChartProps) {
  // Sample data - in a real implementation, you would generate this from your data
  // This is a stacked bar chart showing team composition by seniority
  const compositionData = [
    { name: "Engineering", Senior: 5, Mid: 8, Junior: 4 },
    { name: "Product", Senior: 2, Mid: 3, Junior: 1 },
    { name: "Design", Senior: 2, Mid: 4, Junior: 2 },
    { name: "Marketing", Senior: 1, Mid: 3, Junior: 2 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Composition</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={compositionData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Senior" stackId="a" fill="#1e40af" />
              <Bar dataKey="Mid" stackId="a" fill="#3b82f6" />
              <Bar dataKey="Junior" stackId="a" fill="#93c5fd" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}