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
import { InitiativeModal } from "./_initiativeModal";
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
import type { ApiResponse, BusinessActivityResponse as InitiativeResponse } from "@/lib/types/api";

interface InitiativesSectionProps {
 onUpdate: () => void;
}

export function InitiativesSection({ onUpdate }: InitiativesSectionProps) {
 const [initiatives, setInitiatives] = useState<InitiativeResponse[]>([]);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
 const [selectedInitiative, setSelectedInitiative] = useState<InitiativeResponse | null>(null);
 const [isRefreshing, setIsRefreshing] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const fetchInitiatives = async (showRefreshIndicator = true) => {
   try {
     showRefreshIndicator && setIsRefreshing(true);
     setError(null);

     const response = await fetch(`/api/initiatives?t=${Date.now()}`);
     const data: ApiResponse<InitiativeResponse[]> = await response.json();

     if (!data.success) {
       throw new Error(data.error || "Failed to fetch initiatives");
     }

     setInitiatives(data.data || []);
   } catch (err) {
     setError(err instanceof Error ? err.message : "An error occurred");
   } finally {
     setIsRefreshing(false);
   }
 };

 useEffect(() => {
   fetchInitiatives(false);
 }, []);

 const handleDelete = async () => {
   if (!selectedInitiative) return;

   try {
     const response = await fetch(`/api/initiatives/${selectedInitiative.id}`, {
       method: "DELETE",
     });

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
         <h2 className="text-2xl font-semibold">Performance Initiatives</h2>
         <Button
           variant="neutral"
           appearance="icon-only"
           size="sm"
           onClick={() => fetchInitiatives()}
           disabled={isRefreshing}
           isLoading={isRefreshing}
           leadingIcon={<RotateCcw className="h-4 w-4" />}
         />
       </div>
       <Button
         variant="primary"
         onClick={() => {
           setSelectedInitiative(null);
           setIsModalOpen(true);
         }}
         leadingIcon={<PlusCircle className="h-4 w-4" />}
       >
         Add Initiative
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
             onClick={() => fetchInitiatives()}
           >
             Retry
           </Button>
         </AlertDescription>
       </Alert>
     )}

     {initiatives.length === 0 ? (
       <Card>
         <CardContent className="py-8">
           <div className="space-y-4 text-center">
             <Target className="mx-auto h-12 w-12 text-muted-foreground" />
             <div className="space-y-2">
               <CardTitle>No initiatives yet</CardTitle>
               <CardDescription>
                 Create initiatives to track team performance.
               </CardDescription>
             </div>
             <Button
               variant="primary"
               onClick={() => setIsModalOpen(true)}
               leadingIcon={<PlusCircle className="h-4 w-4" />}
             >
               Create Initiative
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
             {initiatives.map((initiative) => (
               <TableRow key={initiative.id}>
                 <TableCell className="font-medium">{initiative.name}</TableCell>
                 <TableCell className="text-muted-foreground">
                   {initiative.description || "No description"}
                 </TableCell>
                 <TableCell>{initiative._count?.ratings || 0}</TableCell>
                 <TableCell>
                   <div className="flex items-center gap-2">
                     <Button
                       variant="neutral"
                       appearance="text"
                       size="sm"
                       onClick={() => {
                         setSelectedInitiative(initiative);
                         setIsModalOpen(true);
                       }}
                       leadingIcon={<Edit className="h-4 w-4" />}
                     />
                     <Button
                       variant="danger"
                       appearance="text"
                       size="sm"
                       onClick={() => {
                         setSelectedInitiative(initiative);
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
           <AlertDialogCancel asChild>
             <Button variant="neutral" appearance="subtle">Cancel</Button>
           </AlertDialogCancel>
           <AlertDialogAction asChild>
             <Button variant="danger" onClick={handleDelete}>Delete Initiative</Button>
           </AlertDialogAction>
         </AlertDialogFooter>
       </AlertDialogContent>
     </AlertDialog>
   </div>
 );
}