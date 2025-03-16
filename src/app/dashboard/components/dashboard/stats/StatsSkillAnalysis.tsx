"use client";

import React from "react";
import { StatsCard, StatItemProps } from "@/components/ui/composite/StatsCard";

export default function StatsSkillAnalysis() {
  const skillStats: StatItemProps[] = [
    {
      title: "Total Actions",
      value: 36
    },
    {
      title: "Categories",
      value: 12
    },
    {
      title: "Avg Rating",
      value: 3.8,
      trend: "up",
      trendValue: "5.2%",
      trendLabel: "vs last quarter"
    },
    {
      title: "Actions Completion",
      value: "84%",
      trend: "down",
      trendValue: "2.1%",
      trendLabel: "vs last quarter"
    }
  ];

  return (
      <StatsCard 
        items={skillStats} 
        columns={4} 
        withDividers={true} 
        // background="muted" 
      />
  );
}