# Add Feedback Feature - Implementation Instructions

## Overview
I've created a complete "Add Feedback" experience similar to the existing "Score Performance" flow. Users can select a team, team member, and provide feedback through a multi-step modal process.

## Files to Create

### 1. Create feedback state store
Create a new store file: `src/store/feedback-store.ts`
- This manages the feedback state (team selection, member selection, feedback text)
- Provides API interaction functions

### 2. Create feedback components folder
Create a new folder: `app/dashboard/components/feedback/` with these files:

**a. FeedbackModal.tsx**
- Main modal component
- Manages the step flow (team → member → feedback)
- Reuses existing team and member selection components

**b. FeedbackStepInput.tsx**
- Final step where users input feedback
- Shows member avatar and name
- Provides feedback textarea with character counter
- Submit button with loading state

**c. index.ts**
- Export file for cleaner imports

## Integration Steps

### 1. Update app-sidebar.tsx
- Import `useFeedbackStore`
- Add `openFeedbackModal` to wire up the "Add Feedback" button

### 2. Update DashboardLayout.tsx
- Import `useFeedbackStore` and `FeedbackModal`
- Add the `FeedbackModal` component at the bottom alongside `PerformanceRatingModal`
- Update the "Add a Feedback" button in PageHeader (if uncommented) to use `openFeedbackModal`

## Testing Instructions
1. Make sure all files are correctly placed in the appropriate folders
2. Open the application and click on the "Add Feedback" button in the sidebar
3. Verify you can select a team, then a team member
4. Verify you can enter feedback text with a character counter
5. Test the back button navigation between steps
6. Verify the submit button is disabled when no feedback is entered
7. Verify loading state shows during submission

## Folder Structure
```
src/
├── store/
│   └── feedback-store.ts
└── app/
    └── dashboard/
        └── components/
            └── feedback/
                ├── FeedbackModal.tsx
                ├── FeedbackStepInput.tsx
                └── index.ts
```

This implementation provides a clean, reusable pattern that matches your existing application architecture and UI conventions. The feedback flow is independent of the scoring flow but maintains consistent UX patterns.
