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
  ResponsiveContainer,
} from "recharts";

export function TopRatedActivities() {
  // Sample data - in a real implementation, would come from API
  const activityData = [
    { name: "Code Reviews", rating: 4.7, count: 45 },
    { name: "Client Meetings", rating: 4.5, count: 32 },
    { name: "Problem Solving", rating: 4.4, count: 38 },
    { name: "Documentation", rating: 4.2, count: 25 },
    { name: "Knowledge Sharing", rating: 4.1, count: 40 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Rated Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={activityData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 5]} />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(value) => [`${value} / 5`, "Rating"]} />
              <Bar 
                dataKey="rating" 
                fill="#10b981" 
                radius={[0, 4, 4, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}