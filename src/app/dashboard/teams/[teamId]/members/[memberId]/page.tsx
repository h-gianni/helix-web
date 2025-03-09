"use client";

import { useParams, useRouter } from "next/navigation";
import { PageBreadcrumbs } from "@/components/ui/composite/App-header";
import { PageHeader } from "@/components/ui/composite/Page-header";
import { ProfileCard } from "@/components/ui/composite/Profile-card";
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
import { EditMemberModal } from "../../../../_components/_member/_edit-member-modal";
import PerformanceRatingModal from "@/app/dashboard/_components/_performance-scoring-modal";
import RatingsSection from "../../../../_components/_member/_ratings-section";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/core/Tabs";
import MemberDashboard from "../../../../_components/_member/_member-dashboard";
import { useMemberDetails, useMemberStore } from "@/store/member-store";

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

  const { data: member, isLoading, error } = useMemberDetails({
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
            <Button
              data-slot="button"
              variant="secondary"
              onClick={() => setRatingModalOpen(true)}
            >
              <Plus className="size-4" /> Add Rating
            </Button>
            <Button data-slot="button" variant="default">
              <ChartNoAxesCombined className="size-4" /> Generate Performance Review
            </Button>
          </>
        }
      />

      <main className="layout-page-main">
        <div className="flex flex-row-reverse gap-2">
          <div className="w-80">
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
                      {member.isAdmin && <Crown className="size-4 text-warning-400" />}
                    </>
                  ),
                },
              ]}
              onEdit={() => setEditModalOpen(true)}
              editButtonPosition="footer"
            />
          </div>

          <div className="w-full">
            <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)}>
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="ratings">Ratings</TabsTrigger>
                <TabsTrigger value="feedbacks">Feedback</TabsTrigger>
                {/* <TabsTrigger value="goals">Goals</TabsTrigger> */}
              </TabsList>

              <TabsContent value="dashboard">
                <MemberDashboard teamId={params.teamId} memberId={params.memberId} />
              </TabsContent>

              <TabsContent value="ratings">
                <RatingsSection
                  teamId={params.teamId}
                  memberId={params.memberId}
                  onAddRating={() => setRatingModalOpen(true)}
                />
              </TabsContent>

              <TabsContent value="feedbacks">
                <div className="missing-content">No feedback yet.</div>
              </TabsContent>

              {/* <TabsContent value="goals">
                ...
              </TabsContent> */}
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
