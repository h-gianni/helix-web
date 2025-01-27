import { useState, useEffect } from "react";
import {
 Card,
 CardHeader,
 CardTitle,
 CardContent,
 CardDescription,
 CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox"; 
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Label } from "@/components/ui/Label";
import { RotateCcw, Save, AlertCircle } from "lucide-react";
import type { BusinessActivityResponse as InitiativeResponse, TeamResponse } from "@/lib/types/api";
import { TeamInitiative } from "@/lib/types/intiative";

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

       const [initiativesRes, teamInitiativeRes] = await Promise.all([
         fetch("/api/initiatives"),
         fetch(`/api/teams/${team.id}/initiatives`)
       ]);

       const [initiativesData, teamInitiativeData] = await Promise.all([
         initiativesRes.json(),
         teamInitiativeRes.json()
       ]);

       if (!initiativesData.success) throw new Error(initiativesData.error);
       if (!teamInitiativeData.success) throw new Error(teamInitiativeData.error);

       setInitiatives(initiativesData.data);
       setSelectedInitiativeIds(
         teamInitiativeData.data.map((ti: TeamInitiative) => ti.initiativeId)
       );
     } catch (err) {
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
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ initiativeIds: selectedInitiativeIds }),
     });

     if (!response.ok) {
       const data = await response.json();
       throw new Error(data.error || "Failed to update team initiatives");
     }

     await onUpdate();
   } catch (err) {
     setError(err instanceof Error ? err.message : "An error occurred");
   } finally {
     setSaving(false);
   }
 };

 if (loading) {
   return <div className="text-muted-foreground">Loading...</div>;
 }

 return (
   <Card>
     <CardHeader>
       <div className="flex items-center justify-between">
         <div className="space-y-1">
           <CardTitle>Team Performance Initiatives</CardTitle>
           <CardDescription>
             Configure which initiatives will be used for performance ratings.
           </CardDescription>
         </div>
         <div className="flex gap-2">
           <Button
             variant="neutral"
             appearance="icon-only"
             size="sm"
             onClick={() => window.location.reload()}
             disabled={saving}
             isLoading={saving}
             leadingIcon={<RotateCcw className="h-4 w-4" />}
           />
           <Button
             variant="primary"
             onClick={handleSubmit}
             disabled={saving}
             isLoading={saving}
             leadingIcon={<Save className="h-4 w-4" />}
           >
             Save Changes
           </Button>
         </div>
       </div>
     </CardHeader>

     <CardContent className="space-y-6">
       {error && (
         <Alert variant="danger">
           <AlertCircle className="h-4 w-4" />
           <AlertDescription>{error}</AlertDescription>
         </Alert>
       )}

       <div className="space-y-2">
         <Label>Team Name</Label>
         <p>{team.name}</p>
       </div>

       <div className="space-y-4">
         <div className="flex items-center justify-between">
           <div>
             <h3 className="text-lg font-medium">Initiatives Selection</h3>
             <p className="text-sm text-muted-foreground">
               Select which initiatives will be used for performance ratings.
             </p>
           </div>
           <div className="flex gap-2">
             <Button
               variant="neutral"
               appearance="outline"
               size="sm"
               onClick={() => setSelectedInitiativeIds(initiatives.map(i => i.id))}
             >
               Select All
             </Button>
             <Button
               variant="neutral"
               appearance="outline"
               size="sm"
               onClick={() => setSelectedInitiativeIds([])}
             >
               Unselect All
             </Button>
           </div>
         </div>

         <div className="space-y-4">
           {initiatives.map((initiative) => (
             <div key={initiative.id} className="flex items-start gap-2">
               <Checkbox
                 id={`initiative-${initiative.id}`}
                 checked={selectedInitiativeIds.includes(initiative.id)}
                 onCheckedChange={() => {
                   setSelectedInitiativeIds(prev => 
                     prev.includes(initiative.id) 
                       ? prev.filter(id => id !== initiative.id)
                       : [...prev, initiative.id]
                   );
                 }}
               />
               <Label 
                 htmlFor={`initiative-${initiative.id}`}
                 className="text-sm leading-none"
               >
                 <span className="font-medium">{initiative.name}</span>
                 {initiative.description && (
                   <span className="ml-2 text-muted-foreground">
                     - {initiative.description}
                   </span>
                 )}
               </Label>
             </div>
           ))}

           {initiatives.length === 0 && (
             <div className="py-8 text-center text-muted-foreground">
               No initiatives available. Please create initiatives first.
             </div>
           )}
         </div>
       </div>
     </CardContent>

     <CardFooter>
       <Button
         variant="neutral" 
         appearance="text"
         onClick={() => window.location.href = "/dashboard/settings/initiatives"}
       >
         Manage initiatives
       </Button>
     </CardFooter>
   </Card>
 );
}