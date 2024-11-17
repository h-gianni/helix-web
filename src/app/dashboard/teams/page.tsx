// app/dashboard/teams/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RefreshCcw, Plus } from 'lucide-react';
import type { ApiResponse, TeamResponse } from "@/lib/types/api";
import TeamCreateModal from './_teamCreateModal';
import EmptyTeamsView from './_emptyTeamsView';

export default function TeamsPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<TeamResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchTeams = async (showRefreshIndicator = true) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      }
      setError(null);
      
      const response = await fetch(`/api/teams?t=${new Date().getTime()}`);
      const data: ApiResponse<TeamResponse[]> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch teams');
      }

      setTeams(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleCreateTeam = async (name: string) => {
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
  
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create team');
      }
  
      await fetchTeams();
      setIsCreateModalOpen(false);
      
      // Navigate to the new team's page
      if (data.data?.id) {
        router.push(`/dashboard/teams/${data.data.id}`);
      }
    } catch (err) {
      throw err;
    }
  };

  // Initial load
  useEffect(() => {
    fetchTeams(false);
  }, []);

  // Refresh on window focus
  useEffect(() => {
    const handleFocus = () => {
      fetchTeams(false);
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  if (loading) {
    return <div className="p-4">Loading teams...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500 mb-2">{error}</div>
        <Button onClick={() => fetchTeams()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Teams</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchTeams()}
            disabled={isRefreshing}
          >
            <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Team
        </Button>
      </div>

      {teams.length === 0 ? (
        <EmptyTeamsView onCreateTeam={() => setIsCreateModalOpen(true)} />
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Link key={team.id} href={`/dashboard/teams/${team.id}`}>
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold">{team.name}</h3>
                <p className="text-sm text-gray-500">
                  Created: {new Date(team.createdAt).toLocaleDateString()}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <TeamCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTeam={handleCreateTeam}
      />
    </div>
  );
}