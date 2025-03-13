"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
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
  // In a real implementation, this would come from your API
  const feedbackData = [
    { month: 'Jan', feedback: 65, ratings: 120 },
    { month: 'Feb', feedback: 59, ratings: 110 },
    { month: 'Mar', feedback: 80, ratings: 140 },
    { month: 'Apr', feedback: 81, ratings: 145 },
    { month: 'May', feedback: 56, ratings: 120 },
    { month: 'Jun', feedback: 55, ratings: 110 },
    { month: 'Jul', feedback: 40, ratings: 90 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={feedbackData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="feedback" 
                stackId="1"
                stroke="#3b82f6" 
                fill="#3b82f6" 
              />
              <Area 
                type="monotone" 
                dataKey="ratings" 
                stackId="1"
                stroke="#10b981" 
                fill="#10b981" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}