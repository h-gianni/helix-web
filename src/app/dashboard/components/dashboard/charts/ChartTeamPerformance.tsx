"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
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
  Cell,
} from "recharts";

// Sort team performance data by rating
const teamPerformanceData = [
  { name: "Managers", rating: 4.3, members: 8 },
  { name: "Product Design", rating: 2.9, members: 5 },
  { name: "Design Technology", rating: 4.1, members: 6 },
  { name: "Research", rating: 3.9, members: 5 },
].sort((a, b) => b.rating - a.rating);

export function TeamPerformanceChart() {
  // Generate color intensity based on rating
  const getBarColor = (rating: number) => {
    // Map rating from 0-5 scale to color intensity
    // Apple blue with varying opacity based on rating
    const baseColor = "0, 122, 255"; // Apple blue in RGB
    const normalizedRating = Math.min(Math.max(rating / 5, 0), 1); // 0 to 1
    // Higher rating = more intense color (0.45 to 0.85 opacity range)
    const opacity = 0.45 + (normalizedRating * 0.4);
    return `rgba(${baseColor}, ${opacity})`;
  };
  
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-slate-800">Team Performance Comparison</CardTitle>
        <CardDescription className="text-sm text-slate-500">
          Average performance rating across different teams, helping identify
          which teams are excelling or struggling.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={teamPerformanceData}
              margin={{ top: 0, right: 0, left: 0, bottom: 60 }}
              barSize={80}
              barGap={0}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#ccc"
                vertical={true}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#555" }}
                angle={-45}
                textAnchor="end"
                axisLine={{ stroke: "#d1d1d6" }}
                tickLine={{ stroke: "#d1d1d6" }}
              />
              <YAxis 
                domain={[1, 2, 3, 4, 5]} 
                axisLine={{ stroke: "#d1d1d6" }}
                tickLine={{ stroke: "#d1d1d6" }}
                tick={{ fontSize: 12, fill: "#8E8E93" }}
              />
              <Tooltip
                formatter={(value, name) => {
                  return name === "rating"
                    ? [`${value} / 5`, "Avg Rating"]
                    : [value, "Members"];
                }}
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
              <Bar 
                dataKey="rating" 
                radius={[4, 4, 0, 0]}
                className="text-sm font-medium"
              >
                {teamPerformanceData.map((entry) => (
                  <Cell 
                    key={`cell-${entry.name}`} 
                    fill={getBarColor(entry.rating)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}