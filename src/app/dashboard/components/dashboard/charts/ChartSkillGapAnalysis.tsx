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
  Legend,
  ResponsiveContainer,
} from "recharts";

export function SkillGapAnalysis() {
  // Sample data for skill gaps
  const gapData = [
    { name: "Managers", current: 85, target: 90, gap: 5 },
    { name: "Product Design", current: 78, target: 88, gap: 10 },
    { name: "Design Technology", current: 82, target: 85, gap: 3 },
    { name: "Research", current: 75, target: 85, gap: 10 },
  ];

  // Apple colors
  const appleColors = {
    current: "#007AFF", // Apple blue
    target: "#30D158", // Apple green
    gap: "#FF453A"     // Apple red
  };

  // Custom renderer for the legend with circle indicators
  const renderLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <ul className="flex justify-center gap-x-6 pt-2 text-sm">
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
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-slate-800">Skill Gap Analysis</CardTitle>
        <CardDescription className="text-sm text-slate-500">
          Comparing current skill levels against target levels, identifying areas for training and development.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={gapData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barSize={40}
              barGap={4}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#ccc"
                vertical={true}
              />
              <XAxis 
                dataKey="name" 
                axisLine={{ stroke: "#d1d1d6" }}
                tickLine={{ stroke: "#d1d1d6" }}
                tick={{ fontSize: 12, fill: "#555" }}
              />
              <YAxis 
                domain={[0, 100]} 
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
              <Bar 
                dataKey="current" 
                fill={appleColors.current} 
                name="Current Level" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="target" 
                fill={appleColors.target} 
                name="Target Level" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="gap" 
                fill={appleColors.gap} 
                name="Skill Gap" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}