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
import type { Member } from "@/store/member";

interface TopPerformersChartProps {
  performers: Member[];
}

export function TopPerformersChart({ performers }: TopPerformersChartProps) {
  // Get top 10 performers by rating
  const topPerformers = [...performers]
    .filter(p => p.ratingsCount > 0)
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topPerformers}
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
                dataKey="averageRating" 
                fill="#3b82f6" 
                radius={[0, 4, 4, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}