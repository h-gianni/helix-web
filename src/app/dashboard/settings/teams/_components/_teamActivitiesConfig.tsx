import { useEffect } from "react"
import { Button } from "@/components/ui/core/Button"
import { Checkbox } from "@/components/ui/core/Checkbox"
import { Toggle } from "@/components/ui/core/Toggle"
import { Alert, AlertDescription } from "@/components/ui/core/Alert"
import { Loader } from "@/components/ui/core/Loader";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/core/Table"
import { AlertCircle, Heart } from "lucide-react"
import { useTeamActivitiesStore, useActivities, useTeamActivities, useUpdateTeamActivities } from '@/store/team-activities-store'

interface TeamActivitiesConfigProps {
  teamId: string
  onUpdate?: () => void
}

export default function TeamActivitiesConfig({
  teamId,
  onUpdate,
}: TeamActivitiesConfigProps) {
  const {
    selectedActivityIds,
    setSelectedActivityIds,
    toggleActivity,
    selectAll,
    unselectAll
  } = useTeamActivitiesStore()

  const { 
    data: activities = [], 
    isLoading: isActivitiesLoading,
    error: activitiesError
  } = useActivities()

  const {
    data: teamActivities = [],
    isLoading: isTeamActivitiesLoading,
    error: teamActivitiesError
  } = useTeamActivities(teamId)

  const updateTeamActivities = useUpdateTeamActivities()

  useEffect(() => {
    if (teamActivities.length > 0) {
      setSelectedActivityIds(teamActivities.map(activity => activity.id))
    }
  }, [teamActivities, setSelectedActivityIds])

  const isLoading = isActivitiesLoading || isTeamActivitiesLoading
  const error = activitiesError || teamActivitiesError

  const handleSave = async () => {
    try {
      await updateTeamActivities.mutateAsync({
        teamId,
        activityIds: selectedActivityIds
      })
      onUpdate?.()
    } catch (err) {
      console.error('Failed to update team activities:', err)
    }
  }

 if (isLoading) {
   return (
    <div className="loader"><Loader size="base" label="Loading..." /></div>
   );
 }

  return (
    <div className="space-y-base">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : 'An error occurred'}
          </AlertDescription>
        </Alert>
      )}

     <div className="ui-view-controls-bar">
       <div className="flex items-center gap-base">
         <Checkbox
           checked={activities.length === selectedActivityIds.length}
           onCheckedChange={(checked) => {
             if (checked) selectAll(activities);
             else unselectAll();
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
                   if (checked) selectAll(activities);
                   else unselectAll();
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
                   onCheckedChange={() => toggleActivity(activity.id)}
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