"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/core/Card";
import { BasePieChart } from "@/components/ui/charts/BasePieChart";

import { Loader } from "@/components/ui/core/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { usePerformanceDistribution } from "@/store/performence-distribution-store";

// Fallback data in case API fails or for initial loading
const fallbackData = [
  { name: "Star", value: 2 },
  { name: "Strong", value: 3 },
  { name: "Solid", value: 3 },
  { name: "Lower", value: 1 },
  { name: "Poor", value: 1 },
  { name: "Not Scored", value: 1 },
];

export function PerformanceDistribution() {
  const { data, isLoading, error } = usePerformanceDistribution();

  // Category colors
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Star": return "#10b981"; // success-500
      case "Strong": return "#22c55e"; // success-400
      case "Solid": return "#3b82f6"; // primary-500
      case "Lower": return "#f59e0b"; // warning-500
      case "Poor": return "#ef4444"; // destructive-500
      case "Not Scored": return "#6b7280"; // gray-500
      default: return "#6b7280";
    }
  };

  // Custom color scale for the pie chart
  const customColors = (category: string) => getCategoryColor(category);

  // Display error if the API call fails
  if (error) {
    return (
      <Card>
        <CardHeader size="sm">
          <CardTitle>Performance Distribution</CardTitle>
          <CardDescription>
            Distribution of team members across different performance categories.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>
              {error instanceof Error ? error.message : "Failed to load performance distribution"}
            </AlertDescription>
          </Alert>
          
          {/* Render with fallback data anyway */}
          <div className="mt-4">
            <BasePieChart
              data={fallbackData}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
              labelType="name-percent"
              height={260}
              variant="categorical"
              showLegend={false}
              // colorKey={customColors}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader size="sm">
        <CardTitle>Performance Distribution</CardTitle>
        <CardDescription>
          Distribution of team members across different performance categories.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[260px]">
            <Loader className="size-8 text-primary" />
          </div>
        ) : (
          <BasePieChart
            data={data || fallbackData}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={2}
            labelType="name-percent"
            height={260}
            variant="categorical"
            showLegend={false}
            // colorKey={customColors}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          />
        )}
      </CardContent>
    </Card>
  );
}