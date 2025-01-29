# Performance Management System Database Documentation

1. [Introduction](#introduction)
2. [Design Philosophy](#design-philosophy)
3. [Layer 1: Core Functionality](#layer-1-core-functionality)
4. [Layer 2: Enhanced HR Management](#layer-2-enhanced-hr-management)
5. [Layer 3: Behavioral Impact Features](#layer-3-behavioral-impact-features)

## Introduction

This document details the database schema for our Performance Management System, designed to support modern organizational needs while incorporating behavioral psychology principles. The system is built using PostgreSQL with Prisma as the ORM, providing type safety and efficient query capabilities.

## Design Philosophy

Our schema design follows these core principles:
- **Data Integrity**: Ensuring accurate and consistent data across all operations
- **Scalability**: Supporting growth in both data volume and organizational complexity
- **Flexibility**: Accommodating different organizational structures and workflows
- **Performance**: Optimizing for common query patterns
- **Privacy**: Supporting granular access control and data protection
- **Behavioral Insights**: Incorporating psychological factors in performance management

## Layer 1: Core Functionality

### Overview

The Core Functionality layer establishes the foundational data structures and relationships for the Performance Management System. This layer handles essential aspects of user management, organizational structure, performance tracking, and audit logging.

### Why It's Important

The core functionality layer forms the foundation of the performance management system and is crucial for several reasons:

1. **Organizational Structure Management**
   - Provides the basic framework for managing teams and hierarchies
   - Enables clear reporting lines and accountability
   - Supports both traditional and matrix organizational structures
   - Essential for scaling operations and managing growth

2. **Basic Performance Tracking**
   - Establishes fundamental metrics for measuring performance
   - Creates transparency in performance evaluation
   - Enables data-driven decision making
   - Forms the basis for fair compensation and promotion decisions

3. **Compliance and Documentation**
   - Maintains essential records for regulatory compliance
   - Documents performance history for legal requirements
   - Supports audit trails for key decisions
   - Ensures consistency in performance management

4. **Team Member Development**
   - Tracks basic professional growth
   - Enables skill and competency mapping
   - Supports basic career progression
   - Facilitates team composition planning

5. **Operational Efficiency**
   - Streamlines basic HR processes
   - Reduces administrative overhead
   - Provides clear workflow management
   - Enables basic automation of routine tasks

### CORE ENUMS:

### UserStatus
```prisma
enum UserStatus {
  ACTIVE
  INACTIVE
  GONE
}
```
**Purpose**: Manages the lifecycle states of user accounts in the system.

**Usage Contexts**:
- Account status management
- Access control
- Succession planning

**Constraints**:
- Status transitions must follow defined workflows
- Cannot delete users with ACTIVE status

**Business Rules**:
- ACTIVE: Full system access granted
- INACTIVE: Limited access, pending transfer
- GONE: No access, marked for deletion

### TeamMemberStatus
```prisma
enum TeamMemberStatus {
  ACTIVE
  INACTIVE
  ONLEAVE
}
```
**Purpose**: Tracks the current working status of team members within the organization.

**Usage Contexts**:
- Team capacity planning
- Resource allocation
- Performance tracking

**Constraints**:
- Status changes require manager approval
- Cannot be INACTIVE and assigned to active projects

**Business Rules**:
- ACTIVE: Currently working and available
- INACTIVE: Not available for assignment
- ONLEAVE: Temporarily unavailable

### BusinessActivityStatus
```prisma
enum BusinessActivityStatus {
  ACTIVE
  COMPLETED
  ARCHIVED
}
```
**Purpose**: Manages the lifecycle of business activities and tasks.

**Usage Contexts**:
- Activity tracking
- Performance measurement
- Historical analysis

**Constraints**:
- Cannot modify ARCHIVED activities
- COMPLETED activities can be archived but not reactivated

**Business Rules**:
- ACTIVE: Ongoing activities that can be rated
- COMPLETED: Finished activities pending archive
- ARCHIVED: Historical record, read-only

### CORE MODELS

### AppUser
```prisma
model AppUser {
  id            String     @id @default(cuid())
  email         String     @unique @db.VarChar(255)
  name          String?    @db.VarChar(100)
  clerkId       String?    @unique
  status        UserStatus @default(ACTIVE)
  successorId   String?
  customFields  Json?
}
```
**Purpose**: Manages user identities and authentication within the system.

**Relationships**:
- One-to-many with TeamMember via `teamMembers`
- One-to-many with GTeam via `ownedTeams`
- One-to-many with GTeam via `managedTeams`
- Self-referential via `successorId` for succession planning

**Constraints**:
- `email`: Unique, valid email format
- `clerkId`: Unique when provided
- `status`: Must be a valid UserStatus
- `name`: Maximum 100 characters

**Optional Fields**:
- `name`: Display name for the user
- `clerkId`: External authentication ID
- `successorId`: For succession planning
- `customFields`: Extensible attributes

**Indexing**:
- Primary key on `id`
- Unique index on `email`
- Unique index on `clerkId`
- Index on `status` for filtering

**Business Rules**:
- Cannot delete users with active team memberships
- Status changes must follow defined workflow
- Successor must be an active user



### GTeam
```prisma
model GTeam {
  id             String    @id @default(cuid())
  name           String    @db.VarChar(200)
  description    String?   @db.Text
  ownerId        String
  managerId      String
  parentTeamId   String?   // Reference to parent team
  isContainer    Boolean   @default(false)  // Indicates if team can contain other teams
  customFields   Json?
}
```

**Purpose**: Defines organizational team structures and hierarchies, supporting nested team structures for complex organizational designs.

**Relationships**:
- Many-to-one with AppUser via `owner`
- Many-to-one with AppUser via `manager`
- Self-referential via `parentTeam` and `childTeams` for hierarchy
- One-to-many with TeamMember via `teamMembers`
- Many-to-many with TeamFunction via `teamFunctions`
- One-to-many with BusinessActivity via `activities`

**Constraints**:
- `name`: Unique within owner's scope
- `ownerId`: Must reference valid AppUser
- `managerId`: Must reference valid AppUser
- `parentTeamId`: Must reference valid GTeam when provided
- Name length: 200 characters maximum
- Cannot have circular team hierarchies

**Optional Fields**:
- `description`: Team purpose and scope
- `parentTeamId`: Reference to parent team
- `customFields`: Extended attributes

**Indexing**:
- Primary key on `id`
- Composite unique index on `[name, ownerId]`
- Index on `managerId`
- Index on `parentTeamId` for hierarchy queries

**Business Rules**:
- Owner must have active status
- Manager must have active status
- Cannot delete teams with active members
- Parent teams must have `isContainer` set to true
- Child teams inherit function access from parent teams
- Cannot move a team under its own child team
- Must maintain consistent management chain
- Container teams can have different managers from their child teams
- Nested depth should follow organizational guidelines

**Hierarchy Rules**:
- Container teams (`isContainer = true`):
  - Can contain other teams
  - Can have their own team members
  - Can have different managers from child teams
  - Share function access with child teams

- Regular teams (`isContainer = false`):
  - Cannot contain other teams
  - Can be nested under container teams
  - Have their own manager and members
  - Inherit function access from parent teams

**Query Considerations**:
- Use recursive queries for hierarchy traversal
- Implement caching for frequently accessed hierarchies
- Consider materialized paths for deep hierarchies
- Optimize for common ancestor queries

### TeamMember
```prisma
model TeamMember {
  id              String           @id @default(email)
  userId          String
  teamId          String
  jobTitleId      String?
  jobGradeId      String?
  title           String?          @db.VarChar(100)
  email           String           @unique @db.VarChar(255)
  status          TeamMemberStatus @default(ACTIVE)
  canViewFeedback Boolean          @default(false)
  customFields    Json?
}
```
**Purpose**: Represents individual team members and their roles within teams.

**Relationships**:
- Many-to-one with AppUser via `user`
- Many-to-one with GTeam via `team`
- Many-to-one with JobTitle via `jobTitle`
- Many-to-one with JobGrade via `jobGrade`
- One-to-many with MemberRating via `ratings`
- One-to-many with StructuredFeedback via `feedback`

**Constraints**:
- `email`: Unique, valid email format
- `userId`: Must reference valid AppUser
- `teamId`: Must reference valid GTeam
- Unique combination of `[userId, teamId]`

**Optional Fields**:
- `jobTitleId`: Role designation
- `jobGradeId`: Career level
- `title`: Custom role title
- `customFields`: Extended attributes

**Indexing**:
- Primary key on `id`
- Unique index on `email`
- Index on `teamId`
- Index on `status`
- Composite index on `[userId, teamId]`

**Business Rules**:
- Cannot be member of same team multiple times
- Status changes require manager approval
- Email must match associated AppUser

[Previous content remains the same...]

### ReviewStatus
```prisma
enum ReviewStatus {
  DRAFT
  PUBLISHED
  ACKNOWLEDGED
}
```
**Purpose**: Manages the lifecycle states of performance reviews and feedback.

**Usage Contexts**:
- Performance review workflow
- Feedback management
- Documentation status

**Constraints**:
- Status transitions must follow sequence
- Cannot revert to DRAFT from ACKNOWLEDGED

**Business Rules**:
- DRAFT: Work in progress, editable
- PUBLISHED: Shared with recipient, read-only
- ACKNOWLEDGED: Confirmed by recipient, locked

### Priority
```prisma
enum Priority {
  LOW
  MEDIUM
  HIGH
}
```
**Purpose**: Standardizes priority levels across the system.

**Usage Contexts**:
- Activity prioritization
- Task management
- Resource allocation

**Constraints**:
- Cannot be modified after activity completion
- Must be set at creation

**Business Rules**:
- HIGH: Immediate attention required
- MEDIUM: Standard priority
- LOW: Non-urgent tasks

### EntityType
```prisma
enum EntityType {
  APP_USER
  TEAM_FUNCTION
  JOB_TITLE
  JOB_GRADE
  BUSINESS_ACTIVITY
  G_TEAM
  TEAM_MEMBER
  MEMBER_RATING
  STRUCTURED_FEEDBACK
  PERFORMANCE_REVIEW
}
```
**Purpose**: Identifies different entity types for audit logging and system operations.

**Usage Contexts**:
- Audit trail tracking
- System operations
- Data management

**Constraints**:
- Must match existing model types
- Cannot be extended without schema update

**Business Rules**:
- Used for type-specific operations
- Determines audit logging behavior
- Controls access patterns

### AuditAction
```prisma
enum AuditAction {
  CREATE
  UPDATE
  DELETE
  RESTORE
  STATUS_CHANGE
}
```
**Purpose**: Defines types of actions tracked in the audit system.

**Usage Contexts**:
- Change tracking
- Compliance monitoring
- Activity logging

**Constraints**:
- Must be logged with timestamp
- Requires user attribution

**Business Rules**:
- CREATE: New entity creation
- UPDATE: Modification of existing entity
- DELETE: Soft deletion
- RESTORE: Reactivation
- STATUS_CHANGE: State transitions

### BusinessActivity
```prisma
model BusinessActivity {
  id          String                 @id @default(cuid())
  name        String                 @unique @db.VarChar(200)
  description String?                @db.Text
  category    String?                @db.VarChar(100)
  priority    Priority               @default(MEDIUM)
  status      BusinessActivityStatus @default(ACTIVE)
  dueDate     DateTime?
  teamId      String
  createdBy   String
  customFields Json?
}
```
**Purpose**: Tracks and manages business activities that team members can be rated on.

**Relationships**:
- Many-to-one with GTeam via `team`
- Many-to-one with AppUser via `createdBy`
- One-to-many with MemberRating via `ratings`

**Constraints**:
- `name`: Unique across system
- `teamId`: Must reference valid GTeam
- `createdBy`: Must reference valid AppUser
- `category`: Maximum 100 characters

**Optional Fields**:
- `description`: Detailed activity information
- `category`: Activity classification
- `dueDate`: Completion target
- `customFields`: Extended attributes

**Indexing**:
- Primary key on `id`
- Unique index on `name`
- Composite index on `[teamId, createdAt]`
- Index on `status`
- Index on `createdBy`

**Business Rules**:
- Cannot modify completed activities
- Status changes follow defined workflow
- Must belong to active team

### JobTitle
```prisma
model JobTitle {
  id             String       @id @default(cuid())
  name           String       @db.VarChar(100)
  teamFunctionId String
  description    String?      @db.VarChar(500)
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  deletedAt      DateTime?
  customFields   Json?
}
```
**Purpose**: Defines standardized job titles within organizational functions.

**Relationships**:
- Many-to-one with TeamFunction via `teamFunction`
- One-to-many with TeamMember via `teamMembers`

**Constraints**:
- Unique combination of `[name, teamFunctionId]`
- `name`: Maximum 100 characters
- `description`: Maximum 500 characters

**Optional Fields**:
- `description`: Role description
- `deletedAt`: Soft deletion
- `customFields`: Extended attributes

**Indexing**:
- Primary key on `id`
- Composite unique index on `[name, teamFunctionId]`
- Index on `teamFunctionId`
- Index on `deletedAt`

**Business Rules**:
- Cannot delete titles with active members
- Must belong to active team function
- Supports soft deletion

### JobGrade
```prisma
model JobGrade {
  id                      String    @id @default(cuid())
  level                   Int       @unique
  grade                   String    @unique @db.VarChar(50)
  typicalResponsibilities String?   @db.Text
  createdAt              DateTime   @default(now())
  updatedAt              DateTime   @updatedAt
  deletedAt              DateTime?
  customFields           Json?
}
```
**Purpose**: Defines career levels and grade structures within the organization.

**Relationships**:
- One-to-many with TeamMember via `teamMembers`

**Constraints**:
- `level`: Unique integer
- `grade`: Unique string identifier
- `grade`: Maximum 50 characters

**Optional Fields**:
- `typicalResponsibilities`: Role expectations
- `deletedAt`: Soft deletion
- `customFields`: Extended attributes

**Indexing**:
- Primary key on `id`
- Unique index on `level`
- Unique index on `grade`
- Index on `deletedAt`

**Business Rules**:
- Cannot delete grades with assigned members
- Levels must be sequential
- Supports soft deletion

### MemberRating
```prisma
model MemberRating {
  id            String    @id @default(cuid())
  value         Int       @db.SmallInt
  teamMemberId  String
  activityId    String
  submitterId   String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?
}
```
**Purpose**: Records performance ratings for team members on specific activities.

**Relationships**:
- Many-to-one with TeamMember via `teamMember`
- Many-to-one with BusinessActivity via `activity`
- Many-to-one with AppUser via `submitter`

**Constraints**:
- `value`: Integer within defined range
- `teamMemberId`: Must reference valid TeamMember
- `activityId`: Must reference valid BusinessActivity
- `submitterId`: Must reference valid AppUser

**Optional Fields**:
- `deletedAt`: Soft deletion support

**Indexing**:
- Primary key on `id`
- Index on `teamMemberId`
- Index on `activityId`
- Index on `submitterId`
- Index on `createdAt`
- Index on `deletedAt`

**Business Rules**:
- Cannot rate inactive team members
- Cannot rate completed activities
- Supports soft deletion

### StructuredFeedback
```prisma
model StructuredFeedback {
  id           String   @id @default(cuid())
  teamMemberId String
  strengths    String[] @db.Text
  improvements String[] @db.Text
  goals        String[] @db.Text
  customFields Json?
}
```
**Purpose**: Provides structured performance feedback for team members.

**Relationships**:
- Many-to-one with TeamMember via `teamMember`

**Constraints**:
- `teamMemberId`: Must reference valid TeamMember
- Arrays must contain valid text entries
- Cannot be empty feedback

**Optional Fields**:
- `customFields`: Extended attributes

**Indexing**:
- Primary key on `id`
- Index on `teamMemberId`
- Index on `createdAt`

**Business Rules**:
- Requires at least one category
- Cannot modify after acknowledgment
- Must be associated with active member

### AuditLog
```prisma
model AuditLog {
  id          String      @id @default(cuid())
  action      AuditAction
  entityType  EntityType
  entityId    String
  changes     Json
  performedBy String
  createdAt   DateTime    @default(now())
}
```
**Purpose**: Maintains audit trail of system changes for compliance and tracking.

**Relationships**:
- No direct relationships (references via entityId)

**Constraints**:
- `entityId`: Must reference valid entity
- `performedBy`: Must reference valid AppUser
- `changes`: Valid JSON structure

**Optional Fields**:
- None (all fields required)

**Indexing**:
- Primary key on `id`
- Composite index on `[entityType, entityId]`
- Index on `performedBy`
- Index on `createdAt`

**Business Rules**:
- Immutable once created
- Requires valid entity reference
- Must capture all changes



## Layer 2: Enhanced HR Management

### Overview

Layer 2 extends the core functionality to provide sophisticated HR management capabilities, focusing on career development, performance measurement, and skill management. This layer enables organizations to implement comprehensive talent development strategies.

### Why It's Important

1. **Strategic Talent Development**
   - Enables long-term career planning and succession management
   - Supports detailed skill gap analysis and development planning
   - Facilitates targeted training and development initiatives
   - Helps retain high-potential employees through clear growth paths

2. **Performance Analytics**
   - Provides deeper insights into performance trends
   - Enables predictive performance analysis
   - Supports data-driven HR decisions
   - Facilitates performance benchmarking

3. **Organizational Development**
   - Supports advanced organizational planning
   - Enables competency framework development
   - Facilitates workforce planning
   - Supports change management initiatives

4. **Employee Engagement**
   - Enables structured career development
   - Supports mentorship programs
   - Facilitates goal alignment
   - Enhances retention through clear progression paths

5. **Risk Management**
   - Identifies performance risks early
   - Supports succession planning
   - Manages talent flight risks
   - Ensures knowledge retention

### ENHANCEMENT ENUMS

### PlanStatus
```prisma
enum PlanStatus {
  DRAFT
  ACTIVE
  COMPLETED
  CANCELLED
}
```
**Purpose**: Manages the lifecycle of development and career plans.

**Usage Contexts**:
- Development plan tracking
- Career progression monitoring
- Goal achievement tracking

**Constraints**:
- Status transitions must follow defined workflow
- Cannot modify COMPLETED plans

**Business Rules**:
- DRAFT: Initial planning phase
- ACTIVE: Currently being executed
- COMPLETED: All objectives achieved
- CANCELLED: Terminated before completion

### ObjectiveStatus
```prisma
enum ObjectiveStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
  BLOCKED
}
```
**Purpose**: Tracks the progress of individual development objectives.

**Usage Contexts**:
- Objective progress tracking
- Performance monitoring
- Development planning

**Constraints**:
- Status updates require manager approval
- BLOCKED status requires explanation

**Business Rules**:
- NOT_STARTED: Planned but not initiated
- IN_PROGRESS: Currently being worked on
- COMPLETED: Successfully achieved
- BLOCKED: Impeded by obstacles

### PeriodType
```prisma
enum PeriodType {
  QUARTER
  HALF_YEAR
  YEAR
}
```
**Purpose**: Defines time periods for performance tracking and goal setting.

**Usage Contexts**:
- Performance reviews
- Goal setting cycles
- Trend analysis

**Constraints**:
- Must align with organizational review cycles
- Cannot change period type once set

**Business Rules**:
- QUARTER: 3-month performance cycle
- HALF_YEAR: 6-month performance cycle
- YEAR: Annual performance cycle

### ENHANCEMENT MODELS

### DevelopmentPlan
```prisma
model DevelopmentPlan {
  id            String     @id @default(cuid())
  teamMemberId  String
  objectives    DevelopmentObjective[]
  startDate     DateTime
  endDate       DateTime
  status        PlanStatus @default(DRAFT)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}
```
**Purpose**: Structures and tracks individual development planning and progress.

**Relationships**:
- Many-to-one with TeamMember via `teamMember`
- One-to-many with DevelopmentObjective via `objectives`

**Constraints**:
- `endDate`: Must be after startDate
- `status`: Must be valid PlanStatus
- Cannot have overlapping active plans

**Optional Fields**:
- None, all fields required for plan integrity

**Indexing**:
- Primary key on `id`
- Index on `teamMemberId`
- Index on `status`
- Composite index on `[teamMemberId, status]`

**Business Rules**:
- Can only be modified in DRAFT status
- Must have at least one objective
- Duration cannot exceed 2 years

### PerformanceScore
```prisma
model PerformanceScore {
  id            String     @id @default(cuid())
  teamMemberId  String
  periodType    PeriodType
  periodNumber  Int
  year          Int
  score         Float
  trend         Float
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}
```
**Purpose**: Captures and tracks performance metrics over time.

**Relationships**:
- Many-to-one with TeamMember via `teamMember`

**Constraints**:
- `score`: Value between 1.0 and 5.0
- `trend`: Value between -100.0 and 100.0
- Unique combination of `[teamMemberId, periodType, periodNumber, year]`

**Optional Fields**:
- None, all fields required for score tracking

**Indexing**:
- Primary key on `id`
- Composite unique index on `[teamMemberId, periodType, periodNumber, year]`
- Index on `teamMemberId`

**Business Rules**:
- Cannot modify scores after period ends
- Trend calculated automatically
- Score requires manager approval

### CareerPath
```prisma
model CareerPath {
  id            String    @id @default(cuid())
  teamMemberId  String
  currentRole   String
  targetRole    String
  timeframe     Int       @db.SmallInt
  progress      Float     @db.Real
  mentorId      String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```
**Purpose**: Defines and tracks career progression paths for team members.

**Relationships**:
- Many-to-one with TeamMember via `teamMember`
- Many-to-one with TeamMember via `mentor`
- One-to-many with SkillGapAssessment via `skillGaps`

**Constraints**:
- `timeframe`: Months, between 6 and 60
- `progress`: Percentage between 0 and 100
- `targetRole`: Must be valid job title

**Optional Fields**:
- `mentorId`: Assigned career mentor
- Related skill gap assessments

**Indexing**:
- Primary key on `id`
- Index on `teamMemberId`
- Index on `mentorId`

**Business Rules**:
- Mentor must be senior to mentee
- Progress updates require validation
- Cannot have multiple active paths

### SkillGapAssessment
```prisma
model SkillGapAssessment {
  id              String    @id @default(cuid())
  careerPathId    String
  skillId         String
  currentLevel    Int       @db.SmallInt
  requiredLevel   Int       @db.SmallInt
  developmentPlan String?   @db.Text
  priority        Priority  @default(MEDIUM)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```
**Purpose**: Identifies and tracks skill development needs for career progression.

**Relationships**:
- Many-to-one with CareerPath via `careerPath`
- Many-to-one with Skill via `skill`

**Constraints**:
- `currentLevel`: Integer between 1 and 5
- `requiredLevel`: Integer between 1 and 5
- Must have development plan if gap exists

**Optional Fields**:
- `developmentPlan`: Action plan for improvement
- Priority level for development

**Indexing**:
- Primary key on `id`
- Index on `careerPathId`
- Index on `skillId`

**Business Rules**:
- Required level must be achievable
- Development plan required for significant gaps
- Regular reassessment required

### Competency
```prisma
model Competency {
  id          String    @id @default(cuid())
  name        String    @unique
  description String    @db.Text
  category    String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```
**Purpose**: Defines organizational competencies and skill requirements.

**Relationships**:
- One-to-many with CompetencyAssessment via `assessments`

**Constraints**:
- `name`: Unique across organization
- `category`: Must be from approved list

**Optional Fields**:
- Detailed description
- Category classification

**Indexing**:
- Primary key on `id`
- Unique index on `name`
- Index on `category`

**Business Rules**:
- Cannot delete if referenced by assessments
- Category must match organizational framework
- Regular review and updates required



## Layer 3: Behavioral Impact Features

### Overview

Layer 3 integrates behavioral psychology and emotional intelligence into the performance management system. It focuses on measuring, tracking, and improving the human aspects of performance and team dynamics.

### Why It's Important

1. **Psychological Safety**
   - Creates an environment where innovation thrives
   - Reduces fear of failure and encourages experimentation
   - Improves team collaboration and communication
   - Increases employee engagement and satisfaction

2. **Bias Prevention**
   - Ensures fair and equitable performance evaluations
   - Reduces unconscious bias in decision-making
   - Supports diversity and inclusion initiatives
   - Improves the quality of feedback and assessments

3. **Employee Wellbeing**
   - Monitors and supports mental health
   - Prevents burnout through early detection
   - Improves work-life balance
   - Increases overall job satisfaction

4. **Team Dynamics**
   - Enhances team cohesion and effectiveness
   - Improves cross-functional collaboration
   - Supports conflict prevention and resolution
   - Builds stronger team relationships

5. **Cultural Development**
   - Reinforces organizational values
   - Supports cultural transformation initiatives
   - Enables recognition of desired behaviors
   - Builds a positive workplace culture

### BEHAVIOURAL ENUMS

### EmotionalState
```prisma
enum EmotionalState {
  ENGAGED
  NEUTRAL
  DISENGAGED
  STRESSED
  ENTHUSIASTIC
  FRUSTRATED
  CHALLENGED
}
```
**Purpose**: Tracks emotional wellbeing and engagement levels of team members.

**Usage Contexts**:
- Engagement pulse checks
- Wellbeing monitoring
- Team climate assessment
- Performance context

**Constraints**:
- Updates require self-assessment
- Regular tracking intervals
- Confidentiality rules apply

**Business Rules**:
- ENGAGED: High motivation and involvement
- STRESSED: Requires immediate attention
- DISENGAGED: Triggers intervention workflow
- CHALLENGED: Positive stress, growth opportunity

### BiasCategory
```prisma
enum BiasCategory {
  RECENCY
  HALO_EFFECT
  SIMILARITY
  CONFIRMATION
  CENTRAL_TENDENCY
  LENIENCY
  SEVERITY
}
```
**Purpose**: Identifies and categorizes potential evaluation biases.

**Usage Contexts**:
- Performance reviews
- Feedback sessions
- Rating calibration
- Training programs

**Constraints**:
- Must provide evidence for bias identification
- Requires mitigation plan
- Regular reviewer training

**Business Rules**:
- RECENCY: Over-emphasis on recent events
- HALO_EFFECT: Overall impression affecting specific ratings
- SIMILARITY: Favoritism based on shared traits
- CONFIRMATION: Seeking evidence that confirms pre-existing beliefs

### RecognitionType
```prisma
enum RecognitionType {
  PEER_APPRECIATION
  MANAGER_RECOGNITION
  ACHIEVEMENT_MILESTONE
  INNOVATION
  COLLABORATION
  MENTORSHIP
  VALUES_DEMONSTRATION
}
```
**Purpose**: Categorizes different forms of recognition and appreciation.

**Usage Contexts**:
- Reward systems
- Cultural reinforcement
- Performance recognition
- Team building

**Constraints**:
- Recognition must include specific evidence
- Value alignment required
- Public visibility options

**Business Rules**:
- Regular distribution across types
- Manager validation for certain types
- Impact documentation required
- Visibility preferences respected

## BEHAVIOURAL MODELS

### EngagementPulse
```prisma
model EngagementPulse {
  id             String          @id @default(cuid())
  teamMemberId   String
  checkType      PulseCheckType
  emotionalState EmotionalState
  score          Int            @db.SmallInt
  comment        String?        @db.Text
  createdAt      DateTime       @default(now())
}
```
**Purpose**: Captures regular feedback on employee engagement and wellbeing.

**Relationships**:
- Many-to-one with TeamMember via `teamMember`

**Constraints**:
- `score`: Range 1-10
- Maximum one pulse per type per week
- Comments required for low scores

**Optional Fields**:
- `comment`: Contextual information
- Emotional state description

**Indexing**:
- Primary key on `id`
- Index on `teamMemberId`
- Index on `checkType`
- Composite index on `[teamMemberId, createdAt]`

**Business Rules**:
- Low scores trigger alerts
- Trend analysis required
- Confidentiality protected
- Response time limits

### PsychologicalSafety
```prisma
model PsychologicalSafety {
  id            String    @id @default(cuid())
  teamId        String
  dimension     String    
  score         Float     @db.Real
  insights      String    @db.Text
  actionItems   String[]
  assessedAt    DateTime
}
```
**Purpose**: Measures and tracks team psychological safety levels.

**Relationships**:
- Many-to-one with GTeam via `team`

**Constraints**:
- `score`: Range 1.0-5.0
- Regular assessment intervals
- Action items required for low scores

**Optional Fields**:
- Detailed insights
- Improvement actions
- Historical trends

**Indexing**:
- Primary key on `id`
- Index on `teamId`
- Index on `assessedAt`
- Composite index on `[teamId, dimension]`

**Business Rules**:
- Minimum assessment frequency
- Confidential reporting
- Required action planning
- Trend monitoring

### Recognition
```prisma
model Recognition {
  id            String          @id @default(cuid())
  giverId       String
  receiverId    String
  type          RecognitionType
  description   String          @db.Text
  impact        String?         @db.Text
  visibility    String[]
  createdAt     DateTime        @default(now())
}
```
**Purpose**: Manages peer and manager recognition systems.

**Relationships**:
- Many-to-one with TeamMember via `giver`
- Many-to-one with TeamMember via `receiver`

**Constraints**:
- Required impact description
- Visibility permissions
- Evidence-based recognition

**Optional Fields**:
- Detailed impact description
- Visibility settings
- Supporting evidence

**Indexing**:
- Primary key on `id`
- Index on `giverId`
- Index on `receiverId`
- Index on `type`

**Business Rules**:
- Visibility respect required
- Manager validation for certain types
- Balance in recognition distribution
- Regular recognition encouragement

### BiasDetection
```prisma
model BiasDetection {
  id               String       @id @default(cuid())
  reviewerId       String      
  subjectId        String      
  biasCategory     BiasCategory
  evidence         String      @db.Text
  mitigationAction String?     @db.Text
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt
}
```
**Purpose**: Identifies and manages potential evaluation biases.

**Relationships**:
- Many-to-one with TeamMember via `reviewer`
- Many-to-one with TeamMember via `subject`

**Constraints**:
- Evidence required for identification
- Mitigation plan required
- Regular review cycles

**Optional Fields**:
- Detailed mitigation plans
- Follow-up actions
- Resolution tracking

**Indexing**:
- Primary key on `id`
- Index on `reviewerId`
- Index on `subjectId`
- Index on `biasCategory`

**Business Rules**:
- Confidential handling
- Required mitigation planning
- Regular bias training
- Impact monitoring

### GrowthMindsetIndicator
```prisma
model GrowthMindsetIndicator {
  id            String    @id @default(cuid())
  teamMemberId  String
  category      String    
  observation   String    @db.Text
  evidence      String    @db.Text
  createdAt     DateTime  @default(now())
}
```
**Purpose**: Tracks indicators of growth mindset development.

**Relationships**:
- Many-to-one with TeamMember via `teamMember`

**Constraints**:
- Evidence-based observations
- Regular assessment cycles
- Category validation

**Optional Fields**:
- Detailed observations
- Supporting evidence
- Development suggestions

**Indexing**:
- Primary key on `id`
- Index on `teamMemberId`
- Index on `category`
- Index on `createdAt`

**Business Rules**:
- Regular assessment required
- Evidence-based recording
- Development focus
- Positive reinforcement

### FeedbackPreference
```prisma
model FeedbackPreference {
  id               String    @id @default(cuid())
  teamMemberId     String
  preferredTime    String[]
  preferredMethod  String
  feedbackFrequency String
  sensitivityAreas String[]
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
}
```
**Purpose**: Manages individual feedback preferences and sensitivities.

**Relationships**:
- Many-to-one with TeamMember via `teamMember`

**Constraints**:
- Valid time preferences
- Approved feedback methods
- Standard frequencies

**Optional Fields**:
- Sensitivity considerations
- Special instructions
- Communication preferences

**Indexing**:
- Primary key on `id`
- Index on `teamMemberId`
- Index on `preferredMethod`

**Business Rules**:
- Regular preference updates
- Preference respect required
- Sensitivity handling
- Accessibility considerations