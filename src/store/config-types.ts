// data/config-types.ts

export interface Team {
    id: string;
    name: string;
    functions: string[];
  }
  
  export interface Configuration {
    organization: {
      name: string;
    };
    activities: {
      selected: string[];
      favorites: Record<string, string[]>;
      hidden: Record<string, string[]>;
    };
    teams: Array<{
      id: string;
      name: string;
      functions: string[];
    }>;
  }
  
  export interface ConfigStore {
    config: Configuration;
    setConfig: (config: Configuration) => void;
    updateOrganization: (name: string) => void;
    updateActivities: (activities: string[]) => void;
    updateFavorites: (category: string, activities: string[]) => void;
    updateHidden: (category: string, activities: string[]) => void;
    updateTeams: (teams: Configuration['teams']) => void;
  }