"use client";

import React, { useState } from "react";
import { PageBreadcrumbs } from "@/components/ui/composite/App-header";
import { PageHeader } from "@/components/ui/composite/Page-header";
import { Button } from "@/components/ui/core/Button";
import { MessageSquare, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/core/Tabs";
import PerformanceRatingModal from "@/app/dashboard/_components/_performance-scoring-modal";
import EmptyDashboardView from "@/app/dashboard/_components/_empty-dashboard-view";
import type { Member } from "@/store/member";
import type { TeamResponse } from "@/lib/types/api";
import { usePerformersStore } from "@/store/performers-store";
import { usePerformanceRatingStore } from "@/store/performance-rating-store";
import TeamOverviewTab from "@/app/dashboard/_components/dashboard/views/TeamOverview";
import IndividualPerformanceTab from "@/app/dashboard/_components/dashboard/views/IndividualPerformance";
import SkillAnalysisTab from "@/app/dashboard/_components/dashboard/views/SkillAnalysis";
import FeedbackEngagementTab from "@/app/dashboard/_components/dashboard/views/FeedbackEngagement";

const breadcrumbItems = [{ label: "Dashboard" }];

interface DashboardLayoutProps {
  performers: Member[];
  teams: TeamResponse[];
  router: any;
}

export default function DashboardLayout({ performers, teams, router }: DashboardLayoutProps) {
  const { viewType, setViewType } = usePerformersStore();
  const { setIsOpen: openRatingModal } = usePerformanceRatingStore();
  const [currentTab, setCurrentTab] = useState("team");

  return (
    <>
      <PageBreadcrumbs items={breadcrumbItems} />
      
      <PageHeader
        title="Dashboard"
        actions={
          <>
            <Button
              data-slot="button"
              variant="secondary"
              onClick={() => router.push("/dashboard/feedback")}
              className="gap-2"
            >
              <MessageSquare className="size-4" /> Add Feedback
            </Button>
            <Button
              data-slot="button"
              variant="default"
              onClick={() => openRatingModal(true)}
              className="gap-2"
            >
              <Star className="size-4" /> Rate Performance
            </Button>
          </>
        }
      />

      <main className="layout-page-main">
        <Tabs 
          defaultValue="team" 
          className="w-full"
          onValueChange={(value) => setCurrentTab(value)}
        >
          <div className="flex justify-between items-center mb-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="team">Team Overview</TabsTrigger>
              <TabsTrigger value="individual">Individual Performance</TabsTrigger>
              <TabsTrigger value="skills">Skill Analysis</TabsTrigger>
              <TabsTrigger value="feedback">Feedback & Engagement</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="team">
            <TeamOverviewTab teams={teams} performers={performers} />
          </TabsContent>
          
          <TabsContent value="individual">
            <IndividualPerformanceTab 
              performers={performers} 
              teams={teams} 
              viewType={viewType}
              setViewType={setViewType}
            />
          </TabsContent>
          
          <TabsContent value="skills">
            <SkillAnalysisTab />
          </TabsContent>
          
          <TabsContent value="feedback">
            <FeedbackEngagementTab />
          </TabsContent>
        </Tabs>
      </main>
      
      <PerformanceRatingModal />
    </>
  );
}