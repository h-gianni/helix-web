// app/dashboard/teams/[teamId]/members/[memberId]/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PenSquare, ArrowLeft, Crown, Target } from "lucide-react";
import Link from "next/link";
import type { ApiResponse } from "@/lib/types/api";
import { EditMemberModal } from "./_editMemberModal";
import PerformanceRatingModal from '@/app/dashboard/_component/_performanceRatingModal';
import RatingsSection from "./_ratingsSection";

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
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save rating');
      }
  
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to save rating');
      }
  
      setIsRatingModalOpen(false);
      fetchMemberDetails();
    } catch (err) {
      console.error('Error saving rating:', err);
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

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchMemberDetails]);

  if (loading) {
    return <div className="p-4">Loading member details...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => router.push(`/dashboard/teams/${params.teamId}`)}>
          Back to Team
        </Button>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="p-4">
        <div className="mb-4">Member not found</div>
        <Button onClick={() => router.push(`/dashboard/teams/${params.teamId}`)}>
          Back to Team
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/teams/${params.teamId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Team
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {member.firstName && member.lastName
              ? `${member.firstName} ${member.lastName}`
              : member.user.email}
            {member.isAdmin && <Crown className="w-5 h-5 text-yellow-500" />}
          </h1>
        </div>
        <Button onClick={() => setIsEditModalOpen(true)}>
          <PenSquare className="w-4 h-4 mr-2" />
          Edit Member
        </Button>
      </div>

      {/* Basic Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="text-lg">{member.user.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Job Title</label>
            <p className="text-lg">{member.title || "Not set"}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Team</label>
            <p className="text-lg">{member.team?.name || "Not found"}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Role</label>
            <p className="text-lg flex items-center gap-2">
              {member.isAdmin ? "Admin" : "Member"}
              {member.isAdmin && <Crown className="w-4 h-4 text-yellow-500" />}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Full Name</label>
            <p className="text-lg">
              {member.firstName && member.lastName
                ? `${member.firstName} ${member.lastName}`
                : "Not set"}
            </p>
          </div>
        </div>
      </Card>

      {/* Ratings Section */}
      <RatingsSection
        teamId={params.teamId}
        memberId={params.memberId}
        onAddRating={() => setIsRatingModalOpen(true)}
      />

      {/* Yearly Goals */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Yearly Goals</h2>
          <Link
            href={`/dashboard/teams/${params.teamId}/members/${params.memberId}/goals/add`}
          >
            <Button>
              <Target className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </Link>
        </div>
        {!member.goals?.length ? (
          <p className="text-gray-500">No goals set yet.</p>
        ) : (
          <div className="space-y-4">
            {member.goals.map((goal) => (
              <Card key={goal.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Year: {goal.year}</p>
                    <p className="text-gray-600">{goal.description}</p>
                  </div>
                  <Link
                    href={`/dashboard/teams/${params.teamId}/members/${params.memberId}/goals/${goal.id}/edit`}
                  >
                    <Button variant="ghost" size="sm">
                      <PenSquare className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
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
  memberName={member.firstName && member.lastName 
    ? `${member.firstName} ${member.lastName}`
    : member.user.email}
  memberTitle={member.title}
  onSubmit={handleRatingSubmit}
/>
    </div>
  );
}