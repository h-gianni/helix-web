import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { 
 Card, 
 CardContent,
 CardHeader, 
 CardTitle,
 CardDescription 
} from "@/components/ui/Card";
import {
 Table,
 TableHeader,
 TableRow,
 TableHead,
 TableCell,
 TableBody,
} from "@/components/ui/Table";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Target, PlusCircle, Edit, Trash2, RotateCcw, AlertCircle } from "lucide-react";
import {
 AlertDialog,
 AlertDialogContent,
 AlertDialogHeader,
 AlertDialogTitle,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogCancel,
 AlertDialogAction,
} from "@/components/ui/AlertDialog";
// import type { ApiResponse, BusinessActivityResponse as InitiativeResponse } from "@/lib/types/api";
import { ActivityModal } from "./_activityModal";
import type { ApiResponse, BusinessActivityResponse } from "@/lib/types/api";

interface ActivitiesSectionProps {
  onUpdate: () => void;
}

export function ActivitiesSection({ onUpdate }: ActivitiesSectionProps) {
  const [activities, setActivities] = useState<BusinessActivityResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<BusinessActivityResponse | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async (showRefreshIndicator = true) => {
    try {
      showRefreshIndicator && setIsRefreshing(true);
      setError(null);

      const response = await fetch(`/api/business-activities?t=${Date.now()}`);
      const data: ApiResponse<BusinessActivityResponse[]> = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch business activities");
      }

      setActivities(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsRefreshing(false);
    }
  };

 useEffect(() => {
   fetchActivities(false);
 }, []);

 const handleDelete = async () => {
  if (!selectedActivity) return;

  try {
    const response = await fetch(`/api/business-activities/${selectedActivity.id}`, {
      method: "DELETE",
    });

    const data = await response.json();
    if (data.success) {
      await fetchActivities();
      onUpdate();
    }
  } catch (error) {
    console.error("Error deleting business activity:", error);
  } finally {
    setIsDeleteDialogOpen(false);
    setSelectedActivity(null);
  }
};

return (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-semibold">Business Activities</h2>
        <Button
          variant="neutral"
          appearance="icon-only"
          size="sm"
          onClick={() => fetchActivities()}
          disabled={isRefreshing}
          isLoading={isRefreshing}
          leadingIcon={<RotateCcw className="h-4 w-4" />}
        />
      </div>
      <Button
        variant="primary"
        onClick={() => {
          setSelectedActivity(null);
          setIsModalOpen(true);
        }}
        leadingIcon={<PlusCircle className="h-4 w-4" />}
      >
        Add Activity
      </Button>
    </div>

     {error && (
       <Alert variant="danger">
         <AlertCircle className="h-4 w-4" />
         <AlertDescription className="flex items-center gap-2">
           {error}
           <Button
             variant="neutral"
             appearance="outline"
             size="sm"
             onClick={() => fetchActivities()}
           >
             Retry
           </Button>
         </AlertDescription>
       </Alert>
     )}

{activities.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="space-y-4 text-center">
              <Target className="mx-auto h-12 w-12 text-muted-foreground" />
              <div className="space-y-2">
                <CardTitle>No business activities yet</CardTitle>
                <CardDescription>
                  Create business activities to track team performance.
                </CardDescription>
              </div>
              <Button
                variant="primary"
                onClick={() => setIsModalOpen(true)}
                leadingIcon={<PlusCircle className="h-4 w-4" />}
              >
                Create Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Ratings</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {activity.description || "No description"}
                  </TableCell>
                  <TableCell>{activity._count?.ratings || 0}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="neutral"
                        appearance="text"
                        size="sm"
                        onClick={() => {
                          setSelectedActivity(activity);
                          setIsModalOpen(true);
                        }}
                        leadingIcon={<Edit className="h-4 w-4" />}
                      />
                      <Button
                        variant="danger"
                        appearance="text"
                        size="sm"
                        onClick={() => {
                          setSelectedActivity(activity);
                          setIsDeleteDialogOpen(true);
                        }}
                        leadingIcon={<Trash2 className="h-4 w-4" />}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedActivity(null);
        }}
        activity={selectedActivity}
        onUpdate={async () => {
          await fetchActivities();
          onUpdate();
        }}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Business Activity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this business activity? This action
              cannot be undone. All associated ratings and feedback will be
              permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="neutral" appearance="outline">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="danger" onClick={handleDelete}>Delete Activity</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}