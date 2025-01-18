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
} from "@/components/ui/Select";
import type { DisciplineResponse } from "@/lib/types/api";

interface TeamCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam: (name: string, disciplineId: string) => Promise<void>;
}

export default function TeamCreateModal({
  isOpen,
  onClose,
  onCreateTeam,
}: TeamCreateModalProps) {
  const [teamName, setTeamName] = useState("");
  const [disciplineId, setDisciplineId] = useState("");
  const [disciplines, setDisciplines] = useState<DisciplineResponse[]>([]);
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

  const resetForm = () => {
    setTeamName("");
    setDisciplineId("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      if (!disciplineId) {
        throw new Error("Please select a discipline");
      }

      await onCreateTeam(teamName.trim(), disciplineId);
      resetForm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent size="base">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Create a new team by selecting its discipline and providing a name.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="danger">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <Select 
              value={disciplineId} 
              onValueChange={setDisciplineId}
              disabled={loading}
              withLabel
              label="Discipline"
            >
              <SelectTrigger>
                <SelectValue 
                  placeholder={loading ? "Loading disciplines..." : "Select a discipline"} 
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
            </Select>

            <Input
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
              inputSize="base"
              required
              withLabel
              label="Team Name"
              error={!!error}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="neutral"
              appearance="default"
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={saving || !teamName.trim() || !disciplineId || loading}
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