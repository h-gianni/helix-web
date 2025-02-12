import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/core/Card";
import { Button } from "@/components/ui/core/Button";
import { Checkbox } from "@/components/ui/core/Checkbox";
import { Toggle } from "@/components/ui/core/Toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/core/ToggleGroup";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/core/Table";
import { Save, AlertCircle, Heart } from "lucide-react";
import type { BusinessActivityResponse as ActivityResponse } from "@/lib/types/api";

interface TeamActivitiesConfigProps {
  teamId: string;
  onUpdate: () => Promise<void>;
}

export default function TeamActivitiesConfig({
  teamId,
  onUpdate,
}: TeamActivitiesConfigProps) {
  const [activities, setActivities] = useState<ActivityResponse[]>([]);
  const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [activitiesRes, teamActivitiesRes] = await Promise.all([
        fetch("/api/business-activities"),
        fetch(`/api/teams/${teamId}/activities`),
      ]);

      const [activitiesData, teamActivitiesData] = await Promise.all([
        activitiesRes.json(),
        teamActivitiesRes.json(),
      ]);

      if (!activitiesData.success) throw new Error(activitiesData.error);
      if (!teamActivitiesData.success)
        throw new Error(teamActivitiesData.error);

      setActivities(activitiesData.data);
      setSelectedActivityIds(
        teamActivitiesData.data.map((activity: ActivityResponse) => activity.id)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const response = await fetch(`/api/teams/${teamId}/activities`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityIds: selectedActivityIds }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update team activities");
      }

      await onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectAll = useCallback(() => {
    setSelectedActivityIds(activities.map((i) => i.id));
  }, [activities]);

  const handleUnselectAll = useCallback(() => {
    setSelectedActivityIds([]);
  }, []);

  const handleActivityToggle = useCallback((activityId: string) => {
    setSelectedActivityIds((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId]
    );
  }, []);

  if (isLoading) {
    return (
      <div className="text-muted-foreground">
        Loading activities configuration...
      </div>
    );
  }

  return (
    <Card>
      <CardHeader data-has-actions>
        <div className="flex justify-between items-start gap-xl">
          <div className="flex flex-col gap-xs">
            <CardTitle>Team Activities</CardTitle>
            <CardDescription>
              Configure which activities will be tracked for this team.
            </CardDescription>
          </div>
          <div className="flex items-center gap-base">
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSaving || isLoading}
              isLoading={isSaving}
              leadingIcon={<Save />}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-base">
        {error && (
          <Alert variant="danger">
            <AlertCircle />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="">
          {/* <div className="flex gap-sm">
            <Button
              variant="neutral"
              volume="moderate"
              size="sm"
              onClick={handleSelectAll}
              disabled={isLoading || activities.length === 0}
            >
              Select All
            </Button>
            <Button
              variant="neutral"
              volume="moderate"
              size="sm"
              onClick={handleUnselectAll}
              disabled={isLoading || selectedActivityIds.length === 0}
            >
              Unselect All
            </Button>
          </div> */}

          <div className="ui-view-controls-bar">
            <div className="flex gap-xs p-xxs">
              <div className="ui-text-heading-5 text-weak">View options bar</div>
              {/* <ToggleGroup
                type="single"
                defaultValue="left"
                size="sm"
                className="gap-sm"
              >
                <ToggleGroupItem value="a">All</ToggleGroupItem>
                <ToggleGroupItem value="b">Favourites</ToggleGroupItem>
              </ToggleGroup> */}
            </div>
            <div>
              {/* <Button
              size="sm"
              variant="neutral"
              volume="loud"
              onClick={() => setIsModalOpen(true)}
            >
              Add activity
            </Button> */}
            </div>
          </div>

          {activities.length === 0 ? (
            <div className="text-muted-foreground">No activities available</div>
          ) : (
            <Table size="sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={activities.length === selectedActivityIds.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleSelectAll();
                        } else {
                          handleUnselectAll();
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-0">Business Impact</TableHead>
                  <TableHead className="w-0">Favourite</TableHead>
                  <TableHead className="w-0">Ratings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedActivityIds.includes(activity.id)}
                        onCheckedChange={() =>
                          handleActivityToggle(activity.id)
                        }
                        disabled={isLoading}
                      />
                    </TableCell>
                    <TableCell className="text-weak">category</TableCell>
                    <TableCell className="font-medium">
                      {activity.name}
                    </TableCell>
                    <TableCell className="text-weak">
                      {activity.description || "No description"}
                    </TableCell>
                    <TableCell className="text-center">18</TableCell>
                    <TableCell className="text-center">
                      <Toggle size="sm">
                        <Heart />
                      </Toggle>
                    </TableCell>
                    <TableCell className="text-center">
                      {activity._count?.ratings || 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
