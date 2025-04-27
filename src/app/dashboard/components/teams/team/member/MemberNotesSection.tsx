// src/app/dashboard/components/teams/team/member/MemberNotesSection.tsx
"use client";

import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/core/Table";
import { Button } from "@/components/ui/core/Button";
import { Loader } from "@/components/ui/core/Loader";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { NoContentFound } from "@/components/ui/composite/NoContentFound";
import { 
  StickyNote, 
  AlertCircle, 
  RotateCcw,
  CalendarClock,
  BarChart4,
  ClipboardList
} from "lucide-react";
import { format } from "date-fns";
import { StatsCard } from "@/components/ui/composite/StatsCard";

// This would typically come from a store like the other components
interface Note {
  id: string;
  content: string;
  createdAt: string;
  createdBy: {
    name: string;
    email: string;
  };
  // Added type for categorization in stats
  type?: "feedback" | "observation" | "goal" | "other";
}

interface MemberNotesSectionProps {
  teamId: string;
  memberId: string;
  onAddNote: () => void;
}

// Type for the trend to match StatsCard requirements
type TrendType = "up" | "down" | "neutral" | undefined;

// Mock hook for fetching notes - in a real app, this would be a proper data fetching hook
function useMemberNotes({ teamId, memberId }: { teamId: string; memberId: string }) {
  // For demonstration, add some mock data to show the stats
  const mockNotes: Note[] = [
    {
      id: "1",
      content: "Demonstrated strong leadership in the project kickoff meeting.",
      createdAt: "2025-02-15T10:30:00Z",
      createdBy: { name: "Manager Name", email: "manager@example.com" },
      type: "observation"
    },
    {
      id: "2",
      content: "Need to work on timely delivery of status reports.",
      createdAt: "2025-01-10T14:20:00Z",
      createdBy: { name: "Manager Name", email: "manager@example.com" },
      type: "feedback"
    },
    {
      id: "3",
      content: "Set goal: Complete advanced certification by Q3.",
      createdAt: "2024-12-05T09:15:00Z",
      createdBy: { name: "Manager Name", email: "manager@example.com" },
      type: "goal"
    },
    {
      id: "4",
      content: "Excellent presentation to the client team today.",
      createdAt: "2024-11-20T16:45:00Z",
      createdBy: { name: "Manager Name", email: "manager@example.com" },
      type: "feedback"
    },
    {
      id: "5",
      content: "Discussed career aspirations and growth areas.",
      createdAt: "2024-10-15T11:00:00Z",
      createdBy: { name: "Manager Name", email: "manager@example.com" },
      type: "other"
    }
  ];

  return {
    data: { notes: mockNotes },
    isLoading: false,
    error: null as Error | null,
    refetch: () => console.log("Refetching notes"),
  };
}

function MemberNotesSection({ teamId, memberId, onAddNote }: MemberNotesSectionProps) {
  const { data, isLoading, error, refetch } = useMemberNotes({ teamId, memberId });

  // Calculate note statistics from the notes data
  const noteStats = useMemo(() => {
    if (!data?.notes || data.notes.length === 0) {
      return {
        totalNotes: 0,
        last12MonthsNotes: 0,
        lastQuarterNotes: 0,
        currentQuarterNotes: 0,
        quarterlyAverage: 0,
        notesDistribution: {
          feedback: 0,
          observation: 0,
          goal: 0,
          other: 0
        },
        notesTrend: "neutral" as TrendType,
      };
    }

    const now = new Date();
    const last12Months = new Date(now);
    last12Months.setFullYear(now.getFullYear() - 1);
    
    const lastQuarter = new Date(now);
    lastQuarter.setMonth(now.getMonth() - 3);
    
    // Calculate current quarter start date
    const currentQuarter = new Date(now);
    currentQuarter.setMonth(Math.floor(now.getMonth() / 3) * 3, 1);
    currentQuarter.setHours(0, 0, 0, 0);
    
    const notes = data.notes.map(note => ({
      ...note,
      createdDate: new Date(note.createdAt)
    }));
    
    // Filter notes for different time periods
    const notesLast12Months = notes.filter(n => n.createdDate >= last12Months);
    const notesLastQuarter = notes.filter(n => n.createdDate >= lastQuarter);
    const notesCurrentQuarter = notes.filter(n => n.createdDate >= currentQuarter);
    
    // Calculate quarterly average based on last year
    const quarterlyAverage = notesLast12Months.length / 4; // 4 quarters in a year
    
    // Calculate notes distribution by type
    const notesDistribution = {
      feedback: notes.filter(n => n.type === "feedback").length,
      observation: notes.filter(n => n.type === "observation").length,
      goal: notes.filter(n => n.type === "goal").length,
      other: notes.filter(n => n.type === undefined || n.type === "other").length
    };
    
    // Determine trend (simplified calculation for illustration)
    // Compare current quarter with previous quarter
    const previousQuarter = new Date(lastQuarter);
    previousQuarter.setMonth(previousQuarter.getMonth() - 3);
    
    const previousQuarterNotes = notes.filter(
      n => n.createdDate >= previousQuarter && n.createdDate < lastQuarter
    ).length;
    
    let notesTrend: TrendType;
    if (notesLastQuarter.length > previousQuarterNotes) {
      notesTrend = "up";
    } else if (notesLastQuarter.length < previousQuarterNotes) {
      notesTrend = "down";
    } else {
      notesTrend = "neutral";
    }
    
    return {
      totalNotes: notes.length,
      last12MonthsNotes: notesLast12Months.length,
      lastQuarterNotes: notesLastQuarter.length,
      currentQuarterNotes: notesCurrentQuarter.length,
      quarterlyAverage: parseFloat(quarterlyAverage.toFixed(1)),
      notesDistribution,
      notesTrend,
    };
  }, [data?.notes]);

  // Calculate ideal quarterly note frequency (for comparison)
  const idealQuarterlyNotes = 1; // Example: 3 notes per quarter is ideal
  const quarterlyNotesComparison = noteStats.quarterlyAverage >= idealQuarterlyNotes ? 
                                 "On track" : "Below target";
  
  // Ensure quarterly trend is properly typed
  const quarterlyTrend: TrendType = noteStats.quarterlyAverage >= idealQuarterlyNotes ? "up" : "down";

  if (isLoading) {
    return (
      <div className="py-8 flex justify-center">
        <Loader label="Loading notes..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load notes"}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button variant="secondary" onClick={() => refetch()}>
            <RotateCcw className="size-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!data?.notes || data.notes.length === 0) {
    return (
      <NoContentFound
        icon={StickyNote}
        title="No Notes"
        description="There are no notes for this team member. Add a note to keep track of important information, feedback, or observations."
        actionLabel="Add Note"
        onAction={onAddNote}
        variant="section"
        buttonProps={{
          className: "gap-2",
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Card for Notes Metrics */}
      <StatsCard
        items={[
          {
            title: "Total Notes",
            value: noteStats.totalNotes.toString(),
            trendLabel: "All time",
            icon: ClipboardList,
          },
          {
            title: "Last 12 Months",
            value: noteStats.last12MonthsNotes.toString(),
            trend: noteStats.notesTrend,
            trendValue: noteStats.notesTrend === "up" ? "Increasing" : 
                        noteStats.notesTrend === "down" ? "Decreasing" : "Stable",
            icon: CalendarClock,
          },
          {
            title: "Current Quarter",
            value: noteStats.currentQuarterNotes.toString(),
            trendLabel: `of ${idealQuarterlyNotes} target`,
            icon: CalendarClock,
          },
          {
            title: "Quarterly Frequency",
            value: noteStats.quarterlyAverage.toString(),
            trend: quarterlyTrend,
            trendValue: quarterlyNotesComparison,
            trendLabel: `${idealQuarterlyNotes}/quarter ideal`,
            icon: BarChart4,
          },
        ]}
        columns={4}
      />

      <Table>
        {/* <TableHeader>
          <TableRow>
            <TableHead className="w-3/4">Note</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader> */}
        <TableBody>
          {data.notes.map((note) => (
            <TableRow key={note.id}>
              <TableCell className="whitespace-normal break-words">
                {note.content}
              </TableCell>
              <TableCell>
                {format(new Date(note.createdAt), "MMM d, yyyy")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default MemberNotesSection;