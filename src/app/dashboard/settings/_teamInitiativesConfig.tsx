// app/dashboard/teams/[teamId]/_teamInitiativesConfig.tsx
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { RotateCcw, Save } from "lucide-react";
import type { InitiativeResponse, TeamResponse } from "@/lib/types/api";

interface TeamInitiativesConfigProps {
  team: TeamResponse;
  onUpdate: () => Promise<void>;
}

export default function TeamInitiativesConfig({
  team,
  onUpdate,
}: TeamInitiativesConfigProps) {
  const [initiatives, setInitiatives] = useState<InitiativeResponse[]>([]);
  const [selectedInitiativeIds, setSelectedInitiativeIds] = useState<string[]>([]);
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
          teamInitiativeData.data.map((ti: any) => ti.initiativeId)
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
    setSelectedInitiativeIds(prev =>
      prev.includes(initiativeId)
        ? prev.filter(id => id !== initiativeId)
        : [...prev, initiativeId]
    );
  };

  const handleSelectAll = () => {
    setSelectedInitiativeIds(initiatives.map(initiative => initiative.id));
  };

  const handleUnselectAll = () => {
    setSelectedInitiativeIds([]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Team Performance Initiatives</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.location.reload()}
            disabled={saving}
          >
            <RotateCcw className={`h-4 w-4 ${saving ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Team Name</label>
        <p className="text-base">{team.name}</p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Initiatives Selection</h3>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={handleUnselectAll}>
              Unselect All
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Select which initiatives will be used for performance ratings in this team.
        </p>
      </div>

      <div className="space-y-4">
        {initiatives.map((initiative) => (
          <div key={initiative.id} className="flex items-center space-x-2">
            <Checkbox
              id={`initiative-${initiative.id}`}
              checked={selectedInitiativeIds.includes(initiative.id)}
              onCheckedChange={() => handleInitiativeToggle(initiative.id)}
            />
            <label
              htmlFor={`initiative-${initiative.id}`}
              className="text-sm font-medium"
            >
              {initiative.name}
              {initiative.description && (
                <span className="text-gray-500 ml-2">
                  - {initiative.description}
                </span>
              )}
            </label>
          </div>
        ))}
      </div>

      {initiatives.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No initiatives available. Please create initiatives first.
        </div>
      )}

      <div className="mt-4 pt-4 border-t">
        <button
          onClick={() => window.location.href = "/dashboard/settings?tab=initiatives"}
          className="text-blue-600 hover:underline text-sm"
        >
          Manage initiatives
        </button>
      </div>
    </Card>
  );
}