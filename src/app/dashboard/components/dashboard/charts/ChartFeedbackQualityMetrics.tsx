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
  const qualityData = [
    { name: 'Specific', value: 65 },
    { name: 'Actionable', value: 59 },
    { name: 'Timely', value: 80 },
    { name: 'Constructive', value: 81 },
    { name: 'Balanced', value: 56 },
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-slate-800">Feedback Quality Metrics</CardTitle>
        <CardDescription className="text-sm text-slate-500">
          Radar chart analyzing the quality of feedback across dimensions, ensuring feedback effectiveness.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={90} data={qualityData}>
              <PolarGrid stroke="#e5e5ea" />
              <PolarAngleAxis 
                dataKey="name" 
                tick={{ fill: "#1D1D1F", fontSize: 12 }}
              />
              <PolarRadiusAxis
                domain={[0, 100]} 
                axisLine={false}
                tick={{ fill: "#8E8E93", fontSize: 10 }}
              />
              <Radar
                name="Quality Score"
                dataKey="value"
                stroke="#007AFF"
                fill="#007AFF"
                fillOpacity={0.3}
                strokeWidth={2}
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
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}