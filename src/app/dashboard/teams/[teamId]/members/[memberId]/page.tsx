"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageBreadcrumbs } from "@/app/dashboard/_component/_appHeader";
import { Button } from "@/components/ui/core/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/core/Card";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { Avatar, AvatarFallback } from "@/components/ui/core/Avatar";
import {
  PenSquare,
  ArrowLeft,
  Crown,
  Target,
  AlertCircle,
  ChartNoAxesCombined,
} from "lucide-react";
import Link from "next/link";
import type { ApiResponse } from "@/lib/types/api";
import { EditMemberModal } from "./_editMemberModal";
import PerformanceRatingModal from "@/app/dashboard/_component/_performanceRatingModal";
import RatingsSection from "./_ratingsSection";
import { Label } from "@/components/ui/core/Label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/core/Tabs";
import MemberDashboard from "./_memberDashboard";

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
  const [member, setMember] = useState<MemberDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

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

  const fetchMemberDetails = useCallback(async () => {
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
  }, [params.teamId, params.memberId]);

  const handleRatingSubmit = async (data: {
    activityId: string;
    rating: number;
    feedback?: string;
  }) => {
    try {
      const response = await fetch(
        `/api/teams/${params.teamId}/members/${params.memberId}/ratings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to save rating");
      }

      setIsRatingModalOpen(false);
      fetchMemberDetails();
    } catch (err) {
      console.error("Error saving rating:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchMemberDetails();
    const handleFocus = () => fetchMemberDetails();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchMemberDetails]);

  if (loading) {
    return (
      <div className="p-4 text-muted-foreground">Loading member details...</div>
    );
  }

  if (error || !member) {
    return (
      <>
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
      </>
    );
  }

  return (
    <>
      <PageBreadcrumbs items={breadcrumbItems} />

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Button
              variant="neutral"
              iconOnly
              size="sm"
              onClick={() => router.push(`/dashboard/teams/${params.teamId}`)}
              leadingIcon={<ArrowLeft />}
            />
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              {member.firstName && member.lastName
                ? `${member.firstName} ${member.lastName}`
                : member.user.email}
              {member.isAdmin && <Crown className="text-warning-400" />}
            </h1>
          </div>
          <Button variant="primary" leadingIcon={<ChartNoAxesCombined />}>
            Generate Performance Review
          </Button>
        </div>
      </div>

      <div className="flex gap-base flex-row-reverse">
        <div className="w-80">
          <Card>
            <CardHeader className="relative h-40">
              <img
                src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Profile background"
                className="w-full h-full object-cover"
              />
            </CardHeader>
            <CardContent>
              <div className="py-sm space-y-sm">
                <div>
                  <Label>Full Name</Label>
                  <p>
                    {member.firstName && member.lastName
                      ? `${member.firstName} ${member.lastName}`
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p>{member.user.email}</p>
                </div>
                <div>
                  <Label>Job Title</Label>
                  <p>{member.title || "Not set"}</p>
                </div>
                <div>
                  <Label>Team</Label>
                  <p>{member.team?.name || "Not found"}</p>
                </div>
                <div>
                  <Label>Role</Label>
                  <p className="flex items-center gap-2">
                    {member.isAdmin ? "Admin" : "Member"}
                    {member.isAdmin && (
                      <Crown className="h-4 w-4 text-warning-400" />
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="neutral"
                volume="soft"
                onClick={() => setIsEditModalOpen(true)}
                leadingIcon={<PenSquare />}
                className="w-full"
              >
                Edit Profile
              </Button>
            </CardFooter>
          </Card>
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
              <div>
                <MemberDashboard
                  teamId={params.teamId}
                  memberId={params.memberId}
                />
              </div>
            </TabsContent>

            <TabsContent value="ratings">
              <div className="w-full">
                <RatingsSection
                  teamId={params.teamId}
                  memberId={params.memberId}
                  onAddRating={() => setIsRatingModalOpen(true)}
                />
              </div>
            </TabsContent>

            <TabsContent value="feedbacks">
              <div className="w-full">
                <p className="text-muted-foreground">
                  Feedbacks content coming soon...
                </p>
              </div>
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

      <EditMemberModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        memberId={params.memberId}
        teamId={params.teamId}
        onUpdate={fetchMemberDetails}
      />

      <PerformanceRatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        teamId={params.teamId}
        memberId={params.memberId}
        memberName={
          member.firstName && member.lastName
            ? `${member.firstName} ${member.lastName}`
            : member.user.email
        }
        memberTitle={member.title}
        onSubmit={handleRatingSubmit}
      />
    </>
  );
}
