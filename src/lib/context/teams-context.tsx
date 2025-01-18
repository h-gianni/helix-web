"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { TeamResponse } from '@/lib/types/api';

interface TeamsContextType {
  teams: TeamResponse[];
  setTeams: React.Dispatch<React.SetStateAction<TeamResponse[]>>;
  fetchTeams: () => Promise<void>;
  isLoading: boolean;
}

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

export function TeamsProvider({ children }: { children: React.ReactNode }) {
  const [teams, setTeams] = useState<TeamResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeams = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/teams');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch teams');
      }

      // Now teams will include discipline data from the API
      setTeams(data.data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setTeams([]); // Reset teams on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <TeamsContext.Provider value={{ teams, setTeams, fetchTeams, isLoading }}>
      {children}
    </TeamsContext.Provider>
  );
}

export function useTeams() {
  const context = useContext(TeamsContext);
  if (context === undefined) {
    throw new Error('useTeams must be used within a TeamsProvider');
  }
  return context;
}