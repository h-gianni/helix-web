  // data/teams.ts
  import { Team } from '../types/team';

  export const TEAMS: Team[] = [
    {
      id: "team-1",
      name: "Engineering Team",
      functions: ["Engineering", "DevOps"],
    },
    {
      id: "team-2",
      name: "Marketing Team",
      functions: ["Marketing", "Social Media"],
    },
    { 
      id: "team-3", 
      name: "Design Team", 
      functions: ["UI/UX", "Graphic Design"] 
    },
    {
      id: "team-4",
      name: "Product Team",
      functions: ["Product Management", "Market Research"],
    },
    {
      id: "team-5",
      name: "Sales Team",
      functions: ["Sales", "Customer Success"],
    },
    {
      id: "team-6",
      name: "Research Team",
      functions: ["Research", "Analytics"],
    },
    {
      id: "team-7",
      name: "Development Team",
      functions: ["Frontend", "Backend", "Mobile"],
    },
  ];
  
  export default TEAMS;