"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageBreadcrumbs } from "@/components/ui/composite/AppHeader";
import { PageHeader } from "@/components/ui/composite/PageHeader";
import { ProfileCard } from "@/components/ui/composite/ProfileCard";
import { Button } from "@/components/ui/core/Button";
import {
  Card,
  CardContent,
} from "@/components/ui/core/Card";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
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
import type { ApiResponse } from "@/lib/types/api";
import { EditMemberModal } from "./_editMemberModal";
import PerformanceRatingModal from "@/app/dashboard/_component/_performanceRatingModal";
import RatingsSection from "./_ratingsSection";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/core/Tabs";
import MemberDashboard from "./_memberDashboard";
import { useMemberStore } from "@/store/member-store";

interface Goal {
  id: string;
  description: string;
  year: number;
}

interface MemberDetails {
  id: string;
  firstName: string | null;
  lastName: string | null;
  title: string | null;
  isAdmin: boolean;
  user: {
    email: string;
    name: string | null;
  };
  goals: Goal[];
  team: {
    id: string;
    name: string;
  };
}

export default function MemberDetailsPage() {
  const params = useParams() as { teamId: string; memberId: string };
  const router = useRouter();
  const { setEditModalOpen, setRatingModalOpen } = useMemberStore();
  const [member, setMember] = useState<MemberDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const fetchMemberDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/teams/${params.teamId}/members/${params.memberId}`
      );
      const data: ApiResponse<MemberDetails> = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to fetch member details");
      }

      setMember(data.data);
    } catch (err) {
      console.error("Error fetching member:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberDetails();
    const handleFocus = () => fetchMemberDetails();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [params.teamId, params.memberId]);

  if (loading) {
    return <div className="ui-loader">Loading member details...</div>;
  }

  if (error || !member) {
    return (
      <div className="ui-loader-error">
        <Alert variant="danger">
          <AlertCircle />
          <AlertDescription>{error || "Member not found"}</AlertDescription>
        </Alert>
        <Button
          variant="neutral"
          volume="moderate"
          onClick={() => router.push(`/dashboard/teams/${params.teamId}`)}
          leadingIcon={<ArrowLeft />}
        >
          Back to Team
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
          <div className="flex gap-sm">
            <Button
              variant="neutral"
              volume="soft"
              onClick={() => setRatingModalOpen(true)}
              leadingIcon={<Plus />}
            >
              Add Rating
            </Button>
            <Button variant="primary" leadingIcon={<ChartNoAxesCombined />}>
              Generate Performance Review
            </Button>
          </div>
        }
      />

      <main className="ui-layout-page-main">
        <div className="flex gap-base flex-row-reverse">
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
                      {member.isAdmin && (
                        <Crown className="h-4 w-4 text-warning-400" />
                      )}
                    </>
                  ),
                },
              ]}
              onEdit={() => setEditModalOpen(true)}
              editButtonPosition="footer"
            />
          </div>

          <div className="w-full -mt-base">
            <Tabs defaultValue="dashboard" width="full">
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="ratings">Ratings</TabsTrigger>
                <TabsTrigger value="feedbacks">Feedbacks</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
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
                <p className="text-muted-foreground">
                  Feedbacks content coming soon...
                </p>
              </TabsContent>

              <TabsContent value="goals">
                <div className="w-full">
                  <div className="flex justify-end mb-4">
                    <Button variant="primary" asChild leadingIcon={<Target />}>
                      <Link
                        href={`/dashboard/teams/${params.teamId}/members/${params.memberId}/goals/add`}
                      >
                        Add Goal
                      </Link>
                    </Button>
                  </div>

                  {!member.goals?.length ? (
                    <p className="text-muted-foreground">No goals set yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {member.goals.map((goal) => (
                        <Card key={goal.id} size="sm" shadow="sm">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">Year: {goal.year}</p>
                                <p className="text-muted-foreground">
                                  {goal.description}
                                </p>
                              </div>
                              <Button
                                variant="neutral"
                                volume="soft"
                                size="sm"
                                asChild
                                leadingIcon={<PenSquare />}
                              >
                                <Link
                                  href={`/dashboard/teams/${params.teamId}/members/${params.memberId}/goals/${goal.id}/edit`}
                                >
                                  Edit
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
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