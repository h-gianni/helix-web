export interface Initiative {
  id: string;
  name: string;
  description: string;
  teamId: string;
  // ... other initiative properties
}

export interface TeamInitiative {
  id: string;
  teamId: string;
  initiativeId: string;
  initiative: Initiative;
  teamId_Team_id: string;
  initiativeId_Initiative_id: string;
  // ... other team initiative properties
}
