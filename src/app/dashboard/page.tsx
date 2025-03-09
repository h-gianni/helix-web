"use client";

import React, { useState } from "react";
import { PageBreadcrumbs } from "@/components/ui/composite/App-header";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/composite/Page-header";
import { Button } from "@/components/ui/core/Button";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { MessageSquare, Star, AlertCircle, RotateCcw } from "lucide-react";
import TeamCreateModal from "./_components/_teams/_team-create-modal";
import PerformanceRatingModal from "./_components/_performance-scoring-modal";
import EmptyDashboardView from "./_components/_empty-dashboard-view";
import { PerformersByCategory } from "./_components/_performers-by-category";
import { ViewSwitcher } from "@/components/ui/composite/View-switcher";
import { Loader } from "@/components/ui/core/Loader";
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
             data-slot="button"
             variant="secondary"
             onClick={() => router.push("/dashboard/feedback")}
           >
             <MessageSquare className="size-4" /> Add Feedback
           </Button>
           <Button
             data-slot="button"
             variant="default"
             onClick={() => openRatingModal(true)}
           >
             <Star className="size-4" /> Rate Performance
           </Button>
         </>
       }
     />

     <main className="layout-page-main">
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
   return <div className="loader"><Loader size="base" label="Loading..." /></div>;
 }

 if (error) {
   return (
     <div className="ui-loader-error">
       <Alert data-slot="alert" variant="destructive">
         <AlertCircle className="size-4" />
         <AlertDescription data-slot="alert-description">
           {error instanceof Error ? error.message : "An error occurred"}
         </AlertDescription>
       </Alert>
       <Button
         data-slot="button"
         variant="secondary"
         onClick={() => {
           refetchTeams();
           refetchPerformers();
         }}
       >
         <RotateCcw className="size-4" /> Retry
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