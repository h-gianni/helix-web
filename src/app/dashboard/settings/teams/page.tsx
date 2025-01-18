// app/dashboard/settings/teams/page.tsx
"use client";

import { useState, useEffect } from "react";
import { PageBreadcrumbs } from "@/app/dashboard/_component/_appHeader";
import TeamInitiativesConfig from "./_components/_teamInitiativesConfig";
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

  useEffect(() => {
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

    fetchTeamDetails();
  }, [selectedTeamId]);

  const handleUpdate = async () => {
    if (!selectedTeamId) return;
    
    try {
      const response = await fetch(`/api/teams/${selectedTeamId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch team details');
      }
      
      setTeamDetails(data.data);
    } catch (err) {
      console.error('Error updating team details:', err);
    }
  };

  if (isTeamsLoading || isLoading) {
    return (
      <>
        <PageBreadcrumbs items={breadcrumbItems} />
        <h1 className="text-display-1">Team Settings</h1>
        <div className="text-muted">Loading team details...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageBreadcrumbs items={breadcrumbItems} />
        <h1 className="text-display-1">Team Settings</h1>
        <Alert variant="danger">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </>
    );
  }

  if (!teamDetails) {
    return (
      <>
        <PageBreadcrumbs items={breadcrumbItems} />
        <h1 className="text-display-1">Team Settings</h1>
        <Alert variant="warning">
          <AlertCircle className="size-4" />
          <AlertDescription>No team selected</AlertDescription>
        </Alert>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumbs items={breadcrumbItems} />
      <h1 className="text-display-1">Team Settings</h1>
      <TeamInitiativesConfig 
        team={teamDetails}
        onUpdate={handleUpdate}
      />
    </>
  );
}