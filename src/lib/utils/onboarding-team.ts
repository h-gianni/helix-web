// Helper functions for teams management

import { ActionCategory } from "@/lib/types/api/action";

/**
 * Get category name by ID
 */
export function getCategoryNameById(
  categoryId: string, 
  actionCategories: ActionCategory[] | undefined
): string | undefined {
  if (!actionCategories) return undefined;
  
  const category = actionCategories.find((cat) => cat.id === categoryId);
  return category ? category.name : undefined;
}

/**
 * Get action count for a category
 */
export function getActionCountForCategory(
  categoryId: string,
  selectedByCategory: Record<string, string[]>
): number {
  return selectedByCategory[categoryId]?.length || 0;
}

/**
 * Save team member assignments to localStorage
 */
export function saveTeamMembersToLocalStorage(
  teams: { id: string; members: string[] }[]
): void {
  try {
    localStorage.setItem('onboarding_team_members', JSON.stringify(
      teams.map(team => ({
        teamId: team.id,
        memberIds: team.members
      }))
    ));
  } catch (error) {
    console.error("Error saving team members:", error);
  }
}

/**
 * Load team member assignments from localStorage
 */
export function loadTeamMembersFromLocalStorage(): Record<string, string[]> {
  try {
    const savedTeamMembers = localStorage.getItem('onboarding_team_members');
    if (savedTeamMembers) {
      const teamMembersData = JSON.parse(savedTeamMembers);
      
      // Convert to a lookup object for easier access
      return teamMembersData.reduce((acc: Record<string, string[]>, item: any) => {
        acc[item.teamId] = item.memberIds || [];
        return acc;
      }, {});
    }
  } catch (error) {
    console.error("Error loading team members:", error);
  }
  
  return {};
}