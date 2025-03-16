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
  Legend,
} from "recharts";

// Sample data
const testData = [
  { name: "Test A", value: 80 },
  { name: "Test B", value: 65 },
  { name: "Test C", value: 45 },
];

// This component uses Recharts directly without BaseBarChart
export function DiagnosticChart({ layout = "vertical" }: { layout?: "vertical" | "horizontal" }) {
  // Generate gradient ID that's unique to this instance
  const gradientId = `diagnostic-gradient-${layout}-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <Card>
      <CardHeader size="sm">
        <CardTitle>
          Diagnostic Chart ({layout} layout)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={testData}
              layout={layout}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 30,
              }}
            >
              <defs>
                <linearGradient
                  id={gradientId}
                  // For vertical: left-to-right
                  // For horizontal: bottom-to-top
                  x1="0%"
                  y1={layout === "horizontal" ? "100%" : "0%"}
                  x2={layout === "vertical" ? "100%" : "0%"} 
                  y2={layout === "horizontal" ? "0%" : "0%"}
                >
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity={1} />
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" />
              
              {layout === "horizontal" ? (
                <>
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                </>
              ) : (
                <>
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" />
                </>
              )}
              
              <Tooltip />
              <Legend />
              
              <Bar
                dataKey="value"
                fill={`url(#${gradientId})`}
                radius={layout === "horizontal" ? [4, 4, 0, 0] : [0, 4, 4, 0]}
                name="Value"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}