// app/dashboard/teams/[teamId]/_teamInitiativesConfig.tsx
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
import { RotateCcw, Save, AlertCircle } from "lucide-react";
import type { InitiativeResponse, TeamResponse } from "@/lib/types/api";
import { TeamInitiative } from "@/lib/types/intiative";

interface TeamInitiativesConfigProps {
  team: TeamResponse;
  onUpdate: () => Promise<void>;
}

export default function TeamInitiativesConfig({
  team,
  onUpdate,
}: TeamInitiativesConfigProps) {
  const [initiatives, setInitiatives] = useState<InitiativeResponse[]>([]);
  const [selectedInitiativeIds, setSelectedInitiativeIds] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all initiatives
        const initiativesRes = await fetch("/api/initiatives");
        const initiativesData = await initiativesRes.json();
        if (!initiativesData.success) throw new Error(initiativesData.error);
        setInitiatives(initiativesData.data);

        // Fetch team's selected initiatives
        const teamInitiativeRes = await fetch(
          `/api/teams/${team.id}/initiatives`
        );
        const teamInitiativeData = await teamInitiativeRes.json();
        if (!teamInitiativeData.success)
          throw new Error(teamInitiativeData.error);

        setSelectedInitiativeIds(
          teamInitiativeData.data.map((ti: TeamInitiative) => ti.initiativeId)
        );
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [team.id]);

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`/api/teams/${team.id}/initiatives`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          initiativeIds: selectedInitiativeIds,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update team initiatives");
      }

      await onUpdate();
    } catch (err) {
      console.error("Error saving team initiatives:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleInitiativeToggle = (initiativeId: string) => {
    setSelectedInitiativeIds((prev) =>
      prev.includes(initiativeId)
        ? prev.filter((id) => id !== initiativeId)
        : [...prev, initiativeId]
    );
  };

  const handleSelectAll = () => {
    setSelectedInitiativeIds(initiatives.map((initiative) => initiative.id));
  };

  const handleUnselectAll = () => {
    setSelectedInitiativeIds([]);
  };

  if (loading) {
    return <div className="text-muted-foreground">Loading...</div>;
  }

  return (
    <Card size="default" background={true} border={true}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Team Performance Initiatives</CardTitle>
            <CardDescription>
              Configure which initiatives will be used for performance ratings.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="neutral"
              appearance="icon-only"
              size="sm"
              onClick={() => window.location.reload()}
              disabled={saving}
              isLoading={saving}
              leadingIcon={<RotateCcw className="h-4 w-4" />}
            />
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={saving}
              isLoading={saving}
              leadingIcon={<Save className="h-4 w-4" />}
            >
              Save Changes
            </Button>
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

        <div className="space-y-2">
          <Label>Team Name</Label>
          <p className="text-foreground">{team.name}</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-heading-4 text-foreground">
                Initiatives Selection
              </h3>
              <p className="text-muted-foreground text-p-small">
                Select which initiatives will be used for performance ratings in
                this team.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="neutral"
                appearance="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                Select All
              </Button>
              <Button
                variant="neutral"
                appearance="outline"
                size="sm"
                onClick={handleUnselectAll}
              >
                Unselect All
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {initiatives.map((initiative) => (
              <div key={initiative.id} className="flex items-start gap-2">
                <Checkbox
                  id={`initiative-${initiative.id}`}
                  checked={selectedInitiativeIds.includes(initiative.id)}
                  onCheckedChange={() => handleInitiativeToggle(initiative.id)}
                />
                <label
                  htmlFor={`initiative-${initiative.id}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <span className="font-medium">{initiative.name}</span>
                  {initiative.description && (
                    <span className="text-muted-foreground ml-2">
                      - {initiative.description}
                    </span>
                  )}
                </label>
              </div>
            ))}
          </div>

          {initiatives.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No initiatives available. Please create initiatives first.
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          variant="neutral"
          appearance="text"
          onClick={() =>
            (window.location.href = "/dashboard/settings/initiatives")
          }
        >
          Manage initiatives
        </Button>
      </CardFooter>
    </Card>
  );
}
