import React, { useState, useEffect } from "react";
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
  const [teamFunctions, setTeamFunctions] = useState<TeamFunctionResponse[]>([]);
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

    // Validation checks
    if (!teamName.trim()) {
      setError("Team name is required");
      return;
    }
    if (!teamFunctionId) {
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
    <Dialog data-slot="dialog" open={isOpen} onOpenChange={onClose}>
      <DialogContent data-slot="dialog-content">
        <DialogHeader data-slot="dialog-header">
          <DialogTitle data-slot="dialog-title">Create New Team</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert data-slot="alert" variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription data-slot="alert-description">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {/* Team Function */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground" htmlFor="teamFunction">
                Team Function
              </label>
              <Select
                data-slot="select"
                value={teamFunctionId ?? ""}
                onValueChange={(value) => {
                  setTeamFunctionId(value);
                  setError(null);
                }}
                name="teamFunction"
                disabled={loading}
              >
                <SelectTrigger
                  data-slot="select-trigger"
                  className={cn("w-full", error && !teamFunctionId && "border-red-500")}
                >
                  <SelectValue
                    data-slot="select-value"
                    placeholder={loading ? "Loading functions..." : "Select a function"}
                  />
                </SelectTrigger>
                <SelectContent data-slot="select-content">
                  {teamFunctions.map((teamFunction) => (
                    <SelectItem
                      data-slot="select-item"
                      key={teamFunction.id}
                      value={teamFunction.id}
                    >
                      {teamFunction.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {error && !teamFunctionId && (
                <p className="text-sm text-red-500">Please select a team function.</p>
              )}
            </div>

            {/* Team Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground" htmlFor="teamName">
                Team Name
              </label>
              <Input
                data-slot="input"
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

          <DialogFooter data-slot="dialog-footer">
            <Button data-slot="button" variant="secondary" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button data-slot="button" variant="default" type="submit" disabled={saving}>
              {saving ? (
                <span className="flex items-center gap-2">
                  {/* Replaced h-4 w-4 with size-4 */}
                  <Loader className="size-4 animate-spin" />
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
