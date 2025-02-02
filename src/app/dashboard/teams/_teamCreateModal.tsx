import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import type { TeamFunctionResponse } from "@/lib/types/api";

interface TeamCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam: (name: string, teamFunctionId: string) => Promise<void>;
}

export default function TeamCreateModal({
  isOpen,
  onClose,
  onCreateTeam,
}: TeamCreateModalProps) {
  const [teamName, setTeamName] = useState("");
  const [teamFunctionId, setTeamFunctionId] = useState("");
  const [teamFunctions, setTeamFunctions] = useState<TeamFunctionResponse[]>(
    []
  );
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamFunctions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/team-functions");
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || "Failed to fetch team functions");
        }
        setTeamFunctions(data.data);
      } catch (err) {
        console.error("Error fetching team functions:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchTeamFunctions();
      setTeamName("");
      setTeamFunctionId("");
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    console.log("Form submission:", {
      teamName: teamName.trim(),
      teamFunctionId,
      hasTeamName: !!teamName.trim(),
      hasTeamFunction: !!teamFunctionId,
    });

    // Validation checks
    if (!teamName.trim()) {
      setError("Team name is required");
      return;
    }

    if (!teamFunctionId) {
      console.log("No team function selected");
      setError("Please select a team function");
      return;
    }

    try {
      setSaving(true);
      await onCreateTeam(teamName.trim(), teamFunctionId);
      onClose();
    } catch (err) {
      console.error("Error creating team:", err);
      setError(err instanceof Error ? err.message : "Failed to create team");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="danger">
              <AlertCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <Select
              label="Team function"
              withLabel
              error={!!error && !teamFunctionId}
              value={teamFunctionId}
              onValueChange={(value) => {
                console.log("Selected value:", value);
                setTeamFunctionId(value);
                setError(null);
              }}
              name="teamFunction"
            >
              <SelectTrigger className="w-full" disabled={loading}>
                <SelectValue
                  placeholder={
                    loading ? "Loading functions..." : "Select a function"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {teamFunctions.map((teamFunction) => (
                  <SelectItem key={teamFunction.id} value={teamFunction.id}>
                    {teamFunction.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              value={teamName}
              onChange={(e) => {
                setTeamName(e.target.value);
                setError(null);
              }}
              placeholder="Enter team name"
              label="Team Name"
              withLabel
              error={!!error && !teamName.trim()}
            />
          </div>

          <DialogFooter>
            <Button
              variant="neutral"
              appearance="text"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={saving}>
              Create Team
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
