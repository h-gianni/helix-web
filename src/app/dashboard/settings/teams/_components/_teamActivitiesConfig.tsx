import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox"; 
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { RotateCcw, Save, AlertCircle } from "lucide-react";
import type { BusinessActivityResponse as ActivityResponse, TeamResponse } from "@/lib/types/api";

interface TeamActivitiesConfigProps {
  onUpdate: () => Promise<void>;
}

export default function TeamActivitiesConfig({ onUpdate }: TeamActivitiesConfigProps) {
  const [teams, setTeams] = useState<TeamResponse[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<TeamResponse | null>(null);
  const [activities, setActivities] = useState<ActivityResponse[]>([]);
  const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchActivities(selectedTeam.id);
    }
  }, [selectedTeam]);

  const fetchTeams = async () => {
    try {
      setLoading(true);  // Set loading at the start
      const response = await fetch("/api/teams");
      const data = await response.json();
      if (data.success) {
        setTeams(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch teams");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch teams");
      console.error("Error fetching teams:", err);
    } finally {
      setLoading(false);  // Set loading false regardless of outcome
    }
  };

  const fetchActivities = async (teamId: string) => {
    try {
      setActivitiesLoading(true);
      setError(null);

      const [activitiesRes, teamActivitiesRes] = await Promise.all([
        fetch("/api/business-activities"),
        fetch(`/api/teams/${teamId}/activities`)
      ]);

      const [activitiesData, teamActivitiesData] = await Promise.all([
        activitiesRes.json(),
        teamActivitiesRes.json()
      ]);

      if (!activitiesData.success) throw new Error(activitiesData.error);
      if (!teamActivitiesData.success) throw new Error(teamActivitiesData.error);

      setActivities(activitiesData.data);
      setSelectedActivityIds(teamActivitiesData.data.map((activity: ActivityResponse) => activity.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setActivitiesLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTeam) return;
    
    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`/api/teams/${selectedTeam.id}/activities`, {
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
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-muted-foreground">Loading teams...</div>;
  }
  if (error) {
    return (
      <Alert variant="danger">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Team Performance Activities</CardTitle>
            <CardDescription>
              Configure which activities will be used for performance ratings.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="danger">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <Select
            value={selectedTeam?.id || ''}
            onValueChange={(value) => {
              const team = teams.find(t => t.id === value);
              setSelectedTeam(team || null);
            }}
            width="full"
            withLabel
            label="Select Team"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a team" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedTeam && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Activities Selection</h3>
                  <p className="text-sm text-muted-foreground">
                    Select which activities will be used for performance ratings.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="neutral"
                    appearance="outline"
                    size="sm"
                    onClick={() => setSelectedActivityIds(activities.map(i => i.id))}
                    disabled={activitiesLoading}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="neutral"
                    appearance="outline"
                    size="sm"
                    onClick={() => setSelectedActivityIds([])}
                    disabled={activitiesLoading}
                  >
                    Unselect All
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={saving || activitiesLoading}
                    isLoading={saving}
                    leadingIcon={<Save className="h-4 w-4" />}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>

              {activitiesLoading ? (
                <div className="text-muted-foreground">Loading activities...</div>
              ) : (
                <div className="space-y-4">
                  {activities.length === 0 ? (
                    <div className="text-muted-foreground">No activities found</div>
                  ) : (
                    activities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-2">
                        <Checkbox
                          id={`activity-${activity.id}`}
                          checked={selectedActivityIds.includes(activity.id)}
                          onCheckedChange={() => {
                            setSelectedActivityIds(prev => 
                              prev.includes(activity.id) 
                                ? prev.filter(id => id !== activity.id)
                                : [...prev, activity.id]
                            );
                          }}
                        />
                        <Label 
                          htmlFor={`activity-${activity.id}`}
                          className="text-sm leading-none"
                        >
                          <span className="font-medium">{activity.name}</span>
                          {activity.description && (
                            <span className="ml-2 text-muted-foreground">
                              - {activity.description}
                            </span>
                          )}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}