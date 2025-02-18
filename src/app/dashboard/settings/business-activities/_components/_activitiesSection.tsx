import { Target, Edit, Trash2, AlertCircle, Loader } from "lucide-react";
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

import { 
  useActivities, 
  useDeleteActivity,
  useActivitiesStore 
} from '@/store/business-activity-store';

interface ActivitiesSectionProps {
  shouldRefresh: boolean;
  onRefreshComplete: () => void;
  onUpdate: () => Promise<void>; // Add this line
}

export function ActivitiesSection({
  shouldRefresh,
  onRefreshComplete,
  onUpdate, // Add this line
}: ActivitiesSectionProps) {
  const { 
    data: activities,
    isLoading,
    error,
    refetch
  } = useActivities();

  const deleteActivity = useDeleteActivity();
  
  const { 
    selectedActivity,
    isEditModalOpen,
    isDeleteDialogOpen,
    setSelectedActivity,
    setEditModalOpen,
    setDeleteDialogOpen,
    resetState
  } = useActivitiesStore();

  const handleDelete = async () => {
    if (!selectedActivity) return;
    
    try {
      await deleteActivity.mutateAsync(selectedActivity.id);
      setDeleteDialogOpen(false);
      setSelectedActivity(null);
    } catch (err) {
      // Error will be handled by the mutation
      console.error('Failed to delete activity:', err);
    }
  };

  if (isLoading && !activities) {
    return <div className="ui-loader">Loading activities...</div>;
  }

  if (!activities || activities.length === 0) {
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
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center gap-sm">
            {error instanceof Error ? error.message : 'An error occurred'}
            <Button
              variant="secondary"
              onClick={() => refetch()}
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
          {activities?.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell className="text-foreground-weak w-0 whitespace-nowrap">
                Category
              </TableCell>
              <TableCell className="font-medium">{activity.name}</TableCell>
              <TableCell className="text-foreground-weak">
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
                      setEditModalOpen(true);
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
                      setDeleteDialogOpen(true);
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
        onClose={() => {
          setEditModalOpen(false);
          setSelectedActivity(null);
        }}
        activity={selectedActivity}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
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
                disabled={deleteActivity.isPending}
              >
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button 
                variant="destructive" 
                onClick={handleDelete} 
                disabled={deleteActivity.isPending}
              >
                {deleteActivity.isPending ? (
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