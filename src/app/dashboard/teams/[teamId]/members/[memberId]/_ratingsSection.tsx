// app/dashboard/teams/[teamId]/members/[memberId]/_ratingsSection.tsx
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, RotateCcw } from "lucide-react";
import StarRating from '@/app/dashboard/_component/_starRating';
import type { ScoreResponse } from "@/lib/types/api";

interface RatingsSectionProps {
  teamId: string;
  memberId: string;
  onAddRating: () => void;
}

export default function RatingsSection({ teamId, memberId, onAddRating }: RatingsSectionProps) {
  const [ratings, setRatings] = useState<ScoreResponse[]>([]);
  const [stats, setStats] = useState<{ average: number; count: number }>({ average: 0, count: 0 });
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
        throw new Error(data.error || 'Failed to fetch ratings');
      }

      setRatings(data.data.ratings);
      setStats(data.data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRatings(false);
  }, [teamId, memberId]);

  if (loading) {
    return <div>Loading ratings...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Performance Ratings</h2>
          <p className="text-sm text-gray-500">
            {stats.count} ratings · Average: {stats.average.toFixed(1)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchRatings()}
            disabled={isRefreshing}
          >
            <RotateCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={onAddRating}>
            <Plus className="w-4 h-4 mr-2" />
            Add Rating
          </Button>
        </div>
      </div>

      {error ? (
        <div className="text-red-500 mb-4">
          {error}
          <Button variant="link" onClick={() => fetchRatings()}>
            Retry
          </Button>
        </div>
      ) : ratings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No ratings yet. Click "Add Rating" to provide the first rating.
        </div>
      ) : (
        <div className="space-y-4">
          {ratings.map((rating) => (
            <Card key={rating.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  {rating.initiative && (
                    <h3 className="font-medium">{rating.initiative.name}</h3>
                  )}
                  <div className="flex items-center gap-2">
                    <StarRating value={rating.value} onChange={() => {}} size="sm" />
                    <span className="text-sm text-gray-500">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {rating.feedback && (
                    <p className="text-sm text-gray-600 mt-2">{rating.feedback}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
}