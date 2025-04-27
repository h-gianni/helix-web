// app/dashboard/teams/[teamId]/members/[memberId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { PageBreadcrumbs } from "@/components/ui/composite/AppHeader";
import { MemberProfileHeader } from "@/components/ui/composite/MemberProfileHeader";
import { Button } from "@/components/ui/core/Button";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { Loader } from "@/components/ui/core/Loader";
import {
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { EditMemberModal } from "@/app/dashboard/components/teams/team/member/MemberEditModal";
import PerformanceRatingModal from "@/app/dashboard/components/scoring/ScoringModal";
import ScoresSection from "@/app/dashboard/components/teams/team/member/MemberScoresSection";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/core/Tabs";
import MemberDashboard from "@/app/dashboard/components/teams/team/member/MemberDashboardSection";
import { useMemberDetails, useMemberStore } from "@/store/member-store";
import MemberReviewsList from "@/app/dashboard/components/teams/team/member/MemberReviewsSection";
import MemberNotesSection from "@/app/dashboard/components/teams/team/member/MemberNotesSection";
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);

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
      label: getDisplayName(member),
    },
  ];

  // Helper function to consistently format member name
  function getDisplayName(member: any) {
    if (!member) return "Member Details";
    
    // If both first and last names exist, use them
    if (member.firstName && member.lastName) {
      return `${member.firstName} ${member.lastName}`;
    }
    
    // If we have either first or last name, use that
    if (member.firstName || member.lastName) {
      return member.firstName || member.lastName;
    }
    
    // If we have user data with a name, use that
    if (member.user?.name) {
      return member.user.name;
    }
    
    // Last resort: use email or a placeholder
    return member.user?.email?.split('@')[0] || "Team Member";
  }

  const handleGenerateReview = () => {
    setIsReviewModalOpen(true);
  };

  const handleAddNote = () => {
    // Implement note functionality or placeholder
    console.log("Add note clicked");
  };

  const handleScorePerformance = () => {
    setRatingModalOpen(true);
  };

  const handleEditMember = () => {
    setEditModalOpen(true);
  };

  const handleTransferMember = () => {
    setIsTransferDialogOpen(true);
  };

  const handleDeleteMember = () => {
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader label="Loading member details..." />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="flex flex-col items-center gap-4 p-6">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Member not found"}
          </AlertDescription>
        </Alert>
        <Button
          variant="ghost"
          onClick={() => router.push(`/dashboard/teams/${params.teamId}`)}
          className="gap-2"
        >
          <ArrowLeft className="size-4" /> Back to Team
        </Button>
      </div>
    );
  }

  // Get member name for display
  const memberName = getDisplayName(member);

  return (
    <>
      <PageBreadcrumbs items={breadcrumbItems} />
      
      <MemberProfileHeader
        memberId={params.memberId}
        teamId={params.teamId}
        name={memberName}
        title={member.title}
        email={member.user.email}
        onAddNote={handleAddNote}
        onScorePerformance={handleScorePerformance}
        onEditMember={handleEditMember}
        onTransferMember={handleTransferMember}
        onDeleteMember={handleDeleteMember}
      />

      <main className="layout-page-main">
        <Tabs
          value={selectedTab}
          onValueChange={(value) => setSelectedTab(value as any)}
          className="w-full"
        >
          <TabsList className="w-full my-4">
            <TabsTrigger value="dashboard" className="flex-1">Dashboard</TabsTrigger>
            <TabsTrigger value="scores" className="flex-1">Scores</TabsTrigger>
            <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1">Performance Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <MemberDashboard
              teamId={params.teamId}
              memberId={params.memberId}
            />
          </TabsContent>

          <TabsContent value="scores">
            <ScoresSection
              teamId={params.teamId}
              memberId={params.memberId}
              onAddRating={() => setRatingModalOpen(true)}
            />
          </TabsContent>

          <TabsContent value="notes">
            <MemberNotesSection
              teamId={params.teamId}
              memberId={params.memberId}
              onAddNote={handleAddNote}
            />
          </TabsContent>

          <TabsContent value="reviews">
            <MemberReviewsList
              teamId={params.teamId}
              memberId={params.memberId}
              onGenerateReview={handleGenerateReview}
            />
          </TabsContent>
        </Tabs>
      </main>

      <EditMemberModal memberId={params.memberId} teamId={params.teamId} />

      <PerformanceRatingModal
        teamId={params.teamId}
        memberId={params.memberId}
        memberName={memberName}
        memberTitle={member.title}
      />

      {/* We would add the Transfer and Delete confirmation dialogs here */}
    </>
  );
}