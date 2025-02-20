'use client'

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
import { Badge } from "@/components/ui/core/Badge";
import { useActivities, useDeleteActivity, useActivitiesStore } from '@/store/business-activity-store';
import { useEffect } from "react";
import type { BusinessActivityResponse } from "@/lib/types/api";

interface ActivitiesSectionProps {
  shouldRefresh: boolean;
  onRefreshComplete: () => void;
  onUpdate: () => Promise<void>;
}

export function ActivitiesSection({
  shouldRefresh,
  onRefreshComplete,
  onUpdate,
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
    setDeleteDialogOpen
  } = useActivitiesStore();

  useEffect(() => {
    if (shouldRefresh) {
      refetch().then(() => {
        onRefreshComplete();
      });
    }
  }, [shouldRefresh, refetch, onRefreshComplete]);

  const handleDelete = async () => {
    if (!selectedActivity) return;
    
    try {
      await deleteActivity.mutateAsync(selectedActivity.id);
      await onUpdate();
      setDeleteDialogOpen(false);
      setSelectedActivity(null);
    } catch (err) {
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
            <Target className="mx-auto h-12 w-12 text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                No business activities yet
              </h3>
              <p className="text-sm text-muted-foreground">
                Create business activities to track team performance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center gap-2">
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
            <TableHead className="w-24 text-center">Priority</TableHead>
            <TableHead className="w-24 text-center">Status</TableHead>
            <TableHead className="w-24 text-center">Ratings</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities?.map((activity: BusinessActivityResponse) => (
            <TableRow key={activity.id}>
              <TableCell>
                {activity.category ? (
                  <Badge variant="outline" className="font-normal">
                    {activity.category}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">Uncategorized</span>
                )}
              </TableCell>
              <TableCell className="font-medium">{activity.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {activity.description || "No description"}
              </TableCell>
              <TableCell className="text-center">
                <Badge 
                  variant={
                    activity.priority === 'HIGH' ? 'destructive' : 
                    activity.priority === 'MEDIUM' ? 'default' : 
                    'secondary'
                  }
                >
                  {activity.priority.toLowerCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={
                    activity.status === 'ACTIVE' ? 'default' :
                    activity.status === 'COMPLETED' ? 'success' :
                    'secondary'
                  }
                >
                  {activity.status.toLowerCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                {activity._count?.ratings || 0}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
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
        onSuccess={onUpdate}
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