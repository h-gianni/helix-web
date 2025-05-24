// data/config-types.ts

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
  categories: string[]; // Added categories array to store category IDs
  memberIds: TeamMember[]; // Changed to store full TeamMember objects instead of just IDs
}

export interface Configuration {
  organization: {
    name: string;
    siteDomain: string;
    id?: string;
  };
  activities: {
    selected: string[];
    selectedByCategory: Record<string, string[]>;
    favorites: Record<string, string[]>;
    hidden: Record<string, string[]>;
  };
  globalFunctions?: { id: string; name: string; description: string; isEnabled: boolean }[];
  teamActions?: { id: string; name: string; description: string; categoryId?: string; isEnabled: boolean }[];
  teams: Array<{
    id: string;
    name: string;
    functions: string[];
    categories: string[];
    memberIds: TeamMember[]; // Changed to store full TeamMember objects instead of just IDs
  }>;
  teamMembers: TeamMember[];
  selectedActionCategory: string[]; // Add this new field
}

export interface ConfigStore {
  config: Configuration;
  setConfig: (config: Configuration) => void;
  
  updateOrganization: (organization: { name: string; siteDomain: string; id?: string }) => void;
  updateGlobalFunctions: (functions: { id: string; name: string; description: string; isEnabled: boolean }[]) => void;
  updateTeamActions: (functions: { id: string; name: string; description: string; categoryId?: string; isEnabled: boolean }[]) => void;
  updateActivities: (activities: string[]) => void;
  updateActivitiesByCategory: (
    categoryId: string,
    activities: string[]
  ) => void;
  updateFavorites: (category: string, activities: string[]) => void;
  updateHidden: (category: string, activities: string[]) => void;
  updateTeams: (teams: Configuration["teams"]) => void;
  updateTeamMembers: (teamMembers: Configuration["teamMembers"]) => void;
}
