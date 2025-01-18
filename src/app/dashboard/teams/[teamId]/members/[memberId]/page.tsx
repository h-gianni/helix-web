// app/dashboard/teams/[teamId]/members/[memberId]/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageBreadcrumbs } from "@/app/dashboard/_component/_appHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { PenSquare, ArrowLeft, Crown, Target, AlertCircle } from "lucide-react";
import Link from "next/link";
import type { ApiResponse } from "@/lib/types/api";
import { EditMemberModal } from "./_editMemberModal";
import PerformanceRatingModal from "@/app/dashboard/_component/_performanceRatingModal";
import RatingsSection from "./_ratingsSection";
import { Label } from "@/components/ui/Label";

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
    initiativeId: string;
    rating: number;
    feedback?: string;
  }) => {
    try {
      const response = await fetch(
        `/api/teams/${params.teamId}/members/${params.memberId}/ratings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save rating");
      }

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
  }, [fetchMemberDetails]);

  // Refresh on window focus
  useEffect(() => {
    const handleFocus = () => {
      fetchMemberDetails();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchMemberDetails]);

  if (loading) {
    return (
      <div className="p-4 text-muted-foreground">Loading member details...</div>
    );
  }

  if (error) {
    return (
      <>
        <Alert variant="danger">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button
          variant="neutral"
          appearance="outline"
          onClick={() => router.push(`/dashboard/teams/${params.teamId}`)}
          leadingIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back to Team
        </Button>
      </>
    );
  }

  if (!member) {
    return (
      <>
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Member not found</AlertDescription>
        </Alert>
        <Button
          variant="neutral"
          appearance="outline"
          onClick={() => router.push(`/dashboard/teams/${params.teamId}`)}
          leadingIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back to Team
        </Button>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumbs items={breadcrumbItems} />
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Button
              variant="neutral"
              appearance="icon-only"
              size="sm"
              onClick={() => router.push(`/dashboard/teams/${params.teamId}`)}
              leadingIcon={<ArrowLeft className="size-4" />}
            />
            <div>
              <h1 className="text-heading-2 text-foreground flex items-center gap-2">
                {member.firstName && member.lastName
                  ? `${member.firstName} ${member.lastName}`
                  : member.user.email}
                {member.isAdmin && (
                  <Crown className="w-5 h-5 text-warning-400" />
                )}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="neutral"
              appearance="outline"
              onClick={() => setIsEditModalOpen(true)}
              leadingIcon={<PenSquare className="h-4 w-4" />}
            >
              Edit Member
            </Button>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <Card size="default" background={true} border={true}>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <p className="text-foreground">{member.user.email}</p>
            </div>
            <div className="space-y-1.5">
              <Label>Job Title</Label>
              <p className="text-foreground">{member.title || "Not set"}</p>
            </div>
            <div className="space-y-1.5">
              <Label>Team</Label>
              <p className="text-foreground">
                {member.team?.name || "Not found"}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <p className="text-foreground flex items-center gap-2">
                {member.isAdmin ? "Admin" : "Member"}
                {member.isAdmin && (
                  <Crown className="w-4 h-4 text-warning-400" />
                )}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <p className="text-foreground">
                {member.firstName && member.lastName
                  ? `${member.firstName} ${member.lastName}`
                  : "Not set"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ratings Section */}
      <RatingsSection
        teamId={params.teamId}
        memberId={params.memberId}
        onAddRating={() => setIsRatingModalOpen(true)}
      />

      {/* Yearly Goals */}
      <Card size="default" background={true} border={true}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Yearly Goals</CardTitle>
            <Button
              variant="primary"
              asChild
              leadingIcon={<Target className="h-4 w-4" />}
            >
              <Link
                href={`/dashboard/teams/${params.teamId}/members/${params.memberId}/goals/add`}
              >
                Add Goal
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!member.goals?.length ? (
            <p className="text-muted-foreground">No goals set yet.</p>
          ) : (
            <div className="space-y-4">
              {member.goals.map((goal) => (
                <Card
                  key={goal.id}
                  size="sm"
                  background={true}
                  border={true}
                  shadow="sm"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-heading-4">Year: {goal.year}</p>
                        <p className="text-muted-foreground">
                          {goal.description}
                        </p>
                      </div>
                      <Button
                        variant="neutral"
                        appearance="text"
                        size="sm"
                        asChild
                        leadingIcon={<PenSquare className="h-4 w-4" />}
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
        </CardContent>
      </Card>

      {/* Modals */}
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
