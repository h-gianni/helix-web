// src/app/dashboard/_component/_teamActivitiesConfig.tsx
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/core/Button";
import { Checkbox } from "@/components/ui/core/Checkbox";
import { Toggle } from "@/components/ui/core/Toggle";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import {
 Table,
 TableHeader,
 TableRow,
 TableHead,
 TableCell,
 TableBody,
} from "@/components/ui/core/Table";
import { AlertCircle, Heart } from "lucide-react";
import type { BusinessActivityResponse as ActivityResponse } from "@/lib/types/api";

interface TeamActivitiesConfigProps {
 teamId: string;
 onUpdate: () => Promise<void>;
}

export default function TeamActivitiesConfig({
 teamId,
 onUpdate,
}: TeamActivitiesConfigProps) {
 const [activities, setActivities] = useState<ActivityResponse[]>([]);
 const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 const fetchActivities = useCallback(async () => {
   try {
     setIsLoading(true);
     setError(null);

     const [activitiesRes, teamActivitiesRes] = await Promise.all([
       fetch("/api/business-activities"),
       fetch(`/api/teams/${teamId}/activities`),
     ]);

     const [activitiesData, teamActivitiesData] = await Promise.all([
       activitiesRes.json(),
       teamActivitiesRes.json(),
     ]);

     if (!activitiesData.success) throw new Error(activitiesData.error);
     if (!teamActivitiesData.success)
       throw new Error(teamActivitiesData.error);

     setActivities(activitiesData.data);
     setSelectedActivityIds(
       teamActivitiesData.data.map((activity: ActivityResponse) => activity.id)
     );
   } catch (err) {
     setError(err instanceof Error ? err.message : "An error occurred");
   } finally {
     setIsLoading(false);
   }
 }, [teamId]);

 useEffect(() => {
   fetchActivities();
 }, [fetchActivities]);

 const handleSelectAll = useCallback(() => {
   setSelectedActivityIds(activities.map((i) => i.id));
 }, [activities]);

 const handleUnselectAll = useCallback(() => {
   setSelectedActivityIds([]);
 }, []);

 const handleActivityToggle = useCallback((activityId: string) => {
   setSelectedActivityIds((prev) =>
     prev.includes(activityId)
       ? prev.filter((id) => id !== activityId)
       : [...prev, activityId]
   );
 }, []);

 if (isLoading) {
   return (
     <div className="text-foreground-muted">
       Loading activities configuration...
     </div>
   );
 }

 return (
   <div className="space-y-base">
     {error && (
       <Alert variant="destructive">
         <AlertCircle />
         <AlertDescription>{error}</AlertDescription>
       </Alert>
     )}

     <div className="ui-view-controls-bar">
       <div className="flex items-center gap-base">
         <Checkbox
           checked={activities.length === selectedActivityIds.length}
           onCheckedChange={(checked) => {
             if (checked) handleSelectAll();
             else handleUnselectAll();
           }}
         />
         <span className="text-sm text-foreground-muted">
           {selectedActivityIds.length} of {activities.length} selected
         </span>
       </div>
     </div>

     {activities.length === 0 ? (
       <div className="text-foreground-muted">No activities available</div>
     ) : (
       <Table>
         <TableHeader>
           <TableRow>
             <TableHead className="w-[50px]">
               <Checkbox
                 checked={activities.length === selectedActivityIds.length}
                 onCheckedChange={(checked) => {
                   if (checked) handleSelectAll();
                   else handleUnselectAll();
                 }}
               />
             </TableHead>
             <TableHead>Category</TableHead>
             <TableHead>Activity</TableHead>
             <TableHead>Description</TableHead>
             <TableHead className="w-0">Business Impact</TableHead>
             <TableHead className="w-0">Favourite</TableHead>
             <TableHead className="w-0">Ratings</TableHead>
           </TableRow>
         </TableHeader>
         <TableBody>
           {activities.map((activity) => (
             <TableRow key={activity.id}>
               <TableCell>
                 <Checkbox
                   checked={selectedActivityIds.includes(activity.id)}
                   onCheckedChange={() => handleActivityToggle(activity.id)}
                   disabled={isLoading}
                 />
               </TableCell>
               <TableCell className="text-foreground-weak">category</TableCell>
               <TableCell className="font-medium">{activity.name}</TableCell>
               <TableCell className="text-foreground-weak">
                 {activity.description || "No description"}
               </TableCell>
               <TableCell className="text-center">18</TableCell>
               <TableCell className="text-center">
                 <Toggle size="sm">
                   <Heart />
                 </Toggle>
               </TableCell>
               <TableCell className="text-center">
                 {activity._count?.ratings || 0}
               </TableCell>
             </TableRow>
           ))}
         </TableBody>
       </Table>
     )}
   </div>
 );
}