# Helix Platform - Technical Documentation

## Overview
This document provides comprehensive documentation of the Helix platform's database structure, API endpoints, and implementation details. The platform is built to support team performance management with disciplines, activities, and structured feedback mechanisms.

## Table of Contents
1. [Database Schema](#database-schema)
2. [API Structure](#api-structure)
3. [Type System](#type-system)
4. [Authentication & Authorization](#authentication--authorization)
5. [Implementation Details](#implementation-details)
6. [Usage Examples](#usage-examples)

## Database Schema

### Core Models

#### User Model
```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String?
  clerkId   String?   @unique
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?
  members   Member[]
  teams     Team[]    @relation("TeamOwner")
}
```
Purpose: Represents user accounts, integrated with Clerk authentication.

#### Discipline Model
```prisma
model Discipline {
  id          String     @id @default(cuid())
  name        String     @unique
  description String?
  jobTitles   JobTitle[]
  teams       Team[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  deletedAt   DateTime?
}
```
Purpose: Categorizes job functions and organizes teams by specialty.

#### JobTitle Model
```prisma
model JobTitle {
  id           String     @id @default(cuid())
  name         String
  disciplineId String
  discipline   Discipline @relation(fields: [disciplineId], references: [id])
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
  deletedAt    DateTime?

  @@unique([name, disciplineId])
  @@index([disciplineId])
}
```
Purpose: Defines specific roles within disciplines.

#### Activity Model
```prisma
model Activity {
  id          String    @id @default(cuid())
  name        String    @unique
  description String?
  ratings     Rating[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?
}
```
Purpose: Defines trackable performance activities.

#### Team Model
```prisma
model Team {
  id           String     @id @default(cuid())
  name         String
  description  String?
  disciplineId String
  discipline   Discipline @relation(fields: [disciplineId], references: [id])
  ownerId      String
  owner        User       @relation("TeamOwner", fields: [ownerId], references: [id], onDelete: Cascade)
  members      Member[]
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
  deletedAt    DateTime?

  @@unique([name, ownerId])
  @@index([disciplineId])
  @@index([ownerId])
}
```
Purpose: Represents organizational teams with discipline associations.

#### Member Model
```prisma
model Member {
  id          String              @id @default(cuid())
  userId      String
  teamId      String
  title       String?
  isAdmin     Boolean             @default(false)
  status      MemberStatus        @default(ACTIVE)
  firstName   String?
  lastName    String?
  photoUrl    String?
  joinedDate  DateTime?
  jobGradeId  String?
  // Relations
  user        User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  team        Team                @relation(fields: [teamId], references: [id], onDelete: Cascade)
  jobGrade    JobGrade?           @relation(fields: [jobGradeId], references: [id])
  // Performance related
  ratings     Rating[]
  feedback    StructuredFeedback[]
  comments    Comment[]
  reviews     PerformanceReview[]
  // Timestamps
  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt
  deletedAt   DateTime?

  @@unique([userId, teamId])
  @@index([teamId])
  @@index([jobGradeId])
}
```
Purpose: Represents team membership and member details.

### Performance Tracking Models

#### Rating Model
```prisma
model Rating {
  id          String    @id @default(cuid())
  value       Int       @db.SmallInt
  memberId    String
  activityId  String
  member      Member    @relation(fields: [memberId], references: [id], onDelete: Cascade)
  activity    Activity  @relation(fields: [activityId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([memberId])
  @@index([activityId])
}
```
Purpose: Tracks performance ratings for specific activities.

#### StructuredFeedback Model
```prisma
model StructuredFeedback {
  id          String    @id @default(cuid())
  strengths   String[]
  improvements String[]
  goals       String[]
  memberId    String
  member      Member    @relation(fields: [memberId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([memberId])
}
```
Purpose: Provides structured performance feedback.

#### PerformanceReview Model
```prisma
model PerformanceReview {
  id          String       @id @default(cuid())
  quarter     Int         @db.SmallInt
  year        Int
  content     String
  status      ReviewStatus @default(DRAFT)
  memberId    String
  member      Member       @relation(fields: [memberId], references: [id], onDelete: Cascade)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  @@unique([memberId, quarter, year])
  @@index([memberId])
}
```
Purpose: Manages quarterly performance reviews.

### Enums

```prisma
enum MemberStatus {
  ACTIVE
  INACTIVE
  ONLEAVE
}

enum ReviewStatus {
  DRAFT
  PUBLISHED
  ACKNOWLEDGED
}
```

## API Structure

### Base URL Pattern
All API routes follow the pattern: `/api/{resource}/[id]/{sub-resource}`

### Endpoints Directory Structure
```
app/api/
├── activities/
│   ├── route.ts                    # List/Create activities
│   ├── [activityId]/
│   │   ├── route.ts               # Get/Update/Delete activity
│   │   └── ratings/
│   │       └── route.ts           # Activity ratings
├── disciplines/
│   ├── route.ts                    # List/Create disciplines
│   ├── [disciplineId]/
│   │   ├── route.ts               # Get/Update/Delete discipline
│   │   └── job-titles/
│   │       └── route.ts           # Discipline job titles
└── members/
    └── [memberId]/
        ├── feedback/
        │   └── route.ts           # Member feedback
        └── reviews/
            ├── route.ts           # List/Create reviews
            └── [reviewId]/
                └── route.ts       # Get/Update/Delete review
```

### Available Endpoints

#### Disciplines
- `GET /api/disciplines` - List all disciplines
- `POST /api/disciplines` - Create a discipline
- `GET /api/disciplines/:id` - Get discipline details
- `PATCH /api/disciplines/:id` - Update discipline
- `DELETE /api/disciplines/:id` - Delete discipline
- `GET /api/disciplines/:id/job-titles` - List job titles
- `POST /api/disciplines/:id/job-titles` - Add job title

#### Activities
- `GET /api/activities` - List all activities
- `POST /api/activities` - Create an activity
- `GET /api/activities/:id` - Get activity details
- `PATCH /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity
- `GET /api/activities/:id/ratings` - Get activity ratings
- `POST /api/activities/:id/ratings` - Add activity rating

#### Member Performance
- `GET /api/members/:id/feedback` - Get member feedback
- `POST /api/members/:id/feedback` - Add member feedback
- `GET /api/members/:id/reviews` - List member reviews
- `POST /api/members/:id/reviews` - Create review
- `PATCH /api/members/:id/reviews/:reviewId` - Update review
- `DELETE /api/members/:id/reviews/:reviewId` - Delete review

## Type System

### API Response Type
```typescript
export type ApiResponse<T> =
  | {
      success: true;
      data: T;
      error?: never;
    }
  | {
      success: false;
      data?: never;
      error: string;
    };
```

### Core Types
```typescript
export type DisciplineResponse = {
  id: string;
  name: string;
  description: string | null;
  jobTitles: JobTitleResponse[];
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    teams: number;
  };
};

export type ActivityResponse = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    ratings: number;
  };
};

export type StructuredFeedbackResponse = {
  id: string;
  strengths: string[];
  improvements: string[];
  goals: string[];
  memberId: string;
  createdAt: Date;
  updatedAt: Date;
  member?: {
    id: string;
    userId: string;
    teamId: string;
  };
};

export type PerformanceReviewResponse = {
  id: string;
  quarter: number;
  year: number;
  content: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ACKNOWLEDGED';
  memberId: string;
  createdAt: Date;
  updatedAt: Date;
  member?: {
    id: string;
    userId: string;
    teamId: string;
  };
};
```

## Authentication & Authorization

### Authentication Flow
1. Uses Clerk for user authentication
2. Every API route checks for authenticated user:
```typescript
const { userId } = await auth();
if (!userId) {
  return NextResponse.json<ApiResponse<never>>(
    { success: false, error: "Unauthorized" },
    { status: 401 }
  );
}
```

### Authorization Checks
- Team ownership verification
- Member role validation
- Review status checks

## Implementation Details

### Soft Deletion
- Most models include `deletedAt` timestamp
- Queries filter out soft-deleted records by default
- Example:
```typescript
const records = await prisma.discipline.findMany({
  where: {
    deletedAt: null,
  },
});
```

### Cascading Deletes
- Configured in schema for related records
- Example from Team-Member relationship:
```prisma
team        Team        @relation(fields: [teamId], references: [id], onDelete: Cascade)
```

### Indexing Strategy
- Foreign key fields are indexed
- Unique constraints include indexes
- Compound indexes for common query patterns

### Error Handling
Standard error response format:
```typescript
return NextResponse.json<ApiResponse<never>>(
  { success: false, error: "Error message" },
  { status: errorCode }
);
```

## Usage Examples

### Creating a Discipline with Job Titles
```typescript
const response = await fetch('/api/disciplines', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Engineering',
    description: 'Software development',
    jobTitles: ['Frontend Developer', 'Backend Developer'],
  }),
});
```

### Rating an Activity
```typescript
const response = await fetch(`/api/activities/${activityId}/ratings`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    memberId: 'member-id',
    value: 4,
  }),
});
```

### Creating a Performance Review
```typescript
const response = await fetch(`/api/members/${memberId}/reviews`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    quarter: 1,
    year: 2024,
    content: 'Performance review content...',
  }),
});
```

## Next Steps

1. Frontend Implementation:
   - Update existing pages to work with new models
   - Create management interfaces for disciplines and activities
   - Implement feedback and review workflows

2. Additional Features:
   - Advanced filtering and search
   - Batch operations
   - Report generation
   - Analytics dashboards

3. Performance Optimizations:
   - Query optimization
   - Caching strategy
   - Pagination implementation

## Migration Guide

To set up the database:

1. Run migrations:
```bash
npx prisma migrate dev --name add_discipline_and_activities
```

2. Generate Prisma Client:
```bash
npx prisma generate
```

3. Seed initial data:
```bash
npx prisma db seed
```

This will create the necessary tables and populate initial job grades, disciplines, and activities.