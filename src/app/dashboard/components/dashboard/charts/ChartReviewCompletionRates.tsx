"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
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
  // In a real implementation, this would come from your API
  const completionData = [
    { name: "Q1 2023", onTime: 85, late: 10, missed: 5 },
    { name: "Q2 2023", onTime: 78, late: 15, missed: 7 },
    { name: "Q3 2023", onTime: 82, late: 12, missed: 6 },
    { name: "Q4 2023", onTime: 88, late: 10, missed: 2 },
    { name: "Q1 2024", onTime: 90, late: 8, missed: 2 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Completion Rates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={completionData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="onTime" stackId="a" fill="#10b981" name="On Time" />
              <Bar dataKey="late" stackId="a" fill="#f59e0b" name="Late" />
              <Bar dataKey="missed" stackId="a" fill="#ef4444" name="Missed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}