'use client';

import { useState, useEffect } from "react";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/core/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/core/Table";
import { Button } from "@/components/ui/core/Button";
import { Plus, RotateCcw, AlertCircle } from "lucide-react";
import StarRating from "@/components/ui/core/StarRating";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import type { RatingResponse } from "@/lib/types/api";

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
  const [ratings, setRatings] = useState<RatingResponse[]>([]);
  const [stats, setStats] = useState({ average: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRatings = async (showRefreshIndicator = true) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      }
      setError(null);

      const response = await fetch(
        `/api/teams/${teamId}/members/${memberId}/ratings?t=${Date.now()}`
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch ratings");
      }

      setRatings(data.data.ratings);
      setStats(data.data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRatings(false);
  }, [teamId, memberId]);

  if (loading) {
    return <div className="text-muted-foreground">Loading ratings...</div>;
  }

  return (
    <>
    {error ? (
          <div className="space-y-base">
            <Alert variant="danger">
              <AlertCircle />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button
              variant="primary"
              onClick={() => fetchRatings()}
              leadingIcon={<RotateCcw />}
            >
              Retry
            </Button>
          </div>
        ) : ratings.length === 0 ? (
          <div className="py-8 text-center text-muted">
            No ratings yet. Click &ldquo;Add Rating&ldquo; to provide the first rating.
          </div>
        ) : (
          <Table size="sm" zebra>
            <TableHeader>
              <TableRow>
                <TableHead>Activity</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ratings.map((rating) => (
                <TableRow key={rating.id}>
                  <TableCell className="font-medium text-strong">
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
                  <TableCell className="text-weak">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
    </>
  );
}