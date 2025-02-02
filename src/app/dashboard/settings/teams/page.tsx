"use client";

import { useState, useEffect } from "react";
import { PageBreadcrumbs } from "@/app/dashboard/_component/_appHeader";
import TeamActivitiesConfig from "./_components/_teamActivitiesConfig";
import { useTeams } from '@/lib/context/teams-context';
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { AlertCircle } from "lucide-react";
import type { TeamDetailsResponse } from "@/lib/types/api";

export default function TeamsSettingsPage() {
 const { teams, isLoading: isTeamsLoading } = useTeams();
 const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
 const [teamDetails, setTeamDetails] = useState<TeamDetailsResponse | null>(null);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 const breadcrumbItems = [
   { label: "Settings", href: "/dashboard/settings" },
   { label: "Teams" },
 ];

 useEffect(() => {
   if (teams.length > 0 && !selectedTeamId) {
     setSelectedTeamId(teams[0].id);
   }
 }, [teams]);

 const fetchTeamDetails = async () => {
   if (!selectedTeamId) return;
   
   try {
     setIsLoading(true);
     setError(null);
     
     const response = await fetch(`/api/teams/${selectedTeamId}`);
     const data = await response.json();
     
     if (!data.success) {
       throw new Error(data.error || 'Failed to fetch team details');
     }
     
     setTeamDetails(data.data);
   } catch (err) {
     console.error('Error fetching team details:', err);
     setError(err instanceof Error ? err.message : 'An error occurred');
   } finally {
     setIsLoading(false);
   }
 };

 useEffect(() => {
   fetchTeamDetails();
 }, [selectedTeamId]);

 if (isTeamsLoading || isLoading) {
   return (
     <div className="space-y-4">
       <PageBreadcrumbs items={breadcrumbItems} />
       <h1 className="text-3xl font-semibold">Team Settings</h1>
       <div className="text-muted-foreground">Loading team details...</div>
     </div>
   );
 }

 if (error || !teamDetails) {
   return (
     <div className="space-y-4">
       <PageBreadcrumbs items={breadcrumbItems} />
       <h1 className="text-3xl font-semibold">Team Settings</h1>
       <Alert variant={error ? "danger" : "warning"}>
         <AlertCircle className="h-4 w-4" />
         <AlertDescription>
           {error || "No team selected"}
         </AlertDescription>
       </Alert>
     </div>
   );
 }

 return (
  <div className="space-y-6">
    <PageBreadcrumbs items={breadcrumbItems} />
    <h1 className="text-3xl font-semibold">Team Settings</h1>
    <TeamActivitiesConfig onUpdate={fetchTeamDetails} />
  </div>
);
}