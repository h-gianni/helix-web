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

const chartData = [
  { 
    name: "Jordan Mitchell", 
    yearlyRating: 2.2, 
    quarterlyRating: 2.4,
    yearlyLabel: "Yearly", 
    quarterlyLabel: "Quarterly" 
  },
  { 
    name: "Riley Carter", 
    yearlyRating: 2.5, 
    quarterlyRating: 2.9,
    yearlyLabel: "Yearly", 
    quarterlyLabel: "Quarterly" 
  },
  { 
    name: "Avery Logan", 
    yearlyRating: 2.6, 
    quarterlyRating: 2.3,
    yearlyLabel: "Yearly", 
    quarterlyLabel: "Quarterly" 
  },
  { 
    name: "Peyton Reed", 
    yearlyRating: 2.9, 
    quarterlyRating: 2.8,
    yearlyLabel: "Yearly", 
    quarterlyLabel: "Quarterly" 
  },
  { 
    name: "Skylar Bennett", 
    yearlyRating: 3.4, 
    quarterlyRating: 3.6,
    yearlyLabel: "Yearly", 
    quarterlyLabel: "Quarterly" 
  },
];

export function UnderPerformersChart() {
  return (
    <Card>
      <CardHeader size="sm">
        <CardTitle>
        Bottom 5 Performers
        </CardTitle>
        <CardDescription>
          The lowest-rated team members across your organization, comparing yearly 
          and half-year performance metrics.
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
