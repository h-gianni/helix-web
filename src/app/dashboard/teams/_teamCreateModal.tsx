import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/core/Dialog";
import { Button } from "@/components/ui/core/Button";
import { Input } from "@/components/ui/core/Input";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { AlertCircle, Loader } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/core/Select";
import type { TeamFunctionResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";

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
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
          <div className="flex flex-col gap-2">
  <label className="text-sm font-medium text-foreground" htmlFor="teamFunction">
    Team Function
  </label>
  <Select
    value={teamFunctionId ?? ""}
    onValueChange={(value) => {
      console.log("Selected value:", value);
      setTeamFunctionId(value);
      setError(null);
    }}
    name="teamFunction"
    disabled={loading}
  >
    <SelectTrigger className={cn("w-full", error && !teamFunctionId && "border-red-500")}>
      <SelectValue placeholder={loading ? "Loading functions..." : "Select a function"} />
    </SelectTrigger>
    <SelectContent>
      {teamFunctions.map((teamFunction) => (
        <SelectItem key={teamFunction.id} value={teamFunction.id}>
          {teamFunction.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  {error && !teamFunctionId && (
    <p className="text-sm text-red-500">Please select a team function.</p>
  )}
</div>


<div className="flex flex-col gap-2">
  <label className="text-sm font-medium text-foreground" htmlFor="teamName">
    Team Name
  </label>
  <Input
    id="teamName"
    value={teamName}
    onChange={(e) => {
      setTeamName(e.target.value);
      setError(null);
    }}
    placeholder="Enter team name"
    className={cn("w-full", error && !teamName.trim() && "border-red-500")}
  />
  {error && !teamName.trim() && (
    <p className="text-sm text-red-500">Team name is required.</p>
  )}
</div>

          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button variant="default" type="submit" disabled={saving}>
  {saving ? (
    <span className="flex items-center gap-2">
      <Loader className="h-4 w-4 animate-spin" />
      Creating...
    </span>
  ) : (
    "Create Team"
  )}
</Button>

          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}