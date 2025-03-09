import React, { useEffect } from "react";
import { Button } from "@/components/ui/core/Button";
import { Checkbox } from "@/components/ui/core/Checkbox";
import { Toggle } from "@/components/ui/core/Toggle";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { Loader } from "@/components/ui/core/Loader";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/core/Table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/core/Pagination";
import { AlertCircle, Heart } from "lucide-react";
import {
  useTeamActivitiesStore,
  useActivities,
  useTeamActivities,
  useUpdateTeamActivities,
} from "@/store/team-activities-store";

interface TeamActivitiesConfigProps {
  teamId: string;
  onUpdate?: () => void;
}

function TeamActivitiesConfig({ teamId, onUpdate }: TeamActivitiesConfigProps) {
  const {
    selectedActivityIds,
    setSelectedActivityIds,
    toggleActivity,
    selectAll,
    unselectAll,
  } = useTeamActivitiesStore();

  const {
    data: activities = [],
    isLoading: isActivitiesLoading,
    error: activitiesError,
  } = useActivities();

  const {
    data: teamActivities = [],
    isLoading: isTeamActivitiesLoading,
    error: teamActivitiesError,
  } = useTeamActivities(teamId);

  const updateTeamActivities = useUpdateTeamActivities();

  useEffect(() => {
    if (teamActivities.length > 0) {
      setSelectedActivityIds(teamActivities.map((activity) => activity.id));
    }
  }, [teamActivities, setSelectedActivityIds]);

  const isLoading = isActivitiesLoading || isTeamActivitiesLoading;
  const error = activitiesError || teamActivitiesError;

  const handleSave = async () => {
    try {
      await updateTeamActivities.mutateAsync({
        teamId,
        activityIds: selectedActivityIds,
      });
      onUpdate?.();
    } catch (err) {
      console.error("Failed to update team activities:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="loader">
        <Loader size="base" label="Loading..." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert data-slot="alert" variant="destructive">
          {/* Replaced h-4 w-4 with size-4 */}
          <AlertCircle className="size-4" />
          <AlertDescription data-slot="alert-description">
            {error instanceof Error ? error.message : "An error occurred"}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <div className="view-controls-bar">
          <div className="body-base">To be added: sorting and filtering</div>
        </div>

        {activities.length === 0 ? (
          <span className="missing-content">No activities available</span>
        ) : (
          <Table data-slot="table">
            <TableHeader data-slot="table-header">
              <TableRow data-slot="table-row">
                <TableHead data-slot="table-head" className="w-0">
                  <Checkbox
                    checked={activities.length === selectedActivityIds.length}
                    onCheckedChange={(checked) => {
                      if (checked) selectAll(activities);
                      else unselectAll();
                    }}
                  />
                </TableHead>
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
                  Favourite
                </TableHead>
                <TableHead data-slot="table-head" className="w-0">
                  Used
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody data-slot="table-body">
              {activities.map((activity) => (
                <TableRow data-slot="table-row" key={activity.id}>
                  <TableCell data-slot="table-cell">
                    <Checkbox
                      checked={selectedActivityIds.includes(activity.id)}
                      onCheckedChange={() => toggleActivity(activity.id)}
                      disabled={isLoading}
                    />
                  </TableCell>
                  <TableCell data-slot="table-cell">
                    <div className="flex flex-col">
                      <span className="font-medium">{activity.name}</span>
                      <span className="body-sm">
                        {activity.description || "No description"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell data-slot="table-cell" className="text-sm w-0 whitespace-nowrap">
                    {activity.category || "No category"}
                  </TableCell>
                  <TableCell data-slot="table-cell" className="text-center text-sm">
                    10<span>/10</span>
                  </TableCell>
                  <TableCell data-slot="table-cell" className="text-center text-sm">
                    8<span>/10</span>
                  </TableCell>
                  <TableCell data-slot="table-cell" className="text-center font-semibold">
                    18<span className="text-sm font-normal">/20</span>
                  </TableCell>
                  <TableCell data-slot="table-cell" className="text-center">
                    <Toggle data-slot="toggle" size="sm">
                      {/* Replaced empty className with size-4 */}
                      <Heart className="size-4" />
                    </Toggle>
                  </TableCell>
                  <TableCell data-slot="table-cell" className="text-center">
                    {activity._count?.ratings || 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

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
      </div>
    </div>
  );
}

export default TeamActivitiesConfig;
