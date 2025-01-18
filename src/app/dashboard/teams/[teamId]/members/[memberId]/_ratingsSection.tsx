'use client';

import { useState, useEffect } from "react";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, RotateCcw, AlertCircle } from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import type { ScoreResponse } from "@/lib/types/api";

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
  const [ratings, setRatings] = useState<ScoreResponse[]>([]);
  const [stats, setStats] = useState<{ average: number; count: number }>({
    average: 0,
    count: 0,
  });
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
        `/api/teams/${teamId}/members/${memberId}/ratings?t=${new Date().getTime()}`
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
    <Card size="default" background={true} border={true}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Performance Ratings</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <StarRating 
                value={stats.average}
                disabled={true}
                size="sm"
                ratingsCount={stats.count}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="neutral"
              appearance="icon-only"
              size="sm"
              onClick={() => fetchRatings()}
              disabled={isRefreshing}
              isLoading={isRefreshing}
              leadingIcon={<RotateCcw className="size-4" />}
            />
            <Button
              variant="primary"
              onClick={onAddRating}
              leadingIcon={<Plus className="size-4" />}
            >
              Add Rating
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error ? (
          <div className="space-y-4">
            <Alert variant="danger">
              <AlertCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button
              variant="primary"
              onClick={() => fetchRatings()}
              leadingIcon={<RotateCcw className="size-4" />}
            >
              Retry
            </Button>
          </div>
        ) : ratings.length === 0 ? (
          <div className="text-center py-8 text-muted">
            No ratings yet. Click &ldquo;Add Rating&rdquo; to provide the first
            rating.
          </div>
        ) : (
          <div className="space-y-4">
            {ratings.map((rating) => (
              <Card 
                key={rating.id} 
                size="sm"
                background={true}
                border={true}
                shadow="sm"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      {rating.initiative && (
                        <h3 className="text-heading-4">
                          {rating.initiative.name}
                        </h3>
                      )}
                      <div className="flex items-center gap-2">
                        <StarRating
                          value={rating.value}
                          disabled={true}
                          size="sm"
                          showValue={true}
                          showRatingsCount={false}
                        />
                        <span className="text-p-small text-muted">
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {rating.feedback && (
                        <p className="text-p-small text-muted mt-2">
                          {rating.feedback}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}