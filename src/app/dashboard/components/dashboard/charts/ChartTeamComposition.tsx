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
import type { Member } from "@/store/member";
import type { TeamResponse } from "@/lib/types/api";

interface TeamCompositionChartProps {
  teams: TeamResponse[];
  performers: Member[];
}

export function TeamCompositionChart({
  teams,
  performers,
}: TeamCompositionChartProps) {
  // Sample data - in a real implementation, you would generate this from your data
  const compositionData = [
    { name: "Managers", Senior: 5, Mid: 8, Junior: 4 },
    { name: "Product Design", Senior: 2, Mid: 3, Junior: 1 },
    { name: "Design Technology", Senior: 2, Mid: 4, Junior: 2 },
    { name: "Research", Senior: 1, Mid: 3, Junior: 2 },
  ];

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
            <span className="text-sm text-foreground-muted">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-slate-800">Team Composition</CardTitle>
        <CardDescription className="text-sm text-slate-500">
          Composition of each team by seniority level, providing insights into
          team structure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={compositionData}
              margin={{ top: 0, right: 0, left: 0, bottom: 5 }}
              barSize={160}
              barGap={0}
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
                tick={{ fontSize: 12, fill: "#1D1D1F" }}
              />
              <YAxis 
                axisLine={{ stroke: "#d1d1d6" }}
                tickLine={{ stroke: "#d1d1d6" }}
                tick={{ fontSize: 12, fill: "#8E8E93" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.75)",
                  border: "1px solid #f1f1f1",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  padding: "8px 12px",
                }}
                itemStyle={{ fontSize: "12px" }}
                labelStyle={{ fontSize: "12px", fontWeight: "bold" }}
              />
              <Legend content={renderLegend} />
              <Bar 
                dataKey="Senior" 
                stackId="a" 
                fill="#0A84FF" 
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="Mid" 
                stackId="a" 
                fill="#5AC8FA" 
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="Junior" 
                stackId="a" 
                fill="#C7EBFF" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}