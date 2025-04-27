"use client";

import React from "react";
import { NotesTrendChart } from "@/app/dashboard/components/dashboard/charts/ChartNotesTrend";
import { NotesQualityMetrics } from "@/app/dashboard/components/dashboard/charts/ChartNotesQualityMetrics";
import { ReviewCompletionRates } from "@/app/dashboard/components/dashboard/charts/ChartReviewCompletionRates";
import StatsNotesEngagement from "@/app/dashboard/components/dashboard/stats/StatsNotesEngagement";

export default function ViewNotesEngagement() {
  return (
    <div className="space-y-4">
      <StatsNotesEngagement />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <NotesTrendChart />
        <NotesQualityMetrics />
      </div>

      <ReviewCompletionRates />
    </div>
  );
}