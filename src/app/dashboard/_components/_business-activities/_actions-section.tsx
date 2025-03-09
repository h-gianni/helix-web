"use client";

import React, { useEffect } from "react";
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
    refetch,
  } = useActivities();

  const deleteActivity = useDeleteActivity();

  const {
    selectedActivity,
    isEditModalOpen,
    isDeleteDialogOpen,
    setSelectedActivity,
    setEditModalOpen,
    setDeleteDialogOpen,
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
      console.error("Failed to delete activity:", err);
    }
  };

  useEffect(() => {
    if (activities) {
      console.log("Activities data:", activities);
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
      <Card data-slot="card">
        <CardContent data-slot="card-content">
          <div className="space-y-base text-center">
            {/* Replaced h-12 w-12 with size-12 */}
            <Target className="mx-auto size-12 text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium">No business activities yet</h3>
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
        <Alert data-slot="alert" variant="destructive">
          {/* Replaced h-4 w-4 with size-4 */}
          <AlertCircle className="size-4" />
          <AlertDescription data-slot="alert-description" className="flex items-center gap-2">
            {error instanceof Error ? error.message : "An error occurred"}
            <Button
              data-slot="button"
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

      <Table data-slot="table">
        <TableHeader data-slot="table-header">
          <TableRow data-slot="table-row">
            <TableHead data-slot="table-head">Activity</TableHead>
            <TableHead data-slot="table-head">Category</TableHead>
            <TableHead data-slot="table-head" className="w-0 whitespace-nowrap">
              Category Impact
            </TableHead>
            <TableHead data-slot="table-head" className="w-0 whitespace-nowrap">
              Activity Impact
            </TableHead>
            <TableHead data-slot="table-head" className="w-0 whitespace-nowrap">
              Total Impact
            </TableHead>
            <TableHead data-slot="table-head" className="w-0">
              Used
            </TableHead>
            <TableHead data-slot="table-head" className="w-0 text-right">
              Actions
            </TableHead>
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

      <Pagination data-slot="pagination">
        <PaginationContent data-slot="pagination-content">
          <PaginationItem data-slot="pagination-item">
            <PaginationPrevious data-slot="pagination-previous" href="#" />
          </PaginationItem>
          <PaginationItem data-slot="pagination-item">
            <PaginationLink data-slot="pagination-link" href="#">
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem data-slot="pagination-item">
            <PaginationEllipsis data-slot="pagination-ellipsis" />
          </PaginationItem>
          <PaginationItem data-slot="pagination-item">
            <PaginationNext data-slot="pagination-next" href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        data-slot="alert-dialog"
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent data-slot="alert-dialog-content">
          <AlertDialogHeader data-slot="alert-dialog-header">
            <AlertDialogTitle data-slot="alert-dialog-title">
              Delete Business Activity
            </AlertDialogTitle>
            <AlertDialogDescription data-slot="alert-dialog-description">
              Are you sure you want to delete this business activity? This action
              cannot be undone. All associated ratings and feedback will be
              permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter data-slot="alert-dialog-footer">
            <AlertDialogCancel asChild>
              <Button data-slot="button" variant="ghost" disabled={isLoading}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                data-slot="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loader">
                    <Loader size="base" label="Deleting..." className="text-destructive" />
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
