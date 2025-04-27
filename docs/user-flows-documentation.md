# JustScore User Flows Documentation

## Product Overview

JustScore is a performance management platform designed to help organizations track, measure, and improve team performance through structured feedback, scoring, and performance reviews. The platform focuses on action-based performance tracking aligned with organizational values and functional responsibilities.

## Jobs To Be Done (JTBD)

JustScore helps users accomplish the following key jobs:

1. **Track Team Performance**: Measure how well teams perform against defined actions and metrics.
2. **Evaluate Individual Contributors**: Score team members on specific actions and generate comprehensive performance reviews.
3. **Standardize Performance Criteria**: Create organization-wide standards for performance evaluation.
4. **Identify Performance Trends**: Analyze performance over time to identify patterns and make data-driven decisions.
5. **Provide Structured Feedback**: Give actionable feedback tied to specific performance metrics.
6. **Generate Performance Reviews**: Create comprehensive, data-driven performance reviews for team members.

## Core User Roles

1. **Organization Owner**: Sets up the organization and creates teams
2. **Team Leader/Admin**: Manages team members and evaluates performance
3. **Team Member**: Receives performance ratings and feedback

## User Journey Map

### Initial Onboarding Journey

The onboarding flow is a structured, multi-step process that guides users through setting up their organization, defining performance criteria, and creating teams.

#### 1. Onboarding Introduction

**Path**: `/dashboard/onboarding/intro`  
**Components**: `OnboardingIntroPage` in `app/dashboard/onboarding/intro/page.tsx`

**User Actions**:
- View an introduction to the onboarding process
- Start the onboarding process

**Technical Implementation**:
- Displays estimated completion time
- Provides an overview of all onboarding steps
- "Start Onboarding" button routes to the first step

#### 2. Organization Setup

**Path**: `/dashboard/onboarding/organisation`  
**Components**: `OrganisationPage` in `app/dashboard/onboarding/organisation/page.tsx`

**User Actions**:
- Enter organization name

**Technical Implementation**:
- Uses the `useConfigStore` to store the organization name
- Validation to ensure name is provided
- Progress tracking through `PageNavigator` component

#### 3. Global Actions Selection

**Path**: `/dashboard/onboarding/global-actions`  
**Components**: `GlobalActionsPage` in `app/dashboard/onboarding/global-actions/page.tsx`

**User Actions**:
- Select foundational actions that reflect organization's core values
- Required to select at least 5 actions per mandatory category

**Technical Implementation**:
- Uses `ActionsSelector` component
- Categories include "Cultural Behaviours & Values", "Customer Centricity", "Teamwork"
- Actions are stored in `useConfigStore`

#### 4. Function Actions Selection

**Path**: `/dashboard/onboarding/function-actions`  
**Components**: `FunctionActionsPage` in `app/dashboard/onboarding/function-actions/page.tsx`

**User Actions**:
- Select function-specific actions for performance evaluation
- Must select at least one action from at least one function category

**Technical Implementation**:
- Filtered categories excluding global categories
- Actions favoriting functionality
- Storage in `useConfigStore`

#### 5. Member Addition

**Path**: `/dashboard/onboarding/members`  
**Components**: `MembersPage` in `app/dashboard/onboarding/members/page.tsx`

**User Actions**:
- Add team members with names and email addresses
- Edit or remove team members

**Technical Implementation**:
- Uses `MemberForm` and `TeamList` components
- Local storage of member data during onboarding
- Validation for email format and uniqueness

#### 6. Team Creation

**Path**: `/dashboard/onboarding/teams`  
**Components**: `TeamsPage` in `app/dashboard/onboarding/teams/page.tsx`

**User Actions**:
- Create teams with names
- Assign functions to teams
- Assign members to teams

**Technical Implementation**:
- Uses `TeamForm` and `TeamList` components
- Validation for required fields
- Association of members and functions with teams

#### 7. Onboarding Summary

**Path**: `/dashboard/onboarding/summary`  
**Components**: `SummaryPage` in `app/dashboard/onboarding/summary/page.tsx`

**User Actions**:
- Review organization, actions, and team configurations
- Complete the onboarding process

**Technical Implementation**:
- Summary components show configuration
- "Complete Setup" button finalizes the onboarding
- API call to save all configuration to the database

### Main Dashboard Journey

After completing onboarding, users are presented with the main dashboard that provides an overview of team performance.

#### Dashboard Overview

**Path**: `/dashboard`  
**Components**: `DashboardLayout` in `app/dashboard/components/dashboard/DashboardLayout.tsx`

**User Actions**:
- View team performance metrics
- Navigate to different dashboard sections
- Add performance ratings
- Generate performance reviews

**Technical Implementation**:
- Tabs for different dashboard views: "Team Overview", "Team Standings", "Skill Analysis", "Feedback & Engagement"
- Performance charts using Recharts library
- Quick action buttons for adding ratings and feedback

#### Team Overview Tab

**Components**: `ViewTeamOverview` in `app/dashboard/components/dashboard/views/ViewTeamOverview.tsx`

**User Actions**:
- View overall performance metrics across teams
- See performance distribution by category
- Identify top and bottom performers

**Technical Implementation**:
- Charts and metrics from aggregated performance data
- Performance distribution by category
- Performance trends over time

#### Team Standings Tab

**Components**: `ViewIndividualPerformance` in `app/dashboard/components/dashboard/views/ViewIndividualPerformance.tsx`

**User Actions**:
- View individual performer rankings
- Filter and sort performers
- Switch between table and grid view

**Technical Implementation**:
- `TeamPerformanceView` component with sorting
- Performance categorization (Star, Strong, Solid, Lower, Poor)
- View switching between grid and table layouts

### Team Management Journey

Users can view, create, and manage teams through the Teams section.

#### Teams Overview

**Path**: `/dashboard/teams`  
**Components**: `TeamsPage` in `app/dashboard/teams/page.tsx`

**User Actions**:
- View all teams
- Create new teams
- Navigate to individual team views

**Technical Implementation**:
- `TeamsGrid` component displays team cards
- `TeamCreateModal` for creating new teams
- Empty state with `EmptyTeamsView` for first-time users

#### Individual Team View

**Path**: `/dashboard/teams/[teamId]`  
**Components**: `TeamDetailsPage` in `app/dashboard/teams/[teamId]/page.tsx`

**User Actions**:
- View team details and members
- Add new members
- Edit team settings
- Delete team

**Technical Implementation**:
- `TeamPerformanceSummary` shows team performance
- `AddMemberModal` for adding team members
- Team actions dropdown for settings and deletion

#### Team Member View

**Path**: `/dashboard/teams/[teamId]/members/[memberId]`  
**Components**: `MemberDetailsPage` in `app/dashboard/teams/[teamId]/members/[memberId]/page.tsx`

**User Actions**:
- View member performance dashboard
- View member ratings and feedback
- Edit member details
- Generate performance reviews

**Technical Implementation**:
- Tabs for different views: Dashboard, Ratings, Feedback, Performance Reviews
- `MemberDashboard` for performance metrics
- `RatingsSection` for viewing ratings
- `MemberReviewsList` for performance reviews

### Performance Scoring Journey

Users can score team member performance on specific actions.

#### Performance Scoring Modal

**Components**: `PerformanceScoringModal` in `app/dashboard/components/scoring/ScoringModal.tsx`

**User Actions**:
- Select a team (if not pre-selected)
- Select a team member (if not pre-selected)
- Select an action to score
- Rate performance on a scale of 1-5
- Add optional feedback

**Technical Implementation**:
- Multi-step modal with progress tracking
- Star rating component
- Storage of ratings in the database

### Performance Review Journey

Users can generate and manage performance reviews for team members.

#### Generate Review

**Components**: `GenerateReviewModal` in `app/dashboard/components/teams/team/member/GenerateReviewModal.tsx`

**User Actions**:
- Select review period (quarter, year, custom)
- Generate AI-powered performance review based on ratings
- View, edit, and publish the review

**Technical Implementation**:
- Options modal for selecting review period
- API integration for generating review content
- Markdown display of review content

#### View and Edit Review

**Path**: `/dashboard/teams/[teamId]/members/[memberId]/reviews/[reviewId]`  
**Components**: `ReviewPage` in `app/dashboard/teams/[teamId]/members/[memberId]/reviews/[reviewId]/page.tsx`

**User Actions**:
- View performance review
- Edit review content (if in draft)
- Publish review to make it visible to the team member

**Technical Implementation**:
- Markdown editing and rendering
- Status management (Draft, Published, Acknowledged)
- Save and publish functionality

### Settings Journey

Users can manage their profile and organization settings.

#### Settings Page

**Path**: `/dashboard/settings`  
**Components**: `SettingsPage` in `app/dashboard/settings/page.tsx`

**User Actions**:
- Edit profile information
- Edit organization name
- Manage teams
- Configure organization actions

**Technical Implementation**:
- `ProfileCard` for user profile
- Modals for editing different settings
- Integration with Clerk for profile management

## User Flows Diagram

Below is a high-level representation of the main user flows:

```
Onboarding Flow
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│    Intro    │→ │ Organization│→ │    Global   │→ │   Function  │→ │   Members   │→ │    Teams    │→ │   Summary   │
│             │  │             │  │   Actions   │  │   Actions   │  │             │  │             │  │             │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘

Main Application Flows
┌─────────────┐     ┌─────────────────────────────────────────────────────────────┐
│  Dashboard  │────→│                        Dashboard Tabs                        │
└──────┬──────┘     │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────┐│
       │            │ │    Team     │ │    Team     │ │    Skill    │ │ Feedback ││
       │            │ │   Overview  │ │  Standings  │ │  Analysis   │ │          ││
       │            │ └─────────────┘ └─────────────┘ └─────────────┘ └──────────┘│
       │            └─────────────────────────────────────────────────────────────┘
       │
       │            ┌─────────────────────────────────────────────────────────────┐
       └───────────→│                       Teams Management                       │
                    │ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
                    │ │  Teams List │→│ Team Details│→│      Member Details     │ │
                    │ │             │ │             │ │ ┌─────────┐ ┌─────────┐ │ │
                    │ └─────────────┘ └─────────────┘ │ │Dashboard│ │ Ratings │ │ │
                    │                                  │ └─────────┘ └─────────┘ │ │
                    │                                  │ ┌─────────┐ ┌─────────┐ │ │
                    │                                  │ │Feedback │ │ Reviews │ │ │
                    │                                  │ └─────────┘ └─────────┘ │ │
                    │                                  └─────────────────────────┘ │
                    └─────────────────────────────────────────────────────────────┘

Performance Management Flows
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│  Score Performance │→│  View Ratings   │→│Generate Reviews │
└────────────────┘     └────────────────┘     └────────────────┘
```

## User Interface Components

### Navigation Components

- **AppSidebar**: Main navigation sidebar (`app-sidebar.tsx`)
- **MobileBottomNav**: Mobile navigation bar (`MobileNav.tsx`)
- **PageBreadcrumbs**: Breadcrumb navigation for pages (`AppHeader.tsx`)

### Dashboard Components

- **PerformanceDataView**: Performance data charts and metrics (`PerformanceDataView.tsx`)
- **TeamPerformanceView**: Team performance display (`TeamPerformanceView.tsx`)
- **PerformanceByCategory**: Categorized performance view (`PerformersByCategory.tsx`)

### Team Management Components

- **TeamCard**: Card component for team display (`TeamCard.tsx`)
- **AddMemberModal**: Modal for adding team members (`TeamAddMemberModal.tsx`)
- **TeamEditModal**: Modal for editing team details (`TeamEditModal.tsx`)

### Member Management Components

- **ProfileCard**: Card component for member profiles (`ProfileCard.tsx`)
- **MemberDashboard**: Dashboard for member performance (`MemberDashboard.tsx`)
- **RatingsSection**: Display of member ratings (`MemberRatingsSection.tsx`)

### Performance Components

- **PerformanceScoringModal**: Modal for scoring performance (`ScoringModal.tsx`)
- **GenerateReviewModal**: Modal for generating reviews (`GenerateReviewModal.tsx`)
- **StarRating**: Star rating component for performance scoring (`StarRating.tsx`)

### Onboarding Components

- **PageNavigator**: Navigation for onboarding steps (`PageNavigator.tsx`)
- **ActionsSelector**: Component for selecting actions (`ActionsSelector.tsx`)
- **TeamForm**: Form for creating teams (`TeamForm.tsx`)
- **MemberForm**: Form for adding members (`MemberForm.tsx`)

## Subscription Tiers

The platform supports different subscription tiers with feature access:

1. **FREE**: Basic functionality with limited teams and actions
2. **PREMIUM**: Advanced features with more teams and actions
3. **ENTERPRISE**: Full functionality with unlimited teams and actions

## Error and Edge Cases Handling

### Empty States

- First-time users see empty state views with guidance
- Empty teams list shows a creation prompt
- Empty member list shows an addition prompt

### Error States

- API failures show error alerts with retry options
- Validation errors display inline with form fields
- Network errors prompt reconnection attempts

### Loading States

- Data loading shows skeleton loaders or spinners
- Large data operations show progress indicators
- Long-running processes (like review generation) show progress

## Accessibility Considerations

- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast compliance
- Screen reader support for critical UI elements

## Responsive Design

- Desktop-optimized layout with sidebar navigation
- Tablet layout with adjusted spacing and layouts
- Mobile layout with bottom navigation and stacked views
- View type switching between table and grid based on screen size

## Key User Flow Details

### Performance Scoring Flow

1. User clicks "Score Performance" from dashboard or team member view
2. User selects team (if not already selected)
3. User selects team member (if not already selected)
4. User selects action to score
5. User provides a 1-5 star rating
6. User optionally adds feedback
7. User submits the score
8. System updates performance metrics

### Performance Review Generation Flow

1. User navigates to a team member's profile
2. User clicks "Generate Performance Review"
3. User selects review period (quarter/year)
4. System generates review based on performance data
5. User can edit the generated review
6. User publishes the review
7. Team member can acknowledge the review

## Analytic Events and Measurement Points

The application tracks various events for performance analysis:

1. **Onboarding Completion Rate**: Percentage of users completing onboarding
2. **Team Creation**: Number of teams created
3. **Member Addition**: Number of members added
4. **Performance Scoring**: Frequency and distribution of scores
5. **Review Generation**: Number of reviews generated

These metrics help analyze user engagement and identify improvement areas for the application.
