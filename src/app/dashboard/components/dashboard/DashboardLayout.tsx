"use client";

import React, { useState, useRef, useEffect } from "react";
import { PageBreadcrumbs } from "@/components/ui/composite/AppHeader";
import { PageHeader } from "@/components/ui/composite/PageHeader";
import { Button } from "@/components/ui/core/Button";
import { MessageSquare, Star, TriangleAlert } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/core/Tabs";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/core/Alert";
import EmptyDashboardView from "@/app/dashboard/components/EmptyDashboardView";
import type { Member } from "@/store/member";
import type { TeamResponse } from "@/lib/types/api";
import { usePerformersStore } from "@/store/performers-store";
import { usePerformanceRatingStore } from "@/store/performance-rating-store";
import ViewTeamOverview from "@/app/dashboard/components/dashboard/views/ViewTeamOverview";
import IndividualPerformanceTab from "@/app/dashboard/components/dashboard/views/ViewIndividualPerformance";
import ViewSkillAnalysis from "@/app/dashboard/components/dashboard/views/ViewSkillAnalysis";
import ViewFeedbackEngagement from "@/app/dashboard/components/dashboard/views/ViewFeedbackEngagement";
import ImageBackgroundBanner from "@/components/ui/banners/ImageBackgroundBanner";
import SplitBanner from "@/components/ui/banners/SplitBanner";
import CountdownBanner from "@/components/ui/banners/CountdownBanner";
import AnnouncementBanner from "@/components/ui/banners/AnnouncementBanner";

const breadcrumbItems = [{ label: "Dashboard" }];

interface DashboardLayoutProps {
  performers: Member[];
  teams: TeamResponse[];
  router: any;
}

export default function DashboardLayout({
  performers,
  teams,
  router,
}: DashboardLayoutProps) {
  const { viewType, setViewType } = usePerformersStore();
  const { setIsOpen: openRatingModal } = usePerformanceRatingStore();
  const [currentTab, setCurrentTab] = useState("team");
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  const handlePrimaryBanner = () => {
    console.log("You clicked on banner Primary CTA");
    // Navigate to sign up or onboarding
    // router.push('/signup');
  };

  const handleSecondaryBanner = () => {
    console.log("You clicked on banner Secondary CTA");
    // Navigate to documentation
    // router.push('/docs/analytics');
  };

  const promoEndDate = new Date();
  promoEndDate.setDate(promoEndDate.getDate() + 14);

  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current) {
        const tabsPosition = tabsRef.current.getBoundingClientRect().top;
        setIsTabsSticky(tabsPosition <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <PageBreadcrumbs items={breadcrumbItems} />

      <main className="layout-page-main">
        <div className="pb-4">
          <ImageBackgroundBanner
            badgeText="Special Offer"
            title="25% Off Annual Plans"
            description="For a limited time only. Lock in this special rate for the entire year."
            primaryCta="Upgrade Now"
            secondaryCta="View Plans"
            onPrimaryClick={handlePrimaryBanner}
            onSecondaryClick={handleSecondaryBanner}
            imagePath="/hero.svg"
          />
        </div>

        <Tabs
          defaultValue="team"
          size="lg"
          className="w-full"
          onValueChange={(value) => setCurrentTab(value)}
        >
          <div
            ref={tabsRef}
            className={`flex justify-between items-center mb-4 transition-all z-10 bg-transparent
              ${
                isTabsSticky
                  ? "sticky top-0 shadow-md lg:shadow-none w-screen lg:w-auto lg:py-4 -mx-4 -my-0 lg:m-0"
                  : ""
              }`}
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="team">Team Overview</TabsTrigger>
              <TabsTrigger value="standings">Team Standings</TabsTrigger>
              <TabsTrigger value="skills">Skill Analysis</TabsTrigger>
              <TabsTrigger value="feedback">Feedback & Engagement</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="team" className="pt-2">
            <ViewTeamOverview teams={teams} performers={performers} />
          </TabsContent>

          <TabsContent value="standings" className="pt-2">
            <IndividualPerformanceTab
              performers={performers}
              teams={teams}
              viewType={viewType}
              setViewType={setViewType}
            />
          </TabsContent>

          <TabsContent value="skills" className="pt-2">
            <ViewSkillAnalysis />
          </TabsContent>

          <TabsContent value="feedback" className="pt-2">
            <ViewFeedbackEngagement />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
