// src/store/note-store.ts
import { create } from 'zustand';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import type { TeamResponse, TeamMemberResponse } from '@/lib/types/api';

interface NoteState {
  isOpen: boolean;
  selectedTeamId: string;
  selectedMemberId: string;
  note: string;
}

interface NoteActions {
  reset: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setSelectedTeamId: (id: string) => void;
  setSelectedMemberId: (id: string) => void;
  setNote: (note: string) => void;
}

const initialState: NoteState = {
  isOpen: false,
  selectedTeamId: '',
  selectedMemberId: '',
  note: '',
};

export const noteApi = {
  getTeams: async () => {
    const { data } = await apiClient.get<{ success: boolean; data: TeamResponse[] }>('/teams');
    if (!data.success) throw new Error('Failed to fetch teams');
    return data.data;
  },

  getMembers: async (teamId: string) => {
    if (!teamId) return [];
    const { data } = await apiClient.get<{ success: boolean; data: TeamMemberResponse[] }>(
      `/teams/${teamId}/members`
    );
    if (!data.success) throw new Error('Failed to fetch team members');
    return data.data;
  },

  submitNote: async (noteData: {
    teamId: string;
    memberId: string;
    note: string;
  }) => {
    // Format the payload according to the backend API expectations
    const payload = {
      note: noteData.note.trim()
    };

    const { data } = await apiClient.post(
      `/teams/${noteData.teamId}/members/${noteData.memberId}/note`,
      payload
    );

    if (!data.success) {
      throw new Error(data.error || 'Failed to submit note');
    }

    return data.data;
  },
};

export const useNoteStore = create<NoteState & NoteActions>((set) => ({
  ...initialState,
  reset: () => set(initialState),
  setIsOpen: (isOpen) => set({ isOpen }),
  setSelectedTeamId: (id) => set({ selectedTeamId: id }),
  setSelectedMemberId: (id) => set({ selectedMemberId: id }),
  setNote: (note) => set({ note }),
}));

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: noteApi.getTeams,
  });
}

export function useTeamMembers(teamId: string) {
  return useQuery({
    queryKey: ['team-members', teamId],
    queryFn: () => noteApi.getMembers(teamId),
    enabled: !!teamId,
  });
}

export function useSubmitNote() {
  return useMutation({
    mutationFn: noteApi.submitNote,
    onError: (error) => {
      console.error('Note submission error:', error);
    }
  });
}