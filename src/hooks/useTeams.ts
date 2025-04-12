// hooks/useTeams.ts used in onboarding

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useConfigStore } from '@/store/config-store';
import { useActions } from '@/store/action-store';
import { ActionCategory } from '@/lib/types/api/action';

export interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  jobTitle: string;
}

export interface Team {
  id: string;
  name: string;
  functions: string[];
  categories: string[];
  members: string[];
}

export interface TeamErrors {
  teamName?: string;
  functions?: string;
  members?: string;
  general?: string;
}

export function useTeams() {
  // Get config data
  const config = useConfigStore(state => state.config);
  const selectedByCategory = config.activities.selectedByCategory || {};
  const updateTeams = useConfigStore(state => state.updateTeams);
  const configTeams = config.teams;

  // Get action categories
  const { data: actionCategories, isLoading: isLoadingCategories } = useActions();

  // State for teams management
  const [teams, setTeams] = useState<Team[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Form state
  const [currentTeam, setCurrentTeam] = useState<{
    id: string | null;
    name: string;
    functions: string[];
    members: string[];
  }>({
    id: null,
    name: '',
    functions: [],
    members: [],
  });
  
  const [formErrors, setFormErrors] = useState<TeamErrors>({});

  // Load members
  const [members, setMembers] = useState<TeamMember[]>([]);
  
  useEffect(() => {
    try {
      const savedMembers = localStorage.getItem('onboarding_members');
      if (savedMembers) {
        setMembers(JSON.parse(savedMembers));
      }
    } catch (error) {
      console.error('Error loading members:', error);
    }
  }, []);

  // Get all selected category IDs (for functions)
  const displayCategories = useMemo(() => {
    return Object.entries(selectedByCategory)
      .filter(([_, actions]) => (actions as any[]).length > 0)
      .map(([categoryId, _]) => categoryId)
      .filter(categoryId => {
        const category = actionCategories?.find(cat => cat.id === categoryId);
        return category && !['Cultural Behaviours & Values', 'Customer Centricity', 'Teamwork'].includes(category.name);
      });
  }, [selectedByCategory, actionCategories]);

  // Initialize teams data
  useEffect(() => {
    if (isInitialized || isLoadingCategories) return;

    let initialTeams: Team[] = [];

    // Filter out any temporary teams used for member collection
    const existingTeams = configTeams.filter(
      team => team.id !== 'onboarding-members-temp'
    );

    if (existingTeams.length > 0) {
      // Create basic team objects from config
      const basicTeams = existingTeams.map(team => ({
        id: team.id,
        name: team.name,
        functions: team.functions || [],
        categories: team.categories || [],
        members: [] as string[],
      }));

      // Try to load team member assignments from localStorage
      try {
        const teamMembersData = localStorage.getItem('onboarding_team_members');
        if (teamMembersData) {
          const teamMembersMap = JSON.parse(teamMembersData).reduce(
            (acc: Record<string, string[]>, item: any) => {
              acc[item.teamId] = item.memberIds || [];
              return acc;
            },
            {}
          );

          // Merge team members with basic teams
          initialTeams = basicTeams.map(team => ({
            ...team,
            members: teamMembersMap[team.id] || [],
          }));
        } else {
          initialTeams = basicTeams;
        }
      } catch (error) {
        console.error('Error loading team members:', error);
        initialTeams = basicTeams;
      }
    }

    if (initialTeams.length > 0) {
      setTeams(initialTeams);
    }

    setIsInitialized(true);
  }, [configTeams, isLoadingCategories, isInitialized]);

  // Sync with config store
  useEffect(() => {
    if (teams.length > 0 && isInitialized) {
      // Create teams data compatible with the config store structure
      const configCompatibleTeams = teams.map(team => ({
        id: team.id,
        name: team.name,
        functions: team.functions,
        categories: team.categories,
      }));

      updateTeams(configCompatibleTeams);

      // Store members assignments separately in localStorage
      try {
        localStorage.setItem(
          'onboarding_team_members',
          JSON.stringify(teams.map(team => ({
            teamId: team.id,
            memberIds: team.members
          })))
        );
      } catch (error) {
        console.error('Error saving team members:', error);
      }
    }
  }, [teams, updateTeams, isInitialized]);

  // Calculate already assigned member IDs
  const assignedMemberIds = useMemo(() => {
    const assignedIds: string[] = [];

    teams.forEach(team => {
      // Skip the team that's currently being edited
      if (currentTeam.id && team.id === currentTeam.id) {
        return;
      }

      // Add all member IDs from this team to the assignedIds array
      team.members.forEach(memberId => {
        if (!assignedIds.includes(memberId)) {
          assignedIds.push(memberId);
        }
      });
    });

    return assignedIds;
  }, [teams, currentTeam.id]);

  // Helper functions
  const getCategoryNameById = useCallback((categoryId: string): string | undefined => {
    if (!actionCategories) return undefined;
    const category = actionCategories.find(cat => cat.id === categoryId);
    return category?.name;
  }, [actionCategories]);

  const getActionCountForCategory = useCallback((categoryId: string): number => {
    return selectedByCategory[categoryId]?.length || 0;
  }, [selectedByCategory]);

  // Form functions
  const setTeamName = useCallback((name: string) => {
    setCurrentTeam(prev => ({ ...prev, name }));
    if (formErrors.teamName) {
      setFormErrors(prev => ({ ...prev, teamName: undefined }));
    }
  }, [formErrors.teamName]);

  const setTeamFunctions = useCallback((functions: string[]) => {
    setCurrentTeam(prev => ({ ...prev, functions }));
    if (formErrors.functions) {
      setFormErrors(prev => ({ ...prev, functions: undefined }));
    }
  }, [formErrors.functions]);
  
  const setTeamMembers = useCallback((members: string[]) => {
    setCurrentTeam(prev => ({ ...prev, members }));
    if (formErrors.members) {
      setFormErrors(prev => ({ ...prev, members: undefined }));
    }
  }, [formErrors.members]);

  const handleFunctionToggle = useCallback((categoryId: string, checked: boolean) => {
    if (checked) {
      setTeamFunctions([...currentTeam.functions, categoryId]);
    } else {
      setTeamFunctions(currentTeam.functions.filter(id => id !== categoryId));
    }
  }, [currentTeam.functions, setTeamFunctions]);

  const handleMemberToggle = useCallback((memberId: string, checked: boolean) => {
    if (checked) {
      setTeamMembers([...currentTeam.members, memberId]);
    } else {
      setTeamMembers(currentTeam.members.filter(id => id !== memberId));
    }
  }, [currentTeam.members, setTeamMembers]);

  // Validate team
  const validateTeam = useCallback(() => {
    const errors: TeamErrors = {};
    
    if (!currentTeam.name.trim()) {
      errors.teamName = 'Team name is required';
    }
    
    if (currentTeam.functions.length === 0) {
      errors.functions = 'Please select at least one function';
    }
    
    if (currentTeam.members.length === 0) {
      errors.members = 'Please select at least one team member';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [currentTeam]);

  // Team operations
  const createTeam = useCallback(() => {
    if (!validateTeam()) return;
    
    // Create new team
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: currentTeam.name.trim(),
      functions: currentTeam.functions.map(id => getCategoryNameById(id) || ''),
      categories: currentTeam.functions,
      members: currentTeam.members,
    };
    
    // Add to teams array
    setTeams([...teams, newTeam]);
    
    // Reset form
    setCurrentTeam({
      id: null,
      name: '',
      functions: [],
      members: [],
    });
    setFormErrors({});
  }, [validateTeam, currentTeam, teams, getCategoryNameById]);

  const updateTeam = useCallback(() => {
    if (!currentTeam.id || !validateTeam()) return;
    
    // Update team
    setTeams(teams.map(team => {
      if (team.id === currentTeam.id) {
        return {
          ...team,
          name: currentTeam.name.trim(),
          functions: currentTeam.functions.map(id => getCategoryNameById(id) || ''),
          categories: currentTeam.functions,
          members: currentTeam.members,
        };
      }
      return team;
    }));
    
    // Reset form
    setCurrentTeam({
      id: null,
      name: '',
      functions: [],
      members: [],
    });
    setFormErrors({});
  }, [currentTeam, teams, validateTeam, getCategoryNameById]);

  const selectTeam = useCallback((teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      setCurrentTeam({
        id: team.id,
        name: team.name,
        functions: team.categories,
        members: team.members,
      });
      setFormErrors({});
    }
  }, [teams]);

  const removeTeam = useCallback((teamId: string) => {
    setTeams(teams.filter(team => team.id !== teamId));
    
    // If we're removing the team being edited, reset the form
    if (teamId === currentTeam.id) {
      setCurrentTeam({
        id: null,
        name: '',
        functions: [],
        members: [],
      });
      setFormErrors({});
    }
  }, [teams, currentTeam.id]);

  const cancelEdit = useCallback(() => {
    setCurrentTeam({
      id: null,
      name: '',
      functions: [],
      members: [],
    });
    setFormErrors({});
  }, []);

  return {
    teams,
    members,
    currentTeam,
    formErrors,
    displayCategories,
    assignedMemberIds,
    isLoading: isLoadingCategories,
    allMembersAssigned: assignedMemberIds.length === members.length && members.length > 0,
    setTeamName,
    handleFunctionToggle,
    handleMemberToggle,
    createTeam,
    updateTeam,
    selectTeam,
    removeTeam,
    cancelEdit,
    getCategoryNameById,
    getActionCountForCategory,
  };
}