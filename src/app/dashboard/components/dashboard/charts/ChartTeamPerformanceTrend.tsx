"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/core/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/core/Select";
import { BaseLineChart } from "@/components/ui/charts/BaseLineChart";

// Static data
const timeSeriesData = [
    {
      period: "Q1 2023",
      Managers: 3.8,
      "Product Design": 4.2,
      "Design Technology": 4.2,
      Research: 4.2,
    },
    {
      period: "Q2 2023",
      Managers: 3.0,
      "Product Design": 4.6,
      "Design Technology": 4.2,
      Research: 4.4,
    },
    {
      period: "Q3 2023",
      Managers: 4.1,
      "Product Design": 3.5,
      "Design Technology": 3.7,
      Research: 4.1,
    },
    {
      period: "Q4 2023",
      Managers: 4.2,
      "Product Design": 4.4,
      "Design Technology": 4.2,
      Research: 3.9,
    },
    {
      period: "Q1 2024",
      Managers: 4.5,
      "Product Design": 4.0,
      "Design Technology": 3.7,
      Research: 4.1,
    },
  ];
  
  // Get team names for our chart
  const teamNames = Object.keys(timeSeriesData[0]).filter(key => key !== 'period');
  
  export function TeamPerformanceTrend() {
    const [timeRange, setTimeRange] = useState("quarter");
  
    // Custom dot component
    const CustomDot = (props: any) => {
      const { cx, cy, stroke, index, dataLength } = props;
      
      // Make first and last dots slightly larger
      const isEdgeDot = index === 0 || index === dataLength - 1;
      const radius = isEdgeDot ? 5 : 4;
      
      return (
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={stroke}
          strokeWidth={1}
          fill="#FFFFFF"
        />
      );
    };
  
    return (
      <Card>
        <CardHeader size="sm" className="flex flex-row items-start gap-8 justify-between pb-2">
          <div className="space-y-1">
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>
              How each team&apos;s performance has evolved over time, highlighting improvement or decline patterns.
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36 text-sm border border-slate-200 rounded-lg bg-white shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border border-slate-200 shadow-md rounded-lg">
              <SelectItem value="quarter" className="text-sm">Quarterly</SelectItem>
              <SelectItem value="half-year" className="text-sm">Half-Yearly</SelectItem>
              <SelectItem value="year" className="text-sm">Yearly</SelectItem>
              <SelectItem value="two-years" className="text-sm">Last 2 Years</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <BaseLineChart
            data={timeSeriesData}
            xKey="period"
            yKeys={teamNames}
            height={240}
            domain={[0, 5]}
            customDot={CustomDot}
            curved={true}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          />
        </CardContent>
      </Card>
    );
  }