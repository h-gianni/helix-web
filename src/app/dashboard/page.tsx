"use client";

import React, { useState } from "react";
import { PageBreadcrumbs } from "@/components/ui/composite/AppHeader";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/composite/PageHeader";
import { Button } from "@/components/ui/core/Button";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { MessageSquare, Star, AlertCircle, RotateCcw } from "lucide-react";
import TeamCreateModal from "../dashboard/teams/_teamCreateModal";
import PerformanceRatingModal from "./_component/_performanceRatingModal";
import EmptyDashboardView from "./_component/_emptyDashboardView";
import { PerformersByCategory } from "./_component/_performersByCategory";
import { ViewSwitcher } from "@/components/ui/composite/ViewSwitcher";
import type { Member } from "@/store/member";
import { useTeams, useCreateTeam } from "@/store/team-store";
import { useSetupStore } from '@/store/setup-store';
import { useSetupProgress } from '@/hooks/useSetupProgress';
import { usePerformers, usePerformersStore } from "@/store/performers-store";
import { usePerformanceRatingStore } from "@/store/performance-rating-store";
import type { TeamResponse } from "@/lib/types/api";

const breadcrumbItems = [{ label: "Dashboard" }];

interface TeamsContentProps {
 performers: Member[];
 teams: TeamResponse[];
 router: ReturnType<typeof useRouter>;
}

const TeamsContent = ({ performers, teams, router }: TeamsContentProps) => {
 const { performanceCategories, viewType, setViewType } = usePerformersStore();
 const { setIsOpen: openRatingModal } = usePerformanceRatingStore();

 return (
   <>
     <PageHeader
       title="Dashboard"
       actions={
         <>
           <Button
             volume="moderate"
             iconOnly={false}
             leadingIcon={<MessageSquare />}
             onClick={() => router.push("/dashboard/feedback")}
           >
             Add Feedback
           </Button>
           <Button
             variant="primary"
             volume="loud"
             iconOnly={false}
             leadingIcon={<Star />}
             onClick={() => openRatingModal(true)}
           >
             Rate Performance
           </Button>
         </>
       }
     />

     <main className="ui-layout-page-main">
       <div className="ui-view-controls-bar">
         <ViewSwitcher viewType={viewType} onViewChange={setViewType} />
       </div>
       {performanceCategories.map((category) => (
         <PerformersByCategory
           key={category.label}
           category={category}
           performers={performers}
           teams={teams}
         />
       ))}
     </main>
   </>
 );
};

export default function DashboardPage() {
 const router = useRouter();
 const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
 const { completeStep } = useSetupStore();
 const { showMainDashboard } = useSetupProgress();

 const { 
   data: teams = [], 
   isLoading: isTeamsLoading, 
   error: teamsError,
   refetch: refetchTeams 
 } = useTeams();

 const {
   data: performers = [],
   isLoading: isPerformersLoading,
   error: isPerformersError,
   refetch: refetchPerformers
 } = usePerformers();

 const { mutateAsync: createTeam } = useCreateTeam();

 const isLoading = isTeamsLoading || isPerformersLoading;
 const error = teamsError || isPerformersError;

 const handleCreateTeam = async (name: string, teamFunctionId: string) => {
   try {
     const newTeam = await createTeam({ name, teamFunctionId });
     setIsCreateModalOpen(false);
     completeStep('createTeam');
   } catch (error) {
     console.error("Error creating team:", error);
     throw error;
   }
 };

 if (isLoading) {
   return <div className="ui-loader">Loading dashboard...</div>;
 }

 if (error) {
   return (
     <div className="ui-loader-error">
       <Alert variant="danger">
         <AlertCircle />
         <AlertDescription>
           {error instanceof Error ? error.message : "An error occurred"}
         </AlertDescription>
       </Alert>
       <Button
         variant="neutral"
         onClick={() => {
           refetchTeams();
           refetchPerformers();
         }}
         leadingIcon={<RotateCcw />}
       >
         Retry
       </Button>
     </div>
   );
 }

 return showMainDashboard ? (
   <>
     <PageBreadcrumbs items={breadcrumbItems} />
     <TeamsContent performers={performers} teams={teams} router={router} />
     <PerformanceRatingModal />
   </>
 ) : (
   <>
     <PageBreadcrumbs items={breadcrumbItems} />
     <EmptyDashboardView onCreateTeam={() => setIsCreateModalOpen(true)} />
     <TeamCreateModal
       isOpen={isCreateModalOpen}
       onClose={() => setIsCreateModalOpen(false)}
       onCreateTeam={handleCreateTeam}
     />
     <PerformanceRatingModal />
   </>
 );
}