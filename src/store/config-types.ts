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
    };
    teams: Team[];
  }
  
  export interface ConfigStore {
    config: Configuration;
    setConfig: (config: Configuration) => void;
    updateOrganization: (name: string) => void;
    updateActivities: (activities: string[]) => void;
    updateTeams: (teams: Team[]) => void;
  }