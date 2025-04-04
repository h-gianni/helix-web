"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/core/Card";
import { BaseBarChart } from "@/components/ui/charts/BaseBarChart";

// Update the chartData to include both yearly and quarterly ratings
// Add custom labels for the legend
const chartData = [
  { 
    name: "Alex Johnson", 
    yearlyRating: 4.9, 
    quarterlyRating: 4.7,
    yearlyLabel: "Yearly", 
    quarterlyLabel: "Quarterly" 
  },
  { 
    name: "Jamie Smith", 
    yearlyRating: 4.7, 
    quarterlyRating: 4.9,
    yearlyLabel: "Yearly", 
    quarterlyLabel: "Quarterly" 
  },
  { 
    name: "Taylor Brown", 
    yearlyRating: 4.6, 
    quarterlyRating: 4.3,
    yearlyLabel: "Yearly", 
    quarterlyLabel: "Quarterly" 
  },
  { 
    name: "Morgan Davis", 
    yearlyRating: 4.5, 
    quarterlyRating: 4.8,
    yearlyLabel: "Yearly", 
    quarterlyLabel: "Quarterly" 
  },
  { 
    name: "Casey Wilson", 
    yearlyRating: 4.4, 
    quarterlyRating: 4.6,
    yearlyLabel: "Yearly", 
    quarterlyLabel: "Quarterly" 
  },
];

export function TopPerformersChart() {
  
  return (
    <Card>
      <CardHeader size="sm">
        <CardTitle>
          Top 5 Performers
        </CardTitle>
        <CardDescription>
          The highest-rated team members across your organization, comparing yearly 
          and quarterly performance metrics.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BaseBarChart
          data={chartData}
          xKey="name"
          yKeys={["yearlyRating", "quarterlyRating"]}
          labelKeys={["Last 12 months", "Last 6 months"]}
          layout="horizontal"
          barSize={32}
          height={260}
          variant="categorical"
          domain={[0, 5]}
          showLegend={true}
          margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
        />
      </CardContent>
    </Card>
  );
}
