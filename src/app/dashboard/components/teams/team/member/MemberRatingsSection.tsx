"use client";

import React from "react";
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
import StarRating from "@/components/ui/core/StarRating";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { Loader } from "@/components/ui/core/Loader";
import { useMemberRatings } from "@/store/member-store";

interface RatingsSectionProps {
  teamId: string;
  memberId: string;
  onAddRating: () => void;
}

function RatingsSection({ teamId, memberId, onAddRating }: RatingsSectionProps) {
  const { data, isLoading, error, refetch } = useMemberRatings({
    teamId,
    memberId,
  });

  if (isLoading) {
    return (
      <div className="loader">
        <Loader size="base" label="Loading..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-base">
        <Alert data-slot="alert" variant="destructive">
          {/* Add size-4 for the icon */}
          <AlertCircle className="size-4" />
          <AlertDescription data-slot="alert-description">
            {error instanceof Error ? error.message : "Failed to load ratings"}
          </AlertDescription>
        </Alert>
        <Button data-slot="button" variant="default" onClick={() => refetch()}>
          <RotateCcw className="size-4" /> Retry
        </Button>
      </div>
    );
  }

  if (!data?.ratings.length) {
    return <div className="missing-content">No ratings yet.</div>;
  }

  return (
    <Table data-slot="table">
      <TableHeader data-slot="table-header">
        <TableRow data-slot="table-row">
          <TableHead data-slot="table-head">Activity</TableHead>
          <TableHead data-slot="table-head">Rating</TableHead>
          <TableHead data-slot="table-head">Description</TableHead>
          <TableHead data-slot="table-head">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody data-slot="table-body">
        {data.ratings.map((rating) => (
          <TableRow data-slot="table-row" key={rating.id}>
            <TableCell data-slot="table-cell" className="font-medium">
              {rating.activity?.name || "N/A"}
            </TableCell>
            <TableCell data-slot="table-cell">
              <StarRating
                value={rating.value}
                disabled
                size="sm"
                showValue
                showRatingsCount={false}
              />
            </TableCell>
            <TableCell data-slot="table-cell" className="text-foreground max-w-md">
              {rating.activity?.description || "No description"}
            </TableCell>
            <TableCell data-slot="table-cell">
              {new Date(rating.createdAt).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default RatingsSection;
