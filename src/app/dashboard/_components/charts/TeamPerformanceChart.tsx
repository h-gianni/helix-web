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
  ResponsiveContainer,
} from "recharts";
import type { Member } from "@/store/member";
import type { TeamResponse } from "@/lib/types/api";

interface TeamPerformanceChartProps {
  teams: TeamResponse[];
  performers: Member[];
}

export function TeamPerformanceChart({ teams, performers }: TeamPerformanceChartProps) {
  // Calculate team performance for bar chart
  const teamPerformance = teams.map(team => {
    const teamMembers = performers.filter(p => p.teamId === team.id && p.ratingsCount > 0);
    const avgRating = teamMembers.length > 0
      ? teamMembers.reduce((sum, p) => sum + p.averageRating, 0) / teamMembers.length
      : 0;
    
    return {
      name: team.name,
      rating: parseFloat(avgRating.toFixed(2)),
      members: teamMembers.length
    };
  }).filter(t => t.rating > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={teamPerformance}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
              />
              <YAxis domain={[0, 5]} />
              <Tooltip 
                formatter={(value, name) => {
                  return name === "rating" 
                    ? [`${value} / 5`, "Avg Rating"] 
                    : [value, "Members"];
                }}
              />
              <Bar dataKey="rating" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}