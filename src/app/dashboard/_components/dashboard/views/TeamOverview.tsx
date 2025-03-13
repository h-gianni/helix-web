"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/core/Card";
import { TeamPerformanceChart } from "@/app/dashboard/_components/charts/TeamPerformanceChart";
import { TeamPerformanceTrend } from "@/app/dashboard/_components/charts/TeamPerformanceTrend";
import { TeamCompositionChart } from "@/app/dashboard/_components/charts/TeamCompositionChart";
import type { Member } from "@/store/member";
import type { TeamResponse } from "@/lib/types/api";

interface TeamOverviewTabProps {
  teams: TeamResponse[];
  performers: Member[];
}

export default function TeamOverviewTab({ teams, performers }: TeamOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Team Performance Summary */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-background rounded-md shadow-sm text-center">
              <div className="text-2xl font-bold">{teams.length}</div>
              <div className="text-sm text-muted-foreground">Total Teams</div>
            </div>
            <div className="p-4 bg-background rounded-md shadow-sm text-center">
              <div className="text-2xl font-bold">{performers.length}</div>
              <div className="text-sm text-muted-foreground">Total Members</div>
            </div>
            <div className="p-4 bg-background rounded-md shadow-sm text-center">
              <div className="text-2xl font-bold">
                {performers.filter(p => p.ratingsCount > 0).length > 0 
                  ? (performers.filter(p => p.ratingsCount > 0).reduce((sum, p) => sum + p.averageRating, 0) / 
                     performers.filter(p => p.ratingsCount > 0).length).toFixed(1)
                  : "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
            <div className="p-4 bg-background rounded-md shadow-sm text-center">
              <div className="text-2xl font-bold">{performers.filter(p => p.ratingsCount === 0).length}</div>
              <div className="text-sm text-muted-foreground">Not Rated</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Team Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamPerformanceChart teams={teams} performers={performers} />
        <TeamPerformanceTrend teams={teams} />
      </div>
      
      <TeamCompositionChart teams={teams} performers={performers} />
    </div>
  );
}