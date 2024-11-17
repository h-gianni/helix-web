# UpScore - Team Performance Management System

## Overview
UpScore is a modern web application designed for team performance management. It enables organizations to track, measure, and improve team member performance through customizable initiatives and ratings.

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Authentication**: Clerk
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: shadcn/ui with TailwindCSS
- **State Management**: React Hooks
- **Development Tools**:
  - Storybook for component development
  - ESLint for code linting
  - TypeScript for type checking

## Core Features
1. **Team Management**
   - Create and manage teams
   - Add/remove team members
   - Set team administrators
   - Customize team descriptions

2. **Performance Initiatives**
   - Create reusable performance metrics
   - Associate initiatives with teams
   - Configure initiative descriptions
   - Track initiative usage

3. **Performance Rating System**
   - Rate team members on initiatives (1-5 scale)
   - Provide feedback with ratings
   - Track historical performance
   - Generate performance summaries

4. **Member Categories**
   - Top Performers (4.6-5.0)
   - Strong Performers (4.0-4.5)
   - Solid Performers (3.0-3.9)
   - Weak Performers (2.1-2.9)
   - Poor Performers (1.0-2.0)
   - Not Rated (No ratings yet)

## Project Structure

```
src/
├── app/
│   ├── api/                    # API Routes
│   │   ├── initiatives/        # Initiative management
│   │   ├── teams/             # Team management
│   │   └── user/              # User profile management
│   │
│   ├── dashboard/             # Dashboard pages
│   │   ├── settings/          # App settings
│   │   └── teams/            # Team management UI
│   │
│   └── lib/                   # Shared utilities
│       ├── types/             # TypeScript types
│       └── utils/             # Helper functions
│
├── components/
│   └── ui/                    # Shared UI components
│
└── styles/                    # Global styles
```

### Key Directories Explained

#### API Routes (`app/api/`)
- **initiatives/**: CRUD operations for performance initiatives
- **teams/**: Team management operations including member handling
- **user/**: User profile and preferences management

#### Dashboard (`app/dashboard/`)
- **settings/**: Application settings and user preferences
- **teams/**: Team management interface and performance tracking
- **_components/**: Shared dashboard components

#### Components (`components/`)
- **ui/**: Reusable UI components based on shadcn/ui

## API Documentation

### Teams API

#### GET /api/teams
Fetch all teams for authenticated user.
```typescript
Response: ApiResponse<TeamResponse[]>
```

#### POST /api/teams
Create a new team.
```typescript
Request: {
  name: string;
  description?: string;
}
Response: ApiResponse<TeamResponse>
```

#### GET /api/teams/[teamId]
Get team details.
```typescript
Response: ApiResponse<TeamDetailsResponse>
```

#### PATCH /api/teams/[teamId]
Update team details.
```typescript
Request: {
  name?: string;
  description?: string;
}
Response: ApiResponse<TeamResponse>
```

#### DELETE /api/teams/[teamId]
Delete a team.
```typescript
Response: ApiResponse<void>
```

### Members API

#### GET /api/teams/[teamId]/members
Get team members.
```typescript
Response: ApiResponse<TeamMemberResponse[]>
```

#### POST /api/teams/[teamId]/members
Add member to team.
```typescript
Request: {
  email: string;
  title?: string;
  isAdmin?: boolean;
}
Response: ApiResponse<TeamMemberResponse>
```

### Initiatives API

#### GET /api/initiatives
Get all initiatives.
```typescript
Response: ApiResponse<InitiativeResponse[]>
```

#### POST /api/initiatives
Create new initiative.
```typescript
Request: {
  name: string;
  description?: string;
}
Response: ApiResponse<InitiativeResponse>
```

### Ratings API

#### POST /api/teams/[teamId]/members/[memberId]/ratings
Add a performance rating.
```typescript
Request: {
  initiativeId: string;
  rating: number;
  feedback?: string;
}
Response: ApiResponse<ScoreResponse>
```

## Type System

### Core Types
```typescript
interface TeamResponse {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}

interface TeamMemberResponse {
  id: string;
  userId: string;
  teamId: string;
  title: string | null;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

interface InitiativeResponse {
  id: string;
  name: string;
  description: string | null;
  teamId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ScoreResponse {
  id: string;
  value: number;
  feedback: string | null;
  memberId: string;
  initiativeId: string;
  createdAt: Date;
}
```

## Naming Conventions

### Files and Folders
- **Pages**: Lowercase with hyphens (`team-details.tsx`)
- **Components**: PascalCase (`TeamCard.tsx`)
- **Utilities**: Camelcase (`formatDate.ts`)
- **API Routes**: Lowercase (`teams.ts`)
- **Private Components**: Prefix with underscore (`_teamModal.tsx`)

### Components
- **React Components**: PascalCase (`TeamMemberList`)
- **Hooks**: Camelcase with 'use' prefix (`useTeamMembers`)
- **Context**: PascalCase with 'Context' suffix (`TeamContext`)

### Variables and Functions
- **Variables**: Camelcase (`teamMembers`)
- **Functions**: Camelcase (`handleSubmit`)
- **Constants**: UPPERCASE with underscores (`MAX_TEAM_SIZE`)
- **Interfaces**: PascalCase with 'I' prefix (`ITeamMember`)
- **Types**: PascalCase (`TeamResponse`)

## State Management
- Use React's built-in useState for component-level state
- Use React Context for shared state when needed
- Avoid prop drilling by utilizing composition
- Keep state as close to where it's used as possible

## Error Handling
- Use try/catch blocks in async operations
- Implement error boundaries for component trees
- Use toast notifications for user feedback
- Log errors to console in development

## Performance Considerations
- Implement pagination for large lists
- Use proper React memo and callbacks
- Optimize database queries
- Implement proper loading states

## Security
- All routes are protected by Clerk authentication
- Implement proper role-based access control
- Validate all inputs server-side
- Use CSRF protection
- Follow security best practices

## Getting Started

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```env
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

4. Run database migrations
```bash
npx prisma migrate dev
```

5. Start development server
```bash
npm run dev
```

## Development Workflow

1. **Creating New Features**
   - Create feature branch from main
   - Follow existing patterns and conventions
   - Add proper types and documentation
   - Test thoroughly
   - Submit PR for review

2. **Making Changes**
   - Update relevant documentation
   - Add/update tests as needed
   - Follow the established coding style
   - Use meaningful commit messages

3. **Code Review Process**
   - PRs require one approval
   - All tests must pass
   - No TypeScript errors
   - Follows established patterns

Would you like me to expand on any particular section or add more details to specific areas?