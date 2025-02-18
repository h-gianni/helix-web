'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/core/Table";
import { Button } from "@/components/ui/core/Button";
import { RotateCcw, AlertCircle } from "lucide-react";
import StarRating from "@/components/ui/core/Star-rating";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { useMemberRatings } from "@/store/member-store";

interface RatingsSectionProps {
  teamId: string;
  memberId: string;
  onAddRating: () => void;
}

export default function RatingsSection({
  teamId,
  memberId,
  onAddRating,
}: RatingsSectionProps) {
  const { 
    data,
    isLoading,
    error,
    refetch
  } = useMemberRatings({ teamId, memberId });

  if (isLoading) {
    return <div className="text-foreground">Loading ratings...</div>;
  }

  if (error) {
    return (
      <div className="space-y-base">
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load ratings"}
          </AlertDescription>
        </Alert>
        <Button
          variant="default"
          onClick={() => refetch()}
        >
          <RotateCcw /> Retry
        </Button>
      </div>
    );
  }

  if (!data?.ratings.length) {
    return (
      <div className="missing-content">
        No ratings yet.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Activity</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.ratings.map((rating) => (
          <TableRow key={rating.id}>
            <TableCell className="font-medium text-foreground-strong">
              {rating.activity?.name || 'N/A'}
            </TableCell>
            <TableCell>
              <StarRating
                value={rating.value}
                disabled={true}
                size="sm"
                showValue={true}
                showRatingsCount={false}
              />
            </TableCell>
            <TableCell className="text-foreground max-w-md">
              {rating.activity?.description || 'No description'}
            </TableCell>
            <TableCell className="text-foreground-weak">
              {new Date(rating.createdAt).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}