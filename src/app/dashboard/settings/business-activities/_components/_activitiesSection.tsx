import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/core/Button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/core/Table";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { Target, Edit, Trash2, AlertCircle, Heart, Loader } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/core/AlertDialog";
import { Card, CardContent } from "@/components/ui/core/Card";
import { ActivityModal } from "./_activityModal";
import type { ApiResponse, BusinessActivityResponse } from "@/lib/types/api";

interface ActivitiesSectionProps {
  onUpdate: () => Promise<void>;
  shouldRefresh: boolean;
  onRefreshComplete: () => void;
}

export function ActivitiesSection({
  onUpdate,
  shouldRefresh,
  onRefreshComplete,
}: ActivitiesSectionProps) {
  const [activities, setActivities] = useState<BusinessActivityResponse[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] =
    useState<BusinessActivityResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/business-activities?t=${Date.now()}`);
      const data: ApiResponse<BusinessActivityResponse[]> =
        await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch business activities");
      }

      setActivities(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    if (shouldRefresh) {
      fetchActivities().then(() => {
        onRefreshComplete();
      });
    }
  }, [shouldRefresh, fetchActivities, onRefreshComplete]);

  const handleDelete = useCallback(async () => {
    if (!selectedActivity) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/business-activities/${selectedActivity.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to delete activity");
      }

      await fetchActivities();
      await onUpdate();
      setIsDeleteDialogOpen(false);
      setSelectedActivity(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete activity"
      );
    } finally {
      setIsLoading(false);
    }
  }, [selectedActivity, fetchActivities, onUpdate]);

  const handleModalClose = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedActivity(null);
  }, []);

  if (isLoading && !activities.length) {
    return <div className="ui-loader">Loading activities...</div>;
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="space-y-base text-center">
            <Target className="mx-auto h-12 w-12 ui-text-body-muted" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                No business activities yet
              </h3>
              <p className="ui-text-body-small">
                Create business activities to track team performance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-base">
      {error && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription className="flex items-center gap-sm">
            {error}
            <Button
              variant="secondary"
              onClick={() => fetchActivities()}
              disabled={isLoading}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-0 whitespace-nowrap">Impact</TableHead>
            <TableHead className="w-0">Ratings</TableHead>
            <TableHead className="w-0">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell className="text-weak w-0 whitespace-nowrap">
                Category
              </TableCell>
              <TableCell className="font-medium">{activity.name}</TableCell>
              <TableCell className="text-weak">
                {activity.description || "No description"}
              </TableCell>
              <TableCell className="text-center">18</TableCell>
              <TableCell className="text-center">
                {activity._count?.ratings || 0}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-sm">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      setSelectedActivity(activity);
                      setIsEditModalOpen(true);
                    }}
                    disabled={isLoading}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      setSelectedActivity(activity);
                      setIsDeleteDialogOpen(true);
                    }}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Modal */}
      <ActivityModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        activity={selectedActivity}
        onUpdate={async () => {
          await fetchActivities();
          await onUpdate();
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Business Activity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this business activity? This
              action cannot be undone. All associated ratings and feedback will
              be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button
                variant="secondary"
                disabled={isLoading}
              >
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
  {isLoading ? (
    <span className="flex items-center gap-2">
      <Loader className="h-4 w-4 animate-spin" />
      Deleting...
    </span>
  ) : (
    "Delete Activity"
  )}
</Button>

            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
