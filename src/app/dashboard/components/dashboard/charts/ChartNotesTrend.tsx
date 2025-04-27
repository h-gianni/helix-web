"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/core/Card";
import { BaseAreaChart } from "@/components/ui/charts/BaseAreaChart";

export function NotesTrendChart() {
  // Sample data for notes over time
  const NotesData = [
    { month: 'Jan', notes: 65, ratings: 120 },
    { month: 'Feb', notes: 59, ratings: 110 },
    { month: 'Mar', notes: 80, ratings: 140 },
    { month: 'Apr', notes: 81, ratings: 145 },
    { month: 'May', notes: 56, ratings: 120 },
    { month: 'Jun', notes: 55, ratings: 110 },
    { month: 'Jul', notes: 40, ratings: 90 },
  ];

  return (
    <Card>
      <CardHeader size="sm">
        <CardTitle>
        Notes Trends
        </CardTitle>
        <CardDescription>
          Area chart showing the volume of notes and ratings over time, helping track engagement with the notes process.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BaseAreaChart
          data={NotesData}
          xKey="month"
          yKeys={["notes", "ratings"]}
          height={280}
          variant="categorical"
          domain={[0, 'auto']}
          stacked={false}
          curved={true}
          margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
        />
      </CardContent>
    </Card>
  );
}
