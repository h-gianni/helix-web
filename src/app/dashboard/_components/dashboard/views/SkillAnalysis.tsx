"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/core/Card";
import { SkillAreaChart } from "@/app/dashboard/_components/charts/SkillAreaChart";
import { TopRatedActivities } from "@/app/dashboard/_components/charts/TopRatedActivities";
import { SkillGapAnalysis } from "@/app/dashboard/_components/charts/SkillGapAnalysis";

export default function SkillAnalysisTab() {
  return (
    <div className="space-y-6">
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-background rounded-md shadow-sm text-center">
              <div className="text-2xl font-bold">246</div>
              <div className="text-sm text-muted-foreground">Total Activities</div>
            </div>
            <div className="p-4 bg-background rounded-md shadow-sm text-center">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="p-4 bg-background rounded-md shadow-sm text-center">
              <div className="text-2xl font-bold">3.8</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
            <div className="p-4 bg-background rounded-md shadow-sm text-center">
              <div className="text-2xl font-bold">84%</div>
              <div className="text-sm text-muted-foreground">Activity Completion</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillAreaChart />
        <TopRatedActivities />
      </div>
      
      <SkillGapAnalysis />
    </div>
  );
}