# Score Performance Feature - Implementation Documentation

## Overview
The Score Performance feature allows users to evaluate team members by selecting a team, choosing a team member, selecting an action/activity, and assigning a star rating with optional feedback. This document explains how the feature is implemented across multiple components and services.

## Core Components

### 1. State Management
**File: `performance-rating-store.ts`**
- Uses Zustand for state management
- Manages modal visibility, selection state, rating value, and feedback text
- Provides API interactions through React Query
- Key API endpoints:
  - `getTeams()`: Fetches available teams
  - `getMembers(teamId)`: Fetches team members for a selected team
  - `getActivities(teamId)`: Fetches activities for a selected team
  - `submitRating()`: Submits the performance rating

### 2. Modal Container
**File: `ScoringModal.tsx`**
- Main container that orchestrates the entire flow
- Manages step navigation between different stages
- Handles dynamic step count based on initial props
- Supports conditional rendering based on current step
- Provides navigation controls and header titles
- Manages submission process

### 3. Step Components

#### Team Selection
**File: `ScoringStepTeam.tsx`**
- Displays a list of available teams
- Shows team names with member counts
- Handles team selection and automatic navigation to next step
- Displays loading states and empty states

#### Member Selection
**File: `ScoringStepMember.tsx`**
- Shows team members for the selected team
- Displays avatars, names, and titles
- Handles member selection and automatic navigation
- Supports pre-selected members

#### Action Selection
**File: `ScoringStepActions.tsx`**
- Groups activities into categories (Favorites, Global, Functions)
- Provides tabbed navigation between activity groups
- Shows activity details with favoriting capabilities
- Handles activity selection with auto-navigation

#### Rating & Feedback
**File: `ScoringStepStars.tsx`**
- Displays selected team member and activity
- Provides star rating interface
- Includes optional feedback textarea with character counter
- Shows validation and submission states

## User Flow

1. **Initiation**:
   - User clicks "Score Performance" in the sidebar or elsewhere
   - Modal opens to first applicable step (based on any pre-selected values)

2. **Team Selection**:
   - User selects a team from the list
   - Automatic navigation to member selection

3. **Member Selection**:
   - User selects a team member
   - Automatic navigation to activity selection

4. **Activity Selection**:
   - User navigates between activity categories (Favorites, Global, Functions)
   - User selects a specific activity
   - Automatic navigation to rating step

5. **Rating & Submission**:
   - User selects a star rating (1-5)
   - User optionally enters feedback
   - User submits the rating
   - Modal closes on successful submission

## Technical Details

### State Initialization
- The modal dynamically adjusts its flow based on provided props
- If a team and/or member is pre-selected, certain steps are skipped
- The step count is calculated based on provided context

### Navigation
- Automatic progression after selections
- Back button navigates to previous steps
- Close button dismisses the modal

### Data Management
- React Query handles API data fetching with caching
- Loading states displayed during data retrieval
- Empty states shown when no data is available

### Favorites System
- Users can mark activities as favorites
- Favorites are stored and managed separately
- Activities can be toggled between favorite/non-favorite status

### Validation
- Submit button is disabled until all required fields are filled
- Feedback is optional with character limit
- Error handling for failed submissions

## Integration Points

- **App Sidebar**: Contains the button to launch the modal
- **Dashboard Layout**: Includes the modal component
- **API Client**: Handles backend communication

This implementation provides a streamlined, step-by-step experience for performance scoring while maintaining flexibility for different entry points and pre-selections.
