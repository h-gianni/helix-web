// src/app/dashboard/components/teams/team/member/GenerateReviewModal.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/core/Dialog";
import { Button } from "@/components/ui/core/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/core/Select";
import { Label } from "@/components/ui/core/Label";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { Loader, AlertCircle, FileText } from "lucide-react";
import { usePerformanceReview } from "@/store/performence-review-store";
import MarkdownRenderer from "@/components/ui/core/MarkdownRenderer";

interface GenerateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  memberId: string;
  memberName: string;
}

export function GenerateReviewModal({
  isOpen,
  onClose,
  teamId,
  memberId,
  memberName,
}: GenerateReviewModalProps) {
  const [quarter, setQuarter] = useState<number>(getCurrentQuarter());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<"form" | "preview">("form");
  const [generatedReview, setGeneratedReview] = useState<string | null>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);

  const { data: reviewData, mutateAsync: generateReview, isPending, error } = usePerformanceReview();

  // Calculate current quarter (1-4)
  function getCurrentQuarter(): number {
    const month = new Date().getMonth();
    return Math.floor(month / 3) + 1;
  }

  // Generate available quarters for the select dropdown
  const quarters = [1, 2, 3, 4];
  
  // Generate years options (current year and previous year)
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  const handleGenerate = async () => {
    const content = reviewData?.content || "";
    console.log("Generated review:", content);
    try {
      const result = await generateReview({
        memberId,
        teamId,
        quarter,
        year,
        content
      });

     
      
      setGeneratedReview(result.content);
      setReviewId(result.id);
      setViewMode("preview");
    } catch (err) {
      console.error("Failed to generate review:", err);
      // Error already handled by the hook
    }
  };

  const handleClose = () => {
    setViewMode("form");
    setGeneratedReview(null);
    onClose();
  };

  const handleEditReview = () => {
    if (reviewId) {
      // Navigate to the edit page
      window.location.href = `/dashboard/teams/${teamId}/members/${memberId}/reviews/${reviewId}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {viewMode === "form"
              ? `Generate Performance Review for ${memberName}`
              : `Q${quarter} ${year} Performance Review for ${memberName}`}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-1">
          {viewMode === "form" ? (
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertDescription>{error.toString()}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quarter</Label>
                  <Select value={quarter.toString()} onValueChange={(value) => setQuarter(Number(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quarter" />
                    </SelectTrigger>
                    <SelectContent>
                      {quarters.map((q) => (
                        <SelectItem key={q} value={q.toString()}>
                          Q{q}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select value={year.toString()} onValueChange={(value) => setYear(Number(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Alert>
                <FileText className="size-4" />
                <AlertDescription>
                  The AI-generated review will be based on the member's performance ratings, 
                  feedback, and comments. The review will be created as a draft that you can 
                  edit before finalizing.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="prose max-w-none dark:prose-invert mt-4">
              {generatedReview ? (
                <div className="p-4 border rounded-lg">
                  <MarkdownRenderer content={generatedReview} />
                </div>
              ) : (
                <div className="flex justify-center my-8">
                  <Loader className="size-8 animate-spin" />
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="pt-4">
          {viewMode === "form" ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleGenerate} 
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader className="size-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Review"
                )}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setViewMode("form")}>
                Back
              </Button>
              <Button onClick={handleEditReview}>
                Edit Review
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}