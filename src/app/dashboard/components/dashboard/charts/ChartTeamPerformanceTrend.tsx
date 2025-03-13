"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/core/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/core/Select";
import type { TeamResponse } from "@/lib/types/api";

interface TeamPerformanceTrendProps {
  teams: TeamResponse[];
}

export function TeamPerformanceTrend({ teams }: TeamPerformanceTrendProps) {
  const [timeRange, setTimeRange] = useState("quarter");
  
  // Sample data - would need API endpoint for historical data
  const timeSeriesData = [
    { period: "Q1 2023", "Team A": 3.8, "Team B": 4.2 },
    { period: "Q2 2023", "Team A": 4.0, "Team B": 4.0 },
    { period: "Q3 2023", "Team A": 4.2, "Team B": 3.9 },
    { period: "Q4 2023", "Team A": 4.5, "Team B": 4.1 },
    { period: "Q1 2024", "Team A": 4.3, "Team B": 4.4 }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Performance Trends</CardTitle>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quarter">Quarterly</SelectItem>
            <SelectItem value="half-year">Half-Yearly</SelectItem>
            <SelectItem value="year">Yearly</SelectItem>
            <SelectItem value="two-years">Last 2 Years</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              {/* In a real implementation, map over actual teams */}
              <Line 
                type="monotone" 
                dataKey="Team A" 
                stroke="#3b82f6" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="Team B" 
                stroke="#10b981" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}