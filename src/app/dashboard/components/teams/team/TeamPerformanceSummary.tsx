// app/dashboard/teams/[teamId]/_teamPerformanceSummary.tsx
import React from "react";
import { TeamPerformanceView } from "@/app/dashboard/components/TeamPerformanceView";
import { ViewSwitcher } from "@/components/ui/composite/ViewSwitcher";
import { MemberPerformance } from "@/store/member";
import { usePerformersStore } from "@/store/performers-store";

interface TeamPerformanceSummaryProps {
  teamId: string;
  teamName: string;
  members: MemberPerformance[];
}

export function TeamPerformanceSummary({
  teamId,
  members,
}: TeamPerformanceSummaryProps) {
  const { viewType, setViewType } = usePerformersStore();

  if (!members || members.length === 0) {
    return null;
  }

  return (
    <main className="layout-page-main">
      <div className="ui-view-controls-bar">
        {/* Hide ViewSwitcher on mobile */}
        <div className="hidden md:block">
          <ViewSwitcher viewType={viewType} onViewChange={setViewType} />
        </div>
      </div>

      <TeamPerformanceView
        teamId={teamId}
        members={members}
        showAvatar
        showActions
        mode="desktop"
        viewType={viewType}
        onViewChange={setViewType}
      />
    </main>
  );
}