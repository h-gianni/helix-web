'use client';

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
import { Loader } from "@/components/ui/core/Loader";
import { Target, Edit, Trash2, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/core/Alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/core/Pagination";
import { Card, CardContent } from "@/components/ui/core/Card";
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

  useEffect(() => {
    if (activities) {
      console.log('Activities data:', activities);
    }
  }, [activities]);

  if (isLoading) {
    return (
      <div className="loader">
        <Loader size="base" label="Loading..." />
      </div>
    );
  }

  if(!activities || !Array.isArray(activities) || activities.length === 0) {
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
    <div className="space-y-2">
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

      <div className="view-controls-bar">To be added: sorting and filters</div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Activity</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="w-0 whitespace-nowrap">
              Category Impact
            </TableHead>
            <TableHead className="w-0 whitespace-nowrap">
              Activity Impact
            </TableHead>
            <TableHead className="w-0 whitespace-nowrap">
              Total Impact
            </TableHead>
            <TableHead className="w-0">Used</TableHead>
            <TableHead className="w-0 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => {
            // Make sure each field we're using is a primitive string or number
            const activityName = typeof activity.name === 'string' ? activity.name : JSON.stringify(activity.name);
            const activityDescription = typeof activity.description === 'string' ? activity.description : 'No description';
            const activityCategory = typeof activity.category === 'string' ? activity.category : 'No category';
            const activityId = activity.id;
            const ratingsCount = activity._count?.ratings || 0;
            
            return (
              <TableRow key={activityId}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{activityName}</span>
                    <span className="body-sm text-foreground-muted">
                      {activityDescription}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-foreground-muted w-0 whitespace-nowrap">
                  {activityCategory}
                </TableCell>
                <TableCell className="text-center text-sm">
                  10<span className="text-foreground-muted">/10</span>
                </TableCell>
                <TableCell className="text-center text-sm">
                  8<span className="text-foreground-muted">/10</span>
                </TableCell>
                <TableCell className="text-center font-semibold">
                  18
                  <span className="text-foreground-muted text-sm font-normal">
                    /20
                  </span>
                </TableCell>
                <TableCell className="text-center text-sm">
                  {ratingsCount}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setSelectedActivity(activity);
                        setEditModalOpen(true);
                      }}
                      disabled={isLoading}
                    >
                      <Edit />
                    </Button>

                    <Button
                      variant="destructive-ghost"
                      size="icon-sm"
                      onClick={() => {
                        setSelectedActivity(activity);
                        setDeleteDialogOpen(true);
                      }}
                      disabled={isLoading}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

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
              <Button variant="ghost" disabled={isLoading}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loader">
                    <Loader
                      size="base"
                      label="Deleting..."
                      className="text-destructive"
                    />
                  </div>
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