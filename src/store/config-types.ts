// data/config-types.ts

export interface Team {
    id: string;
    name: string;
    functions: string[];
    categories: string[]; // Added categories array to store category IDs
  }
  
  export interface Configuration {
    organization: {
      name: string;
    };
    activities: {
      selected: string[];
      selectedByCategory: Record<string, string[]>;
      favorites: Record<string, string[]>;
      hidden: Record<string, string[]>;
    };
    teams: Array<{
      id: string;
      name: string;
      functions: string[];
      categories: string[]; 
    }>;
  }
  
  export interface ConfigStore {
    config: Configuration;
    setConfig: (config: Configuration) => void;
    updateOrganization: (name: string) => void;
    updateActivities: (activities: string[]) => void;
    updateActivitiesByCategory: (categoryId: string, activities: string[]) => void;
    updateFavorites: (category: string, activities: string[]) => void;
    updateHidden: (category: string, activities: string[]) => void;
    updateTeams: (teams: Configuration['teams']) => void;
  }