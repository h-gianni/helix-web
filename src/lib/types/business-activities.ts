export interface Activity {
  id: string;
  name: string;
  description: string;
  teamId: string;
  // ... other activity properties
}

export interface TeamActivity {
  id: string;
  teamId: string;
  activityId: string;
  activity: Activity;
  teamId_Team_id: string;
  activityId_Activity_id: string;
  // ... other team activity properties
}
