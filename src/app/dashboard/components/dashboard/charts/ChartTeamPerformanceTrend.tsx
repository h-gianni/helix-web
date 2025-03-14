"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/core/Select";
import type { TeamResponse } from "@/lib/types/api";

interface TeamPerformanceTrendProps {
  teams: TeamResponse[];
}

export function TeamPerformanceTrend({ teams }: TeamPerformanceTrendProps) {
  const [timeRange, setTimeRange] = useState("quarter");

  // Sample data - would need API endpoint for historical data
  const timeSeriesData = [
    {
      period: "Q1 2023",
      Managers: 3.8,
      "Product Design": 4.2,
      "Design Technology": 4.2,
      Research: 4.2,
    },
    {
      period: "Q2 2023",
      Managers: 3.0,
      "Product Design": 4.6,
      "Design Technology": 4.2,
      Research: 4.4,
    },
    {
      period: "Q3 2023",
      Managers: 4.1,
      "Product Design": 3.5,
      "Design Technology": 3.7,
      Research: 4.1,
    },
    {
      period: "Q4 2023",
      Managers: 4.2,
      "Product Design": 4.4,
      "Design Technology": 4.2,
      Research: 3.9,
    },
    {
      period: "Q1 2024",
      Managers: 4.5,
      "Product Design": 4.0,
      "Design Technology": 3.7,
      Research: 4.1,
    },
  ];

  // Apple color palette for lines
  const appleColors = {
    "Managers": "#007AFF", // Apple blue
    "Product Design": "#FF9500", // Apple orange
    "Design Technology": "#5AC8FA", // Apple light blue
    "Research": "#FF2D55", // Apple pink
  };

  // Custom renderer for the legend with circle indicators
  const renderLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-2 text-sm">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center">
            <div
              className="mr-2 h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-slate-600">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-start gap-8 justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-semibold text-slate-800">Performance Trends</CardTitle>
          <CardDescription className="pt-1 text-sm text-slate-500">
            How each team's performance has evolved over time, highlighting improvement or decline patterns.
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-36 text-sm border border-slate-200 rounded-lg bg-white shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border border-slate-200 shadow-md rounded-lg">
            <SelectItem value="quarter" className="text-sm">Quarterly</SelectItem>
            <SelectItem value="half-year" className="text-sm">Half-Yearly</SelectItem>
            <SelectItem value="year" className="text-sm">Yearly</SelectItem>
            <SelectItem value="two-years" className="text-sm">Last 2 Years</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeriesData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#ccc"
                vertical={true}
              />
              <XAxis 
                dataKey="period" 
                axisLine={{ stroke: "#d1d1d6" }}
                tickLine={{ stroke: "#d1d1d6" }}
                tick={{ fontSize: 12, fill: "#1D1D1F" }}
              />
              <YAxis 
                domain={[0, 5]} 
                axisLine={{ stroke: "#d1d1d6" }}
                tickLine={{ stroke: "#d1d1d6" }}
                tick={{ fontSize: 12, fill: "#8E8E93" }}
              />
              <Tooltip 
                contentStyle={{
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #f1f1f1",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  padding: "8px 12px",
                }}
                itemStyle={{ fontSize: "12px" }}
                labelStyle={{ fontSize: "12px", fontWeight: "bold" }}
              />
              <Legend content={renderLegend} />
              
              {/* Map over team data with Apple colors */}
              {Object.keys(appleColors).map((team) => (
                <Line
                  key={team}
                  type="monotone"
                  dataKey={team}
                  stroke={appleColors[team as keyof typeof appleColors]}
                  strokeWidth={2.5}
                  dot={{ 
                    r: 4,
                    strokeWidth: 1,
                    fill: "#FFFFFF", 
                    stroke: appleColors[team as keyof typeof appleColors]
                  }}
                  activeDot={{ 
                    r: 6, 
                    strokeWidth: 0,
                    fill: appleColors[team as keyof typeof appleColors]
                  }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}