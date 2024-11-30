# Helix Application Developer Guide

## Overview
Helix is a performance management application built with Next.js, focusing on team management and performance tracking. The application allows organizations to:
- Manage teams and team members
- Track performance initiatives
- Rate team members' performance
- Generate performance insights and reports

## Tech Stack

### Core Technologies
- **Framework**: Next.js 14.2.17 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks with server-side data fetching

### Key Dependencies
- `@clerk/nextjs` - Authentication and user management
- `@prisma/client` - Database ORM
- `shadcn/ui` - UI component library
- `lucide-react` - Icon library
- `class-variance-authority` - Component styling variants
- `tailwind-merge` & `clsx` - CSS class management

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── _components/       # Shared components
├── components/
│   └── ui/               # UI components (shadcn/ui)
├── lib/                   # Utility functions and types
└── prisma/               # Database schema and migrations
```

## Database Schema

### Key Models
- `User` - Base user model linked with Clerk
- `Team` - Teams with owners and members
- `Member` - Team membership with roles
- `Initiative` - Performance tracking categories
- `Score` - Performance ratings
- `Goal` - Member goals
- `Report` - Performance reports

## Authentication & Authorization

The application uses Clerk for authentication with custom authorization logic:
- Team owners have full access to their teams
- Team admins can manage team members and ratings
- Regular members have limited access based on their role

## API Structure

### RESTful Endpoints
- `/api/teams` - Team management
- `/api/initiatives` - Initiative management
- `/api/dashboard` - Dashboard data
- `/api/user` - User profile management

### Response Format
```typescript
type ApiResponse<T> = {
  success: true;
  data: T;
  error?: never;
} | {
  success: false;
  data?: never;
  error: string;
};
```

## UI Components

### Component Library
The project uses shadcn/ui components with custom styling. Key components include:
- `Button`
- `Card`
- `Dialog`
- `Select`
- `Table`
- `Tabs`

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow the established color system in `globals.css`
- Use the `cn()` utility for class merging
- Maintain dark mode compatibility

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Clerk account

### Environment Setup
1. Clone the repository
2. Create `.env` file with:
   ```
   DATABASE_URL=postgresql://...
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
   CLERK_SECRET_KEY=...
   ```

### Development Commands
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev

# Build for production
npm run build
```

## Performance Considerations

### Data Fetching
- Use server-side data fetching where possible
- Implement proper pagination for lists
- Cache frequently accessed data

### Component Optimization
- Lazy load components when appropriate
- Use memo and useCallback for expensive operations
- Implement proper loading states

## Design System

### Colors
The application uses a neutral color palette with semantic colors for:
- Primary actions
- Destructive actions
- Success states
- Warning states
- Information states

### Typography
- Font: Geist (custom font)
- Consistent heading scales
- Responsive text sizes

### Layout
- Grid-based layouts
- Responsive breakpoints
- Consistent spacing using Tailwind's spacing scale

## Best Practices

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use proper type definitions

### Component Structure
- Separate business logic from UI
- Use composition over inheritance
- Implement proper error boundaries

### State Management
- Use React Query for server state
- Implement proper loading states
- Handle errors gracefully

## Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables
Ensure all required environment variables are set in production:
- Database connection
- Clerk authentication
- API keys
- Environment-specific configurations

## Contributing

### Git Workflow
1. Create feature branches from `main`
2. Follow conventional commits
3. Submit PRs with proper descriptions
4. Ensure tests pass before merging

### Code Review Process
- Required reviews before merging
- CI/CD checks must pass
- Follow the established coding standards

## Support

### Documentation
- API documentation in code comments
- Type definitions in `/lib/types`
- Component documentation in stories

### Common Issues
- Database connection issues: Check DATABASE_URL
- Authentication errors: Verify Clerk setup
- Build errors: Check dependency versions

## License
[Add license information]
