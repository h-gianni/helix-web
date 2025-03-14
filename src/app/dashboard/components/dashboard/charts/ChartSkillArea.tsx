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
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function SkillAreaChart() {
  // Sample data for radar chart
  const skillData = [
    { subject: 'Communication', Managers: 120, "Product Design": 110, "Design Technology": 90, "Research": 105, fullMark: 150 },
    { subject: 'Technical Skills', Managers: 98, "Product Design": 130, "Design Technology": 140, "Research": 115, fullMark: 150 },
    { subject: 'Leadership', Managers: 86, "Product Design": 130, "Design Technology": 95, "Research": 120, fullMark: 150 },
    { subject: 'Teamwork', Managers: 99, "Product Design": 100, "Design Technology": 115, "Research": 130, fullMark: 150 },
    { subject: 'Problem Solving', Managers: 85, "Product Design": 90, "Design Technology": 125, "Research": 135, fullMark: 150 },
    { subject: 'Creativity', Managers: 65, "Product Design": 85, "Design Technology": 110, "Research": 95, fullMark: 150 },
  ];

  // Apple-inspired colors
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
      <ul className="flex justify-center gap-x-6 pt-4 text-sm">
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
        <CardTitle className="text-xl font-semibold text-slate-800">Performance by Skill Area</CardTitle>
        <CardDescription className="text-sm text-slate-500">
          Radar chart comparing performance across different skill dimensions, revealing strengths and weaknesses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={90} data={skillData}>
              <PolarGrid stroke="#e5e5ea" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: "#555", fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 150]} 
                axisLine={false}
                tick={{ fill: "#8E8E93", fontSize: 10 }}
              />
              <Radar
                name="Managers"
                dataKey="Managers"
                stroke={appleColors["Managers"]}
                fill={appleColors["Managers"]}
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name="Product Design"
                dataKey="Product Design"
                stroke={appleColors["Product Design"]}
                fill={appleColors["Product Design"]}
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name="Design Technology"
                dataKey="Design Technology"
                stroke={appleColors["Design Technology"]}
                fill={appleColors["Design Technology"]}
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name="Research"
                dataKey="Research"
                stroke={appleColors["Research"]}
                fill={appleColors["Research"]}
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Legend content={renderLegend} />
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