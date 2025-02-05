import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/Table";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import {
  Target,
  PlusCircle,
  Edit,
  Trash2,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/AlertDialog";
// import type { ApiResponse, BusinessActivityResponse as InitiativeResponse } from "@/lib/types/api";
import { ActivityModal } from "./_activityModal";
import type { ApiResponse, BusinessActivityResponse } from "@/lib/types/api";

interface ActivitiesSectionProps {
  onUpdate: () => void;
}

export function ActivitiesSection({ onUpdate }: ActivitiesSectionProps) {
  const [activities, setActivities] = useState<BusinessActivityResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] =
    useState<BusinessActivityResponse | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async (showRefreshIndicator = true) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      }

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
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchActivities(false);
  }, []);

  const handleDelete = async () => {
    if (!selectedActivity) return;

    try {
      const response = await fetch(
        `/api/business-activities/${selectedActivity.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (data.success) {
        await fetchActivities();
        onUpdate();
      }
    } catch (error) {
      console.error("Error deleting business activity:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedActivity(null);
    }
  };

  return (
    <div className="space-y-base">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-sm">
          <h2 className="ui-text-heading-1">Business Activities</h2>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedActivity(null);
            setIsModalOpen(true);
          }}
          leadingIcon={<PlusCircle />}
        >
          Add Activity
        </Button>
      </div>

      {error && (
        <Alert variant="danger">
          <AlertCircle />
          <AlertDescription className="flex items-center gap-sm">
            {error}
            <Button
              variant="neutral"
              volume="moderate"
              size="sm"
              onClick={() => fetchActivities()}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {activities.length === 0 ? (
        <Card>
          <CardContent>
            <div className="space-y-base text-center">
              <Target className="mx-auto h-12 w-12 ui-text-body-muted" />
              <div className="space-y-2">
                <CardTitle>No business activities yet</CardTitle>
                <CardDescription>
                  Create business activities to track team performance.
                </CardDescription>
              </div>
              <Button
                variant="primary"
                onClick={() => setIsModalOpen(true)}
                leadingIcon={<PlusCircle />}
              >
                Create Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
          <Table size="sm">
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Ratings</TableHead>
                <TableHead className="w-0">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.name}</TableCell>
                  <TableCell className="text-muted">
                    {activity.description || "No description"}
                  </TableCell>
                  <TableCell>{activity._count?.ratings || 0}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-sm">
                      <Button
                        variant="neutral"
                        volume="soft"
                        size="sm"
                        onClick={() => {
                          setSelectedActivity(activity);
                          setIsModalOpen(true);
                        }}
                        leadingIcon={<Edit />}
                      />
                      <Button
                        variant="danger"
                        volume="soft"
                        size="sm"
                        onClick={() => {
                          setSelectedActivity(activity);
                          setIsDeleteDialogOpen(true);
                        }}
                        leadingIcon={<Trash2 />}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      )}

      {/* Activity Modal */}
      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedActivity(null);
        }}
        activity={selectedActivity}
        onUpdate={async () => {
          await fetchActivities();
          onUpdate();
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
              <Button variant="neutral" volume="moderate">
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="danger" onClick={handleDelete}>
                Delete Activity
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
