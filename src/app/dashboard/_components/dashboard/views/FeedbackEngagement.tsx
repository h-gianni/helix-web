"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/core/Card";
import { FeedbackTrendChart } from "@/app/dashboard/_components/charts/FeedbackTrendChart";
import { FeedbackQualityMetrics } from "@/app/dashboard/_components/charts/FeedbackQualityMetrics";
import { ReviewCompletionRates } from "@/app/dashboard/_components/charts/ReviewCompletionRates";

export default function FeedbackEngagementTab() {
  return (
    <div className="space-y-6">
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-background rounded-md shadow-sm text-center">
              <div className="text-2xl font-bold">324</div>
              <div className="text-sm text-muted-foreground">Total Ratings</div>
            </div>
            <div className="p-4 bg-background rounded-md shadow-sm text-center">
              <div className="text-2xl font-bold">86</div>
              <div className="text-sm text-muted-foreground">Feedback Comments</div>
            </div>
            <div className="p-4 bg-background rounded-md shadow-sm text-center">
              <div className="text-2xl font-bold">92%</div>
              <div className="text-sm text-muted-foreground">Review Completion</div>
            </div>
            <div className="p-4 bg-background rounded-md shadow-sm text-center">
              <div className="text-2xl font-bold">8.4</div>
              <div className="text-sm text-muted-foreground">Engagement Score</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeedbackTrendChart />
        <FeedbackQualityMetrics />
      </div>
      
      <ReviewCompletionRates />
    </div>
  );
}