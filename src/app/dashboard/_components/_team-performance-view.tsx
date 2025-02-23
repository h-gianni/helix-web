"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { MemberCard } from "@/components/ui/composite/Member-card";
import { MembersTable } from "@/components/ui/composite/Members-table";
import { Card, CardContent } from "@/components/ui/core/Card";
import { usePerformersStore, useGenerateReview } from "@/store/performers-store";

interface Team {
 id: string;
 name: string;
}

interface MemberPerformance {
  id: string;
  name: string;
  title: string | null;
  averageRating: number;
  ratingsCount: number;
  teamId: string;
  teamName: string;
}

interface TeamPerformanceViewProps {
 members: MemberPerformance[];
 teams?: Team[];
 teamId?: string;
 showAvatar?: boolean;
 showActions?: boolean;
 onMemberDelete?: (member: MemberPerformance) => void;
 mode?: "compact" | "full";
 viewType?: "table" | "grid";
 onViewChange?: (value: "table" | "grid") => void;
}

export function TeamPerformanceView({
 members,
 teams = [],
 teamId,
 showAvatar = true,
 showActions = true,
 onMemberDelete,
 mode = "full",
 viewType = "grid",
 onViewChange,
}: TeamPerformanceViewProps) {
 const router = useRouter();
 const { getSortedMembers, getPerformanceCategory, performanceCategories } = usePerformersStore();
 const { mutate: generateReview } = useGenerateReview();
 
 const sortedMembers = getSortedMembers(members);

 const handleGenerateReview = (member: MemberPerformance) => {
   generateReview(member.id);
 };

 const handleNavigate = (path: string) => {
   router.push(path);
 };

 if (members.length === 0) {
   return (
     <Card>
       <CardContent className="flex items-center justify-center py-8">
         <p className="text-foreground-muted">No team members found.</p>
       </CardContent>
     </Card>
   );
 }

 return (
   <div className="space-y-4">
     {viewType === "table" ? (
       <MembersTable
         members={sortedMembers}
         teams={teams}
         teamId={teamId}
         showAvatar={showAvatar}
         showActions={showActions}
         onDelete={onMemberDelete}
         onGenerateReview={handleGenerateReview}
         onNavigate={handleNavigate}
         performanceCategories={performanceCategories}
         getPerformanceCategory={getPerformanceCategory}
       />
     ) : (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {sortedMembers.map((member) => {
           const category = getPerformanceCategory(
             member.averageRating,
             member.ratingsCount
           );
           return (
             <MemberCard
               key={member.id}
               member={member}
               teamId={teamId}
               teams={teams}
               category={category}
               onDelete={onMemberDelete}
               onGenerateReview={handleGenerateReview}
               variant={mode === "compact" ? "compact" : "default"}
               onNavigate={handleNavigate}
             />
           );
         })}
       </div>
     )}
   </div>
 );
}