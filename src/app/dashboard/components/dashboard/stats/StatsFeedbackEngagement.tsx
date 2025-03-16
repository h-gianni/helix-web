"use client";

import React from "react";
import { StatsCard, StatItemProps } from "@/components/ui/composite/StatsCard";

export default function ViewFeedbackEngagement() {
  const feedbackStats: StatItemProps[] = [
    {
      title: "Total Scores",
      value: 324,
      trend: "up",
      trendValue: "8.2%",
      trendLabel: "vs last quarter"
    },
    {
      title: "Total Feedbacks",
      value: 86,
      trend: "down",
      trendValue: "1.3%",
      trendLabel: "vs last quarter"
    },
    {
      title: "Review Completion",
      value: "92%",
      trend: "up",
      trendValue: "4.3%",
      trendLabel: "vs last quarter"
    },
    {
      title: "Engagement Score",
      value: 8.4,
      trend: "up",
      trendValue: "0.6",
      trendLabel: "vs last quarter"
    }
  ];

  return (
      <StatsCard 
        items={feedbackStats} 
        columns={4} 
        withDividers={false} 
        background="muted" 
      />
  );
}