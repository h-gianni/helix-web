"use client";

import React from "react";
import { FeedbackTrendChart } from "@/app/dashboard/components/dashboard/charts/ChartFeedbackTrend";
import { FeedbackQualityMetrics } from "@/app/dashboard/components/dashboard/charts/ChartFeedbackQualityMetrics";
import { ReviewCompletionRates } from "@/app/dashboard/components/dashboard/charts/ChartReviewCompletionRates";
import StatsFeedbackEngagement from "@/app/dashboard/components/dashboard/stats/StatsFeedbackEngagement";

export default function ViewFeedbackEngagement() {
  return (
    <div className="space-y-4">
      <StatsFeedbackEngagement />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FeedbackTrendChart />
        <FeedbackQualityMetrics />
      </div>

      <ReviewCompletionRates />
    </div>
  );
}