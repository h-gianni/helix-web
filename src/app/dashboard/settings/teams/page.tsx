"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageBreadcrumbs } from "@/components/ui/composite/AppHeader";
import TeamActivitiesConfig from "./_components/_teamActivitiesConfig";
import { useTeams } from "@/lib/context/teams-context";
import { PageHeader } from "@/components/ui/composite/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { AlertCircle } from "lucide-react";
import type { TeamDetailsResponse } from "@/lib/types/api";

export default function TeamsSettingsPage() {
 const { teams, isLoading: isTeamsLoading } = useTeams();
 const router = useRouter();
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
       throw new Error(data.error || "Failed to fetch team settings");
     }

     setTeamDetails(data.data);
   } catch (err) {
     console.error("Error fetching team details:", err);
     setError(err instanceof Error ? err.message : "An error occurred");
   } finally {
     setIsLoading(false);
   }
 };

 useEffect(() => {
   fetchTeamDetails();
 }, [selectedTeamId]);

 if (isTeamsLoading || isLoading) {
   return <div className="ui-loader">Loading team settings...</div>;
 }

 if (error || !teamDetails) {
   return (
     <div className="ui-loader-error">
       <Alert variant="danger">
         <AlertCircle />
         <AlertDescription>{error || "No team selected"}</AlertDescription>
       </Alert>
     </div>
   );
 }

 return (
   <>
     <PageBreadcrumbs items={breadcrumbItems} />
     <PageHeader
       title="Teams Settings"
       backButton={{
         onClick: () => router.push("/dashboard/settings/"),
       }}
     />
     <main className="ui-layout-page-main">
       <TeamActivitiesConfig onUpdate={fetchTeamDetails} />
     </main>
   </>
 );
}