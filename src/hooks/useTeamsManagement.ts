// hooks/useTeamsManagement.ts

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useConfigStore } from '@/store/config-store';
import { useOnboardingValidation } from './useOnboardingValidation';

// Types
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

export interface TeamListItem {
  id: string;
  name: string;
  subtitle: React.ReactNode;
  icon: "users";
  functions: string[];
  categories: string[];
  members: string[];
}

export interface TeamFormInput {
  name: string;
  functions: string[];
  members: string[];
}

export interface TeamFormErrors {
  name?: string;
  functions?: string;
  members?: string;
  general?: string;
}

export function useTeamsManagement() {
  // Config store access
  const config = useConfigStore((state) => state.config);
  const selectedByCategory = config.activities.selectedByCategory || {};
  const configTeams = config.teams || [];
  const updateTeams = useConfigStore((state) => state.updateTeams);
  
  // Local state
  const [teams, setTeams] = useState<Team[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [displayCategories, setDisplayCategories] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);
  
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
  
  const [formErrors, setFormErrors] = useState<TeamFormErrors>({});
  
  // Validation
  const isValid = useCallback(() => {
    return teams.length > 0 && teams.every(team => 
      team.name.trim() !== "" && 
      team.categories.length > 0 && 
      team.members.length > 0
    );
  }, [teams]);
  
  const validation = useOnboardingValidation({
    errorMessage: "Please create at least one team with name, functions, and members",
    validationFn: isValid
  });
  
  // Initialize - load members, teams from config store, and clear any stale team data
  useEffect(() => {
    if (initialized) return;
    
    // Load members
    try {
      const savedMembers = localStorage.getItem("onboarding_members");
      if (savedMembers) {
        setMembers(JSON.parse(savedMembers));
      }
    } catch (error) {
      console.error("Error loading members:", error);
    }
    
    // Load teams from config store
    if (configTeams.length > 0) {
      // Convert config teams to the internal Team structure
      const loadedTeams = configTeams.map(team => {
        // Get team members from localStorage if possible
        let teamMembers: string[] = [];
        try {
          const teamMembersData = localStorage.getItem("onboarding_team_members");
          if (teamMembersData) {
            const parsedData = JSON.parse(teamMembersData);
            const teamData = parsedData.find((item: any) => item.teamId === team.id);
            if (teamData && teamData.memberIds) {
              teamMembers = teamData.memberIds;
            }
          }
        } catch (error) {
          console.error("Error loading team members:", error);
        }
        
        return {
          id: team.id,
          name: team.name,
          functions: team.functions || [],
          categories: team.categories || [],
          members: teamMembers,
        };
      });
      
      setTeams(loadedTeams);
    } else {
      // If no teams in config, reset teams
      updateTeams([]);
    }
    
    // Get action categories
    const categoryIds = Object.entries(selectedByCategory)
      .filter(([_, actions]) => (actions as string[]).length > 0)
      .map(([categoryId, _]) => categoryId);
    
    setDisplayCategories(categoryIds);
    
    setInitialized(true);
  }, [initialized, selectedByCategory, configTeams, updateTeams]);
  
  // Sync teams to config store
  useEffect(() => {
    if (!initialized) return;
    
    // Update config store
    const configTeams = teams.map(team => ({
      id: team.id,
      name: team.name,
      functions: team.functions,
      categories: team.categories,
    }));
    
    updateTeams(configTeams);
    
    // Save team members to localStorage
    try {
      localStorage.setItem(
        "onboarding_team_members",
        JSON.stringify(teams.map(team => ({
          teamId: team.id,
          memberIds: team.members
        })))
      );
    } catch (error) {
      console.error("Error saving team members:", error);
    }
  }, [teams, updateTeams, initialized]);
  
  // Compute assigned member IDs
  const assignedMemberIds = useMemo(() => {
    const assignedIds: string[] = [];
    
    teams.forEach(team => {
      // Skip the team being edited
      if (currentTeam.id && team.id === currentTeam.id) {
        return;
      }
      
      // Add member IDs
      team.members.forEach(memberId => {
        if (!assignedIds.includes(memberId)) {
          assignedIds.push(memberId);
        }
      });
    });
    
    return assignedIds;
  }, [teams, currentTeam.id]);
  
  // Check if all members are assigned
  const allMembersAssigned = useMemo(() => {
    return members.length > 0 && assignedMemberIds.length === members.length;
  }, [members, assignedMemberIds]);
  
  // Form methods
  const setTeamName = useCallback((name: string) => {
    setCurrentTeam(prev => ({ ...prev, name }));
    if (formErrors.name) {
      setFormErrors(prev => ({ ...prev, name: undefined }));
    }
  }, [formErrors]);
  
  const setTeamFunctions = useCallback((functions: string[]) => {
    setCurrentTeam(prev => ({ ...prev, functions }));
    if (formErrors.functions) {
      setFormErrors(prev => ({ ...prev, functions: undefined }));
    }
  }, [formErrors]);
  
  const setTeamMembers = useCallback((members: string[]) => {
    setCurrentTeam(prev => ({ ...prev, members }));
    if (formErrors.members) {
      setFormErrors(prev => ({ ...prev, members: undefined }));
    }
  }, [formErrors]);
  
  // Handle function toggle
  const handleFunctionToggle = useCallback((functionId: string, checked: boolean) => {
    if (checked) {
      setTeamFunctions([...currentTeam.functions, functionId]);
    } else {
      setTeamFunctions(currentTeam.functions.filter(id => id !== functionId));
    }
  }, [currentTeam.functions, setTeamFunctions]);
  
  // Handle member toggle
  const handleMemberToggle = useCallback((memberId: string, checked: boolean) => {
    if (checked) {
      setTeamMembers([...currentTeam.members, memberId]);
    } else {
      setTeamMembers(currentTeam.members.filter(id => id !== memberId));
    }
  }, [currentTeam.members, setTeamMembers]);
  
  // Validate team data
  const validateTeam = useCallback(() => {
    const errors: TeamFormErrors = {};
    
    if (!currentTeam.name.trim()) {
      errors.name = "Team name is required";
    }
    
    if (currentTeam.functions.length === 0) {
      errors.functions = "Please select at least one function";
    }
    
    if (currentTeam.members.length === 0) {
      errors.members = "Please select at least one team member";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [currentTeam]);
  
  // Create new team
  const createTeam = useCallback((getCategoryNameById?: (id: string) => string | undefined) => {
    if (!validateTeam()) return;
    
    // Generate ID
    const id = `team-${Date.now()}`;
    
    // Create team
    const newTeam: Team = {
      id,
      name: currentTeam.name.trim(),
      functions: currentTeam.functions.map(id => {
        return getCategoryNameById ? getCategoryNameById(id) || id : id;
      }),
      categories: currentTeam.functions,
      members: currentTeam.members,
    };
    
    // Add to teams array
    setTeams(prev => [...prev, newTeam]);
    
    // Reset form
    setCurrentTeam({
      id: null,
      name: '',
      functions: [],
      members: [],
    });
    
    setFormErrors({});
  }, [currentTeam, validateTeam]);
  
  // Update team
  const updateTeam = useCallback((getCategoryNameById?: (id: string) => string | undefined) => {
    if (!currentTeam.id || !validateTeam()) return;
    
    // Update team
    setTeams(prev => prev.map(team => {
      if (team.id === currentTeam.id) {
        return {
          ...team,
          name: currentTeam.name.trim(),
          functions: currentTeam.functions.map(id => {
            return getCategoryNameById ? getCategoryNameById(id) || id : id;
          }),
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
  }, [currentTeam, validateTeam]);
  
  // Cancel edit
  const cancelEdit = useCallback(() => {
    setCurrentTeam({
      id: null,
      name: '',
      functions: [],
      members: [],
    });
    
    setFormErrors({});
  }, []);
  
  // Select team for editing
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
  
  // Remove team
  const removeTeam = useCallback((teamId: string) => {
    setTeams(prev => prev.filter(team => team.id !== teamId));
    
    // If we're removing the team being edited, reset the form
    if (teamId === currentTeam.id) {
      cancelEdit();
    }
  }, [currentTeam.id, cancelEdit]);
  
  // Clear all teams
  const clearTeams = useCallback(() => {
    setTeams([]);
    updateTeams([]);
    // Clear team members from localStorage
    localStorage.removeItem("onboarding_team_members");
    cancelEdit();
  }, [updateTeams, cancelEdit]);
  
  return {
    teams,
    members,
    displayCategories,
    currentTeam,
    formErrors,
    assignedMemberIds,
    allMembersAssigned,
    isValid,
    setTeamName,
    handleFunctionToggle,
    handleMemberToggle,
    createTeam,
    updateTeam,
    selectTeam,
    removeTeam,
    clearTeams,
    cancelEdit,
    ...validation
  };
}