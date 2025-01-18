# Teams Navigation System Documentation

## Overview

The teams navigation system in UpScore uses a centralized state management approach with React Context to ensure consistent and real-time updates across the application. This document explains how the teams navigation works and how it interacts with different components.

## Architecture

### Teams Context

The teams context (`teams-context.tsx`) serves as the central state management system for teams data:

```typescript
// Location: src/lib/context/teams-context.tsx
export interface TeamsContextType {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  fetchTeams: () => Promise<void>;
  isLoading: boolean;
}
```

### Navigation Behavior

The sidebar navigation dynamically updates based on the existence of teams:

- **No Teams Exist**: Shows a single "Teams" link
- **Teams Exist**: Shows a collapsible menu with:
  - "View all teams" link
  - Individual team links

## Key Components

### 1. AppSidebar Component

```typescript
// Location: src/components/_appSidebar.tsx
const mainNavItems = [
  {
    icon: Users,
    label: "Teams",
    dynamicSubItems: true, // Flags this item for dynamic team population
  },
  // ... other nav items
];
```

The sidebar automatically updates when:
- A team is created
- A team is deleted
- A team name is updated

### 2. Teams Provider

```typescript
// Location: app/layout.tsx
<TeamsProvider>
  <AppSidebar />
  {children}
</TeamsProvider>
```

## State Management Flow

1. **Initial Load**
   - TeamsProvider fetches teams on mount
   - Navigation renders based on teams existence

2. **Team Creation**
   ```typescript
   await fetchTeams(); // Updates global teams state
   router.push(`/dashboard/teams/${teamId}`);
   ```

3. **Team Deletion**
   ```typescript
   await fetchTeams(); // Updates global teams state
   router.push('/dashboard/teams');
   ```

4. **Team Update**
   ```typescript
   await fetchTeams(); // Updates teams list with new name
   ```

## Implementation Guidelines

### For Developers

1. **Using Teams Context**
   ```typescript
   const { teams, isLoading, fetchTeams } = useTeams();
   ```

2. **After Team Mutations**
   - Always call `fetchTeams()` before navigation
   - Wait for the promise to resolve
   ```typescript
   await fetchTeams();
   await router.push(path);
   ```

3. **Handling Loading States**
   ```typescript
   if (loading || teamsLoading) {
     return <LoadingComponent />;
   }
   ```

### For Designers

1. **Navigation States**
   - Empty State: Single "Teams" link
   - Populated State: Collapsible menu with team list
   - Loading State: Loading indicator

2. **Interaction Patterns**
   - Clicking team link navigates directly to team
   - "View all teams" shows teams overview
   - Invalid team IDs redirect to teams page

## Common Pitfalls

1. **Navigation Timing**
   - ❌ `router.push()` before `fetchTeams()`
   - ✅ `await fetchTeams()` then `router.push()`

2. **State Updates**
   - ❌ Manual team state updates
   - ✅ Always use `fetchTeams()` for consistency

3. **Loading States**
   - ❌ Ignoring `teamsLoading`
   - ✅ Check both local and global loading states

## Best Practices

1. Always await `fetchTeams()` before navigation
2. Handle both loading states (`loading` and `teamsLoading`)
3. Implement proper error boundaries
4. Verify team existence before rendering team-specific content
5. Use the provided loading and error states UI components

## Example Usage

```typescript
// Creating a team
const handleCreateTeam = async (name: string) => {
  try {
    const response = await createTeam(name);
    await fetchTeams(); // Update global state
    await router.push(`/dashboard/teams/${response.id}`);
  } catch (error) {
    handleError(error);
  }
};

// Deleting a team
const handleDeleteTeam = async (teamId: string) => {
  try {
    await deleteTeam(teamId);
    await fetchTeams(); // Update global state
    await router.push('/dashboard/teams');
  } catch (error) {
    handleError(error);
  }
};
```