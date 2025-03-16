"use client";

import React from "react";
import StatsSkillAnalysis from "@/app/dashboard/components/dashboard/stats/StatsSkillAnalysis";
import { SkillAreaChart } from "@/app/dashboard/components/dashboard/charts/ChartSkillArea";
import { TopRatedActivities } from "@/app/dashboard/components/dashboard/charts/ChartTopRatedActivities";
import { SkillGapAnalysis } from "@/app/dashboard/components/dashboard/charts/ChartSkillGapAnalysis";

export default function ViewSkillAnalysis() {
  return (
    <div className="space-y-4">
      <StatsSkillAnalysis />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkillAreaChart />
        <TopRatedActivities />
      </div>

      <SkillGapAnalysis />
    </div>
  );
}
