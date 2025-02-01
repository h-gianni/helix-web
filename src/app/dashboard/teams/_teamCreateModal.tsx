import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  SelectField,
} from "@/components/ui/Select";
import type { BusinessActivityResponse as BusinessFunctionResponse } from "@/lib/types/api";

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
  const [teamFunctionId, setteamFunctionId] = useState("");
  const [disciplines, setDisciplines] = useState<BusinessFunctionResponse[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDisciplines = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/disciplines");
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || "Failed to fetch disciplines");
        }
        setDisciplines(data.data);
      } catch (err) {
        console.error("Error fetching disciplines:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchDisciplines();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      if (!teamFunctionId) {
        throw new Error("Please select a discipline");
      }
      await onCreateTeam(teamName.trim(), teamFunctionId);
      setTeamName("");
      setteamFunctionId("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          {/* <DialogDescription>
            Create a new team by selecting its function and providing a name.
          </DialogDescription> */}
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
              value={teamFunctionId} 
              onValueChange={setteamFunctionId}
              disabled={loading}
            >
              <SelectField
                width="full"
                label="Team function"
                withLabel
                error={!!error && !teamFunctionId}
              >
                <SelectTrigger>
                  <SelectValue 
                    placeholder={loading ? "Loading function..." : "Select a function"} 
                  />
                </SelectTrigger>
                <SelectContent>
                  {disciplines.map((discipline) => (
                    <SelectItem
                      key={discipline.id}
                      value={discipline.id}
                    >
                      {discipline.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectField>
            </Select>

            <Input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
              required
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
            <Button
              variant="primary"
              type="submit"
              disabled={saving || !teamName.trim() || !teamFunctionId || loading}
              isLoading={saving}
            >
              Create Team
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}