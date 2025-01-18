// app/dashboard/teams/[teamId]/_teamPerformanceSummary.tsx
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TeamPerformanceView } from "@/app/dashboard/_component/_teamPerformanceView";
import { ViewSwitcher } from "@/app/dashboard/_component/_performersByCategory";
import { MemberPerformance, PerformanceCategory } from '@/app/dashboard/types/member';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import {
  TrendingUp,
  Star,
} from "lucide-react";

interface TeamPerformanceSummaryProps {
  teamId: string;
  teamName: string;
  members: MemberPerformance[];
  viewType: 'table' | 'grid'; 
  onViewChange: (value: 'table' | 'grid') => void; 
}

const performanceCategories: PerformanceCategory[] = [
  {
    label: "Top",
    minRating: 4.6,
    maxRating: 5,
    className: "text-success-600",
    Icon: TrendingUp,
  },
  {
    label: "Strong",
    minRating: 4,
    maxRating: 4.5,
    className: "text-success-500",
    Icon: TrendingUp,
  },
  {
    label: "Solid",
    minRating: 3,
    maxRating: 3.9,
    className: "text-info-600",
    Icon: TrendingUp,
  },
  {
    label: "Lower",
    minRating: 2.1,
    maxRating: 2.9,
    className: "text-warning-600",
    Icon: TrendingUp,
  },
  {
    label: "Poor",
    minRating: 1,
    maxRating: 2,
    className: "text-danger-600",
    Icon: TrendingUp,
  },
];

const getPerformanceCategory = (
  rating: number,
  ratingsCount: number
): PerformanceCategory => {
  if (ratingsCount === 0) {
    return {
      label: "No Ratings",
      minRating: 0,
      maxRating: 0,
      className: "text-muted-foreground",
      Icon: TrendingUp,
    };
  }

  return (
    performanceCategories.find(
      (category) => rating >= category.minRating && rating <= category.maxRating
    ) || {
      label: "Unknown",
      minRating: 0,
      maxRating: 0,
      className: "text-muted-foreground",
      Icon: TrendingUp,
    }
  );
};

const StarRatingDisplay = ({
  rating,
  ratingsCount,
}: {
  rating: number;
  ratingsCount: number;
}) => {
  if (ratingsCount === 0) {
    return (
      <span className="text-p-small text-muted-foreground">No ratings yet</span>
    );
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`size-4 ${
            index < fullStars
              ? "fill-warning-400 text-warning-400"
              : index === fullStars && hasHalfStar
              ? "fill-warning-400/50 text-warning-400"
              : "fill-transparent text-muted-foreground/30"
          }`}
        />
      ))}
      <span className="ml-2 text-p-small font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

export function TeamPerformanceSummary({
  teamId,
  members,
  viewType,
  onViewChange,
}: TeamPerformanceSummaryProps) {
  const router = useRouter();
  const [memberToDelete, setMemberToDelete] = useState<MemberPerformance | null>(null);

  if (!members || members.length === 0) {
    return null;
  }

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;

    try {
      const response = await fetch(
        `/api/teams/${teamId}/members/${memberToDelete.id}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();
      if (data.success) {
        window.location.reload();
      } else {
        throw new Error(data.error || 'Failed to delete member');
      }
    } catch (error) {
      console.error('Error deleting member:', error);
    } finally {
      setMemberToDelete(null);
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <ViewSwitcher viewType={viewType} onViewChange={onViewChange} />
      </div>
      <TeamPerformanceView
        teamId={teamId}
        members={members}
        showAvatar={true}
        showActions={true}
        mode="full"
        viewType={viewType} // Pass viewType to control the layout
        onViewChange={onViewChange} // Pass onViewChange to propagate changes
        onMemberDelete={(member) => setMemberToDelete(member)}
      />

      <AlertDialog
        open={!!memberToDelete}
        onOpenChange={(open) => !open && setMemberToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {memberToDelete?.name} from the team? This action cannot be undone. All associated ratings and performance data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMemberToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMember} variant="danger">
              Delete Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

