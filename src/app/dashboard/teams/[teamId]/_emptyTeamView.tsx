// EmptyTeamView.tsx
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/core/Button";
import { Card, CardContent } from "@/components/ui/core/Card";

interface EmptyTeamViewProps {
 onAddMember: () => void;
}

export default function EmptyTeamView({ onAddMember }: EmptyTeamViewProps) {
 return (
   <Card align="center">
     <CardContent className="py-8">
       <div className="space-y-8 text-center">
         <div className="space-y-4">
           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
             <UserPlus className="h-6 w-6 text-primary-600" />
           </div>
           <div className="space-y-2">
             <h2 className="text-2xl font-semibold">Start Building Your Team</h2>
             <p className="mx-auto max-w-xl text-muted-foreground">
               Your team is ready to go! Begin by adding your first team member.
             </p>
           </div>
         </div>
         <Button
           variant="primary"
           size="lg"
           onClick={onAddMember}
           leadingIcon={<UserPlus />}
         >
           Add First Member
         </Button>
       </div>
     </CardContent>
   </Card>
 );
}