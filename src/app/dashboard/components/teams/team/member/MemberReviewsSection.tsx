// src/app/dashboard/components/teams/team/member/MemberReviewsList.tsx
"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/core/Table";
import { Button } from "@/components/ui/core/Button";
import { Loader } from "@/components/ui/core/Loader";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { Badge } from "@/components/ui/core/Badge";
import { 
  FileText, 
  AlertCircle, 
  EyeIcon, 
  RotateCcw, 
  PencilIcon,
  CalendarClock,
  CheckSquare,
  Clock
} from "lucide-react";
import { useReviews } from "@/store/review-store";
import { format } from "date-fns";
import { NoContentFound } from "@/components/ui/composite/NoContentFound";
import { StatsCard } from "@/components/ui/composite/StatsCard";

interface MemberReviewsListProps {
  teamId: string;
  memberId: string;
  onGenerateReview: () => void;
}

// Type for the trend to match StatsCard requirements
type TrendType = "up" | "down" | "neutral" | undefined;

const statusVariants = {
  DRAFT: "secondary",
  PUBLISHED: "success",
  ACKNOWLEDGED: "success",
};

function MemberReviewsList({
  teamId,
  memberId,
  onGenerateReview,
}: MemberReviewsListProps) {
  const router = useRouter();
  const { data: reviews, isLoading, error, refetch } = useReviews(memberId);

  // Calculate review statistics
  const reviewStats = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return {
        totalReviews: 0,
        last12MonthsReviews: 0,
        acknowledgedReviews: 0,
        draftReviews: 0,
        reviewCompletionRate: 0,
        trend: "neutral" as TrendType,
      };
    }

    const now = new Date();
    const last12Months = new Date(now);
    last12Months.setFullYear(now.getFullYear() - 1);
    
    // Process reviews with dates
    const reviewsWithDates = reviews.map(review => ({
      ...review,
      createdDate: new Date(review.createdAt)
    }));
    
    // Filter reviews for different metrics
    const reviewsLast12Months = reviewsWithDates.filter(r => r.createdDate >= last12Months);
    const acknowledgedReviews = reviewsWithDates.filter(r => r.status === "ACKNOWLEDGED");
    const draftReviews = reviewsWithDates.filter(r => r.status === "DRAFT");
    const publishedReviews = reviewsWithDates.filter(r => r.status === "PUBLISHED" || r.status === "ACKNOWLEDGED");
    
    // Calculate review completion rate (published or acknowledged out of total)
    const reviewCompletionRate = Math.round((publishedReviews.length / reviewsWithDates.length) * 100);
    
    // Calculate trend based on review frequency
    // Compare first half vs second half of the last 12 months
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    
    const recentSixMonths = reviewsLast12Months.filter(r => r.createdDate >= sixMonthsAgo).length;
    const previousSixMonths = reviewsLast12Months.filter(r => r.createdDate < sixMonthsAgo).length;
    
    let trend: TrendType;
    if (recentSixMonths > previousSixMonths) {
      trend = "up";
    } else if (recentSixMonths < previousSixMonths) {
      trend = "down";
    } else {
      trend = "neutral";
    }
    
    return {
      totalReviews: reviewsWithDates.length,
      last12MonthsReviews: reviewsLast12Months.length,
      acknowledgedReviews: acknowledgedReviews.length,
      draftReviews: draftReviews.length,
      reviewCompletionRate,
      trend,
    };
  }, [reviews]);

  const handleViewReview = (reviewId: string) => {
    router.push(`/dashboard/teams/${teamId}/members/${memberId}/reviews/${reviewId}`);
  };

  if (isLoading) {
    return (
      <div className="py-8 flex justify-center">
        <Loader size="base" label="Loading reviews..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load reviews"}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button variant="secondary" onClick={() => refetch()}>
            <RotateCcw className="size-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <NoContentFound
        icon={FileText}
        title="No Performance Reviews"
        description="There are no performance reviews for this team member. Generate a review to provide structured feedback on their performance."
        actionLabel="Generate New Review"
        onAction={onGenerateReview}
        variant="section"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Card for Review Metrics */}
      <StatsCard
        items={[
          {
            title: "Total Reviews",
            value: reviewStats.totalReviews.toString(),
            trendLabel: "All time",
            icon: FileText,
          },
          {
            title: "Last 12 Months",
            value: reviewStats.last12MonthsReviews.toString(),
            trend: reviewStats.trend,
            trendValue: reviewStats.trend === "up" ? "Increasing" : 
                       reviewStats.trend === "down" ? "Decreasing" : "Stable",
            icon: CalendarClock,
          },
          {
            title: "Completion Rate",
            value: `${reviewStats.reviewCompletionRate}%`,
            trendLabel: `${reviewStats.acknowledgedReviews} acknowledged`,
            icon: CheckSquare,
          },
          {
            title: "Pending Reviews",
            value: reviewStats.draftReviews.toString(),
            trendLabel: "In draft status",
            icon: Clock,
          },
        ]}
        columns={4}
      />

      <div className="flex justify-between items-center mb-4">
        <h3 className="heading-4">Review History</h3>
        <Button onClick={onGenerateReview}>
          <FileText className="size-4 mr-2" />
          Generate New Review
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Period</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Version</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review.id}>
              <TableCell className="font-medium">
                Q{review.quarter} {review.year}
              </TableCell>
              <TableCell>
                {format(new Date(review.createdAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <Badge
                  variant={statusVariants[review.status] as any}
                >
                  {review.status === "DRAFT" ? "Draft" : 
                   review.status === "PUBLISHED" ? "Published" : 
                   "Acknowledged"}
                </Badge>
              </TableCell>
              <TableCell>v{review.version}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {review.status === "DRAFT" ? (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleViewReview(review.id)}
                    >
                      <PencilIcon className="size-4 mr-1" />
                      Edit
                    </Button>
                  ) : (
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleViewReview(review.id)}
                    >
                      <EyeIcon className="size-4 mr-1" />
                      View
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default MemberReviewsList;