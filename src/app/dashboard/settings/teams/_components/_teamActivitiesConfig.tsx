import { useEffect } from "react";
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

export default function TeamActivitiesConfig({
  teamId,
  onUpdate,
}: TeamActivitiesConfigProps) {
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
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "An error occurred"}
          </AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <div className="view-controls-bar">
          {/* <div className="flex items-center gap-4">
            <Checkbox
              checked={activities.length === selectedActivityIds.length}
              onCheckedChange={(checked) => {
                if (checked) selectAll(activities);
                else unselectAll();
              }}
            />
            <span className="text-sm text-foreground-weak">
              {selectedActivityIds.length} of {activities.length} selected
            </span>
          </div> */}
          <div className="body-base">To be added: sorting and filtering</div>
        </div>

        {activities.length === 0 ? (
          <div className="missing-content">No activities available</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-0">
                  <Checkbox
                    checked={activities.length === selectedActivityIds.length}
                    onCheckedChange={(checked) => {
                      if (checked) selectAll(activities);
                      else unselectAll();
                    }}
                  />
                </TableHead>
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
                <TableHead className="w-0">Favourite</TableHead>
                <TableHead className="w-0">Used</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedActivityIds.includes(activity.id)}
                      onCheckedChange={() => toggleActivity(activity.id)}
                      disabled={isLoading}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{activity.name}</span>
                      <span className="body-sm text-foreground-muted">
                        {activity.description || "No description"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-foreground-muted w-0 whitespace-nowrap">
                    {activity.category || "No category"}
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
                  <TableCell className="text-center">
                    <Toggle size="sm">
                      <Heart className="text-foreground-muted" />
                    </Toggle>
                  </TableCell>
                  <TableCell className="text-center text-foreground-muted">
                    {activity._count?.ratings || 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
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
      </div>
    </div>
  );
}
