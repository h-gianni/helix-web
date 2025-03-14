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

// Sort data by rating to ensure consistent color mapping
const chartData = [
  { name: "Alex Johnson", averageRating: 4.9 },
  { name: "Jamie Smith", averageRating: 4.7 },
  { name: "Taylor Brown", averageRating: 4.6 },
  { name: "Morgan Davis", averageRating: 4.5 },
  { name: "Casey Wilson", averageRating: 4.4 },
].sort((a, b) => b.averageRating - a.averageRating);

export function TopPerformersChart() {
  // Generate color intensity based on ranking
  const getBarColor = (index: number) => {
    // Apple blue with varying opacity based on rank
    const baseColor = "0, 122, 255"; // Apple blue in RGB
    // Decrease opacity for lower ranks (85% to 60%)
    const opacity = 0.85 - (index * 0.06);
    return `rgba(${baseColor}, ${opacity})`;
  };
  
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-slate-800">Top Performers</CardTitle>
        <CardDescription className="text-sm text-slate-500">
          The highest-rated team members across your organization, highlighting
          standout contributors.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 0, left: 25, bottom: 5 }}
              barGap={0}
              barSize={32}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#ccc"
                horizontal={true}
                vertical={true}
              />
              <XAxis 
                type="number" 
                domain={[0, 5]} 
                ticks={[1, 2, 3, 4, 5]} 
                axisLine={{ stroke: "#d1d1d6" }}
                tickLine={{ stroke: "#d1d1d6" }}
                tick={{ fontSize: 12, fill: "#666" }}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fontSize: 12, fill: "#555" }}
                axisLine={{ stroke: "#fff" }}
                tickLine={{ stroke: "#fff" }}
                width={70}
              />
              <Tooltip 
                formatter={(value) => [`${value} / 5`, "Rating"]}
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
                dataKey="averageRating"
                radius={[4, 4, 4, 4]}
                className="text-sm font-medium"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(index)}
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