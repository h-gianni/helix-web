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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/core/Tabs";
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
    setRatingModalOpen 
  } = useMemberStore();

  const { 
    data: member,
    isLoading,
    error
  } = useMemberDetails({ teamId: params.teamId, memberId: params.memberId });

  const breadcrumbItems = [
    { href: "/dashboard/teams", label: "Teams" },
    {
      href: `/dashboard/teams/${params.teamId}`,
      label: member?.team?.name || "Team",
    },
    {
      label: member?.firstName && member?.lastName
        ? `${member.firstName} ${member.lastName}`
        : member?.user?.email || "Member Details",
    },
  ];

  if (isLoading) {
    return <div className="loader"><Loader size="base" label="Loading..." /></div>;
  }

  if (error || !member) {
    return (
      <div className="ui-loader-error">
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>
            {error instanceof Error ? error.message : "Member not found"}
          </AlertDescription>
        </Alert>
        <Button
          variant="secondary"
          onClick={() => router.push(`/dashboard/teams/${params.teamId}`)}
        >
          <ArrowLeft /> Back to Team
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
        icon={member.isAdmin && <Crown className="ui-text-warning" />}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => setRatingModalOpen(true)}
            >
              <Plus /> Add Rating
            </Button>
            <Button variant="default">
            <ChartNoAxesCombined /> Generate Performance Review
            </Button>
          </>
        }
      />

      <main className="layout-page-main">
        <div className="flex gap-2 flex-row-reverse">
          <div className="w-80">
            <ProfileCard
              align="vertical"
              fields={[
                {
                  label: "Full Name",
                  value: member.firstName && member.lastName
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
                      {member.isAdmin && <Crown className="h-4 w-4 text-warning-400" />}
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
                <div className="missing-content">
                  No feedback yet.
                </div>
              </TabsContent>

              {/* <TabsContent value="goals">
                <div className="w-full">
                  <div className="flex justify-end mb-4">
                    <Button variant="default" asChild>
                      <Link
                        href={`/dashboard/teams/${params.teamId}/members/${params.memberId}/goals/add`}
                      >
                        <Target /> Add Goal
                      </Link>
                    </Button>
                  </div>

                  {!member.goals?.length ? (
                    <div className="missing-content">No goals set yet.</div>
                  ) : (
                    <div className="space-y-4">
                      {member.goals.map((goal) => (
                        <Card key={goal.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">Year: {goal.year}</p>
                                <p className="text-foreground-muted">
                                  {goal.description}
                                </p>
                              </div>
                              <Button
                                variant="secondary"
                                asChild
                              >
                                <Link
                                  href={`/dashboard/teams/${params.teamId}/members/${params.memberId}/goals/${goal.id}/edit`}
                                >
                                  <PenSquare /> Edit
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent> */}
            </Tabs>
          </div>
        </div>
      </main>

      <EditMemberModal
        memberId={params.memberId}
        teamId={params.teamId}
      />

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