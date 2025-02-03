'use client';

import { useState, useEffect } from "react";
import { 
 Card,
 CardHeader,
 CardTitle,
 CardContent
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, RotateCcw, AlertCircle } from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import type { RatingResponse } from "@/lib/types/api";

interface RatingsSectionProps {
 teamId: string;
 memberId: string;
 onAddRating: () => void;
}

export default function RatingsSection({
 teamId,
 memberId,
 onAddRating,
}: RatingsSectionProps) {
 const [ratings, setRatings] = useState<RatingResponse[]>([]);
 const [stats, setStats] = useState({ average: 0, count: 0 });
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [isRefreshing, setIsRefreshing] = useState(false);

 const fetchRatings = async (showRefreshIndicator = true) => {
   try {
    if (showRefreshIndicator) {
      setIsRefreshing(true);
    }
     setError(null);

     const response = await fetch(
       `/api/teams/${teamId}/members/${memberId}/ratings?t=${Date.now()}`
     );
     const data = await response.json();

     if (!data.success) {
       throw new Error(data.error || "Failed to fetch ratings");
     }

     setRatings(data.data.ratings);
     setStats(data.data.stats);
   } catch (err) {
     setError(err instanceof Error ? err.message : "An error occurred");
   } finally {
     setLoading(false);
     setIsRefreshing(false);
   }
 };

 useEffect(() => {
  fetchRatings(false);
}, [teamId, memberId]); 

 if (loading) {
   return <div className="text-muted-foreground">Loading ratings...</div>;
 }

 return (
   <Card>
     <CardHeader>
       <div className="flex items-center justify-between">
         <div>
           <CardTitle>Performance Ratings</CardTitle>
           <div className="mt-1 flex items-center gap-2">
             <StarRating 
               value={stats.average}
               disabled={true}
               size="sm"
               ratingsCount={stats.count}
             />
           </div>
         </div>
         <div className="flex gap-2">
           <Button
             variant="neutral"
             appearance="icon-only"
             size="sm"
             onClick={() => fetchRatings()}
             disabled={isRefreshing}
             isLoading={isRefreshing}
             leadingIcon={<RotateCcw className="h-4 w-4" />}
           />
           <Button
             variant="primary"
             onClick={onAddRating}
             leadingIcon={<Plus className="h-4 w-4" />}
           >
             Add Rating
           </Button>
         </div>
       </div>
     </CardHeader>

     <CardContent>
       {error ? (
         <div className="space-y-4">
           <Alert variant="danger">
             <AlertCircle className="h-4 w-4" />
             <AlertDescription>{error}</AlertDescription>
           </Alert>
           <Button
             variant="primary"
             onClick={() => fetchRatings()}
             leadingIcon={<RotateCcw className="h-4 w-4" />}
           >
             Retry
           </Button>
         </div>
       ) : ratings.length === 0 ? (
         <div className="py-8 text-center text-muted-foreground">
           No ratings yet. Click &ldquo;Add Rating&ldquo; to provide the first rating.
         </div>
       ) : (
         <div className="space-y-4">
           {ratings.map((rating) => (
             <Card key={rating.id} size="sm" shadow="sm">
               <CardContent className="p-4">
                 <div className="flex items-start justify-between">
                   <div className="space-y-2">
                     {rating.activity && (
                       <h3 className="font-medium">{rating.activity.name}</h3>
                     )}
                     <div className="flex items-center gap-2">
                       <StarRating
                         value={rating.value}
                         disabled={true}
                         size="sm"
                         showValue={true}
                         showRatingsCount={false}
                       />
                       <span className="text-sm text-muted-foreground">
                         {new Date(rating.createdAt).toLocaleDateString()}
                       </span>
                     </div>
                     {rating.activity?.description && (
                       <p className="text-sm text-muted-foreground">
                         {rating.activity.description}
                       </p>
                     )}
                   </div>
                 </div>
               </CardContent>
             </Card>
           ))}
         </div>
       )}
     </CardContent>
   </Card>
 );
}