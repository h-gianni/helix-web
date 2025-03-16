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

export function ReviewCompletionRates() {
  // Sample data for review completion rates
  const completionData = [
    { name: "Q1 2024", onTime: 85, late: 10, missed: 5 },
    { name: "Q2 2024", onTime: 78, late: 15, missed: 7 },
    { name: "Q3 2024", onTime: 82, late: 12, missed: 6 },
    { name: "Q4 2024", onTime: 88, late: 10, missed: 2 },
    { name: "Q1 2025", onTime: 90, late: 8, missed: 2 },
  ];

  return (
    <Card>
      <CardHeader size="sm">
        <CardTitle>
          Review Completion Rates
        </CardTitle>
        <CardDescription>
          Tracking how performance reviews are completed (on time, late, missed) by period, encouraging accountability.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BaseBarChart
          data={completionData}
          xKey="name"
          yKeys={["onTime", "late", "missed"]}
          stacked={true}
          layout="horizontal"
          barSize={160}
          height={260}
          variant="categorical"
          margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
        />
      </CardContent>
    </Card>
  );
}
