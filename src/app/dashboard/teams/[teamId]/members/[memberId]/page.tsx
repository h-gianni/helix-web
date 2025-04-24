"use client";

import { useParams, useRouter } from "next/navigation";
import { PageBreadcrumbs } from "@/components/ui/composite/AppHeader";
import { PageHeader } from "@/components/ui/composite/PageHeader";
import { ProfileCard } from "@/components/ui/composite/ProfileCard";
import { Button } from "@/components/ui/core/Button";
import { Card, CardContent } from "@/components/ui/core/Card";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { Loader } from "@/components/ui/core/Loader";
import {
  PenSquare,
  ArrowLeft,
  Crown,
  Target,
  AlertCircle,
  ChartNoAxesCombined,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { EditMemberModal } from "@/app/dashboard/components/teams/team/member/MemberEditModal";
import PerformanceRatingModal from "@/app/dashboard/components/scoring/ScoringModal";
import RatingsSection from "@/app/dashboard/components/teams/team/member/MemberRatingsSection";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/core/Tabs";
import MemberDashboard from "@/app/dashboard/components/teams/team/member/MemberDashboard";
import { useMemberDetails, useMemberStore } from "@/store/member-store";
import MemberReviewsList from "@/app/dashboard/components/teams/team/member/MemberReviewsList";
import { GenerateReviewModal } from "@/app/dashboard/components/teams/team/member/GenerateReviewModal";
import { useState } from "react";

export default function MemberDetailsPage() {
  const params = useParams() as { teamId: string; memberId: string };
  const router = useRouter();

  const {
    selectedTab,
    isEditModalOpen,
    isRatingModalOpen,
    setSelectedTab,
    setEditModalOpen,
    setRatingModalOpen,
  } = useMemberStore();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const {
    data: member,
    isLoading,
    error,
  } = useMemberDetails({
    teamId: params.teamId,
    memberId: params.memberId,
  });

  const breadcrumbItems = [
    { href: "/dashboard/teams", label: "Teams" },
    {
      href: `/dashboard/teams/${params.teamId}`,
      label: member?.team?.name || "Team",
    },
    {
      label:
        member?.firstName && member?.lastName
          ? `${member.firstName} ${member.lastName}`
          : member?.user?.email || "Member Details",
    },
  ];

  const handleGenerateReview = () => {
    console.log("handleGenerateReview");
    setIsReviewModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="loader">
        <Loader size="base" label="Loading..." />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="ui-loader-error">
        <Alert data-slot="alert" variant="destructive">
          {/* Replace h-# w-# with size-4 if needed */}
          <AlertCircle className="size-4" />
          <AlertDescription data-slot="alert-description">
            {error instanceof Error ? error.message : "Member not found"}
          </AlertDescription>
        </Alert>
        <Button
          data-slot="button"
          variant="secondary"
          onClick={() => router.push(`/dashboard/teams/${params.teamId}`)}
        >
          <ArrowLeft className="size-4" /> Back to Team
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageBreadcrumbs items={breadcrumbItems} />
      <PageHeader
        title={
          member.firstName && member.lastName
            ? `${member.firstName} ${member.lastName}`
            : member.user.email || "Member Details"
        }
        backButton={{
          onClick: () => router.push(`/dashboard/teams/${params.teamId}`),
        }}
        icon={member.isAdmin && <Crown className="text-warning size-4" />}
        actions={
          <>
            {/* <Button data-slot="button" variant="default" onClick={handleGenerateReview}>
              <ChartNoAxesCombined className="size-4" /> Generate Performance Review
            </Button> */}
            <GenerateReviewModal
              teamId={params.teamId}
              memberId={params.memberId}
              // isOpen={isReviewModalOpen}
              memberName={member.firstName + " " + member.lastName}
              // onClose={() => setIsReviewModalOpen(false)}
            />
          </>
        }
      />

      <main className="layout-page-main">
        <div className="lg:flex flex-row-reverse gap-2 space-y-4 lg:space-y-0">
          <div className="lg:w-80">
            <ProfileCard
              align="vertical"
              fields={[
                {
                  label: "Full Name",
                  value:
                    member.firstName && member.lastName
                      ? `${member.firstName} ${member.lastName}`
                      : "Not set",
                },
                {
                  label: "Email",
                  value: member.user.email,
                },
                {
                  label: "Job Title",
                  value: member.title || "Not set",
                },
                {
                  label: "Team",
                  value: member.team?.name || "Not found",
                },
                {
                  label: "Role",
                  value: (
                    <>
                      {member.isAdmin ? "Admin" : "Member"}
                      {member.isAdmin && (
                        <Crown className="size-4 text-warning-400" />
                      )}
                    </>
                  ),
                },
              ]}
              onEdit={() => setEditModalOpen(true)}
              editButtonPosition="footer"
            />
          </div>

          <div className="w-full">
            <Tabs
              value={selectedTab}
              onValueChange={(value) => setSelectedTab(value as any)}
            >
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="ratings">Ratings</TabsTrigger>
                <TabsTrigger value="feedbacks">Feedback</TabsTrigger>
                {/* <TabsTrigger value="goals">Goals</TabsTrigger> */}
                <TabsTrigger value="reviews">Performance Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="mt-4">
                <MemberDashboard
                  teamId={params.teamId}
                  memberId={params.memberId}
                />
              </TabsContent>

              <TabsContent value="ratings">
                <RatingsSection
                  teamId={params.teamId}
                  memberId={params.memberId}
                  onAddRating={() => setRatingModalOpen(true)}
                />
              </TabsContent>

              <TabsContent value="feedbacks">
                <div className="missing-content">No feedback.</div>
              </TabsContent>

              <TabsContent value="reviews">
                <MemberReviewsList
                  teamId={params.teamId}
                  memberId={params.memberId}
                  onGenerateReview={handleGenerateReview}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <EditMemberModal memberId={params.memberId} teamId={params.teamId} />

      <PerformanceRatingModal
        teamId={params.teamId}
        memberId={params.memberId}
        memberName={
          member.firstName && member.lastName
            ? `${member.firstName} ${member.lastName}`
            : member.user.email || ""
        }
        memberTitle={member.title}
      />
    </>
  );
}
