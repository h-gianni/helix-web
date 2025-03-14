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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function FeedbackTrendChart() {
  // Sample data for feedback over time
  const feedbackData = [
    { month: 'Jan', feedback: 65, ratings: 120 },
    { month: 'Feb', feedback: 59, ratings: 110 },
    { month: 'Mar', feedback: 80, ratings: 140 },
    { month: 'Apr', feedback: 81, ratings: 145 },
    { month: 'May', feedback: 56, ratings: 120 },
    { month: 'Jun', feedback: 55, ratings: 110 },
    { month: 'Jul', feedback: 40, ratings: 90 },
  ];

  // Apple colors
  const appleColors = {
    feedback: "#007AFF",  // Apple blue
    ratings: "#FF9500"     // Apple orange
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
        <CardTitle className="text-xl font-semibold text-slate-800">Feedback Trends</CardTitle>
        <CardDescription className="text-sm text-slate-500">
          Area chart showing the volume of feedback and ratings over time, helping track engagement with the feedback process.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={feedbackData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorFeedback" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={appleColors.feedback} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={appleColors.feedback} stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorRatings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={appleColors.ratings} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={appleColors.ratings} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#f1f1f1"
                vertical={false}
              />
              <XAxis 
                dataKey="month" 
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
              <Area 
                type="monotone" 
                dataKey="feedback" 
                name="Feedback"
                stroke={appleColors.feedback}
                strokeWidth={2} 
                fillOpacity={1}
                fill="url(#colorFeedback)" 
              />
              <Area 
                type="monotone" 
                dataKey="ratings" 
                name="Ratings"
                stroke={appleColors.ratings} 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRatings)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}