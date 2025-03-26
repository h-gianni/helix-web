// src/app/dashboard/components/teams/team/member/MemberReviewsList.tsx
"use client";

import React from "react";
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
  ArrowRightIcon, 
  RotateCcw, 
  PencilIcon 
} from "lucide-react";
import { useReviews } from "@/store/review-store";
import { format } from "date-fns";

interface MemberReviewsListProps {
  teamId: string;
  memberId: string;
  onGenerateReview: () => void;
}

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
      <div className="text-center py-10 space-y-4">
        <FileText className="size-16 mx-auto text-muted-foreground" />
        <h3 className="text-lg font-medium">No Performance Reviews</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          There are no performance reviews for this team member yet.
          Generate a review to provide structured feedback on their performance.
        </p>
        <Button onClick={onGenerateReview} className="mt-4">
          <FileText className="size-4 mr-2" />
          Generate Review
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
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