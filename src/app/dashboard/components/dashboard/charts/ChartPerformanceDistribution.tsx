"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/core/Card";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Member } from "@/store/member";

interface PerformanceDistributionProps {
  performers: Member[];
}

export function PerformanceDistribution({ performers }: PerformanceDistributionProps) {
  // Create distribution data based on rating ranges
  // This would integrate with your existing performanceCategories in a real implementation
  const distributionData = [
    { name: "Star (4.6-5.0)", value: performers.filter(p => p.ratingsCount > 0 && p.averageRating >= 4.6).length, color: "#10b981" },
    { name: "Strong (4.0-4.5)", value: performers.filter(p => p.ratingsCount > 0 && p.averageRating >= 4.0 && p.averageRating < 4.6).length, color: "#34d399" },
    { name: "Solid (3.0-3.9)", value: performers.filter(p => p.ratingsCount > 0 && p.averageRating >= 3.0 && p.averageRating < 4.0).length, color: "#3b82f6" },
    { name: "Lower (2.1-2.9)", value: performers.filter(p => p.ratingsCount > 0 && p.averageRating >= 2.1 && p.averageRating < 3.0).length, color: "#f59e0b" },
    { name: "Poor (1.0-2.0)", value: performers.filter(p => p.ratingsCount > 0 && p.averageRating >= 1.0 && p.averageRating < 2.1).length, color: "#ef4444" },
    { name: "Not Scored", value: performers.filter(p => p.ratingsCount === 0).length, color: "#6b7280" },
  ].filter(item => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip formatter={(value) => [`${value} members`, ""]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}