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

export function ReviewCompletionRates() {
  // Sample data for review completion rates
  const completionData = [
    { name: "Q1 2023", onTime: 85, late: 10, missed: 5 },
    { name: "Q2 2023", onTime: 78, late: 15, missed: 7 },
    { name: "Q3 2023", onTime: 82, late: 12, missed: 6 },
    { name: "Q4 2023", onTime: 88, late: 10, missed: 2 },
    { name: "Q1 2024", onTime: 90, late: 8, missed: 2 },
  ];

  // Apple colors
  const appleColors = {
    onTime: "#30D158", // Apple green
    late: "#FF9F0A",   // Apple yellow/orange
    missed: "#FF453A"  // Apple red
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
        <CardTitle className="text-xl font-semibold text-slate-800">Review Completion Rates</CardTitle>
        <CardDescription className="text-sm text-slate-500">
          Tracking how performance reviews are completed (on time, late, missed) by period, encouraging accountability.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={completionData}
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
                dataKey="onTime" 
                stackId="a" 
                fill={appleColors.onTime} 
                name="On Time" 
              />
              <Bar 
                dataKey="late" 
                stackId="a" 
                fill={appleColors.late} 
                name="Late" 
              />
              <Bar 
                dataKey="missed" 
                stackId="a" 
                fill={appleColors.missed} 
                name="Missed" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}