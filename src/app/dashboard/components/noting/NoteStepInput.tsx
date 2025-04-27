"use client";

import React from "react";
import { Label } from "@/components/ui/core/Label";
import { Textarea } from "@/components/ui/core/Textarea";
import { Button } from "@/components/ui/core/Button";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { useTeamMembers } from "@/store/note-store";
import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/core/Avatar";
import { Loader } from "@/components/ui/core/Loader";

interface NoteStepInputProps {
  teamId: string;
  memberId: string;
  note: string;
  setNote: (note: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error: Error | null | unknown;
}

export default function NoteStepInput({
  teamId,
  memberId,
  note,
  setNote,
  onSubmit,
  isSubmitting,
  error,
}: NoteStepInputProps) {
  // Fetch member data to display
  const { data: members = [] } = useTeamMembers(teamId);

  // Find the selected member
  const member = members.find((m) => m.id === memberId);

  // Fallback to dummy data if not found
  const memberName =
    member?.user?.name || member?.user?.email || "Selected Member";
  const memberTitle = member?.title || null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="size-16">
            <AvatarFallback>
              {memberName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="display-2">{memberName}</h2>
            {memberTitle && (
              <p className="text-sm text-foreground-weak">{memberTitle}</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto space-y-3">
        <Label htmlFor="note" className="heading-4">
          Your note
        </Label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Share your note about this team member..."
          rows={5}
          maxLength={500}
          className="w-full resize-none"
          disabled={isSubmitting}
        />
        <div className="text-right text-xs text-foreground-weak">
          {note.length} / 500
        </div>

        {/* {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {error instanceof Error ? error.message : "Failed to submit note. Please try again."}
            </AlertDescription>
          </Alert>
        )} */}

        <Button
          variant="primary"
          size="lg"
          className="w-full mt-4"
          onClick={onSubmit}
          disabled={!note.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader size="sm" />
              <span>Submitting...</span>
            </span>
          ) : (
            "Submit note"
          )}
        </Button>
      </div>
    </div>
  );
}