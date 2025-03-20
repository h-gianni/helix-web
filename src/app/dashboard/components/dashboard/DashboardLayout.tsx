"use client";

import React, { useState } from "react";
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
import PerformanceRatingModal from "@/app/dashboard/components/scoring/ScoringModal";
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
              <MessageSquare className="hidden md:block" /> Add a Feedback
            </Button>
            <Button
              data-slot="button"
              variant="default"
              onClick={() => openRatingModal(true)}
              className="gap-2"
            >
              <Star /> Score a Performance
            </Button>
          </>
        }
      />

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
          {/* <SplitBanner
            badgeText="Team Collaboration"
            title="Work together, transparently"
            description="You can now customize and share your team member performance reports with ease and in real-time."
            bulletPoints={collaborationFeatures}
            primaryCta="Upgrade to Pro"
            secondaryCta="Watch Demo"
            onPrimaryClick={handlePrimaryBanner}
            onSecondaryClick={handleSecondaryBanner}
            imagePath="/hero.svg"
            imageAlt="People collaborating on a document"
            imagePosition="right"
          /> */}
          {/* <CountdownBanner
            badgeText="Black Friday Deal"
            title="50% Off Premium Plan"
            description="Our biggest discount of the year is here. Upgrade now and save big on all premium features."
            endDate={promoEndDate}
            primaryCta="Claim This Offer"
            secondaryCta="See What's Included"
            onPrimaryClick={handleClaimOffer}
            onSecondaryClick={handleLearnMore}
            bgColor="bg-gradient-to-r from-[var(--accent-dark)] to-[var(--primary-darker)]"
          /> */}
          {/* <AnnouncementBanner
            badgeText="New feature"
            title="Slack Integration"
            description="Now you can score your team performance via Slack"
            primaryCta="See it in action"
            secondaryCta="See it in action"
            onPrimaryClick={handlePrimaryBanner}
            onSecondaryClick={handleSecondaryBanner}
            color="primary"
          /> */}
        </div>

        {/* <Alert variant="warning">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            The more scores and feedback you give, more relevant data will be
            shown.
          </AlertDescription>
        </Alert> */}

        <Tabs
          defaultValue="team"
          size="lg"
          className="w-full"
          onValueChange={(value) => setCurrentTab(value)}
        >
          <div className="flex justify-between items-center mb-4">
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

      <PerformanceRatingModal />
    </>
  );
}
