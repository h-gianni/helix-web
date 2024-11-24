import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/Table";
import { Target, PlusCircle, Edit, Trash2, RotateCcw } from "lucide-react";
import { InitiativeModal } from "./_initiativeModal";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/AlertDialog";
import type { ApiResponse, InitiativeResponse } from "@/lib/types/api";

interface InitiativesSectionProps {
  onUpdate: () => void;
}

export function InitiativesSection({ onUpdate }: InitiativesSectionProps) {
  const [initiatives, setInitiatives] = useState<InitiativeResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInitiative, setSelectedInitiative] =
    useState<InitiativeResponse | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInitiatives = async (showRefreshIndicator = true) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      }
      setError(null);

      const response = await fetch(
        `/api/initiatives?t=${new Date().getTime()}`
      );
      const data: ApiResponse<InitiativeResponse[]> = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch initiatives");
      }

      setInitiatives(data.data || []);
    } catch (err) {
      console.error("Error fetching initiatives:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInitiatives(false);
  }, []);

  const handleCreateClick = () => {
    setSelectedInitiative(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (initiative: InitiativeResponse) => {
    setSelectedInitiative(initiative);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (initiative: InitiativeResponse) => {
    setSelectedInitiative(initiative);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedInitiative) return;

    try {
      const response = await fetch(
        `/api/initiatives/${selectedInitiative.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (data.success) {
        await fetchInitiatives();
        onUpdate();
      }
    } catch (error) {
      console.error("Error deleting initiative:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedInitiative(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Performance Initiatives</h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchInitiatives()}
            disabled={isRefreshing}
          >
            <RotateCcw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
        <Button onClick={handleCreateClick}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Initiative
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          {error}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchInitiatives()}
            className="ml-2"
          >
            Retry
          </Button>
        </div>
      )}

      {initiatives.length === 0 ? (
        <Card className="p-8">
          <div className="text-center">
            <Target className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">No initiatives yet</h3>
            <p className="mt-1 text-gray-500">
              Create initiatives to track team performance.
            </p>
            <Button onClick={handleCreateClick} className="mt-4">
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Initiative
            </Button>
          </div>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Ratings</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initiatives.map((initiative) => (
              <TableRow key={initiative.id}>
                <TableCell>{initiative.name}</TableCell>
                <TableCell>
                  {initiative.description || "No description"}
                </TableCell>
                <TableCell>{initiative._count?.scores || 0}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(initiative)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(initiative)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <InitiativeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedInitiative(null);
        }}
        initiative={selectedInitiative}
        onUpdate={async () => {
          await fetchInitiatives();
          onUpdate();
        }}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Initiative</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this initiative? This action
              cannot be undone. All associated ratings and feedback will be
              permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete Initiative
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
