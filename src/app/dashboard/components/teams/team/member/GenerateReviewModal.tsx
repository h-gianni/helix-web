"use client";

import React, { useState } from "react";
import { useGenerateReview, useReview, getDataSufficiencyMessage, ReviewRequest } from "@/store/review-store-new";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/core/Card";
import { Button } from "@/components/ui/core/Button";
import { Loader, AlertCircle, CheckCircle, ChartNoAxesCombined } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/core/Alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/core/Select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/core/Dialog";
import ReactMarkdown from "react-markdown";

interface GenerateReviewProps {
  teamId: string;
  memberId: string;
  memberName: string;
}

export function GenerateReviewModal({ teamId, memberId, memberName }: GenerateReviewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [reviewOptions, setReviewOptions] = useState<ReviewRequest>({
    period: "quarter",
    quarterNumber: getCurrentQuarter(),
    year: new Date().getFullYear(),
  });
  const [reviewContent, setReviewContent] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<any | null>(null);
  
  const generateReview = useGenerateReview();
  
  const handleGenerateReview = async () => {
    setIsOptionsModalOpen(false);
    setIsModalOpen(true);
    
    try {
      const result = await generateReview.mutateAsync({
        memberId,
        options: reviewOptions,
      });
      
      if (result.data?.review) {
        setReviewContent(result.data.review.content);
        setAnalysisData(result.data.analysis);
      }
    } catch (error) {
      console.error("Error generating review:", error);
      // Error will be available in the mutation state
    }
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setReviewContent(null);
    setAnalysisData(null);
  };

  return (
    <>
      <Button
        onClick={() => setIsOptionsModalOpen(true)}
        variant="default"
        className="flex items-center gap-2"
      >
        <ChartNoAxesCombined className="size-4" />
        Generate Performance Review
      </Button>

      {/* Options Modal */}
      <Dialog open={isOptionsModalOpen} onOpenChange={setIsOptionsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Performance Review</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">Review Period</label>
              <div className="col-span-3">
                <Select
                  value={reviewOptions.period}
                  onValueChange={(value) => setReviewOptions({
                    ...reviewOptions,
                    period: value as 'quarter' | 'year' | 'custom'
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quarter">Quarterly</SelectItem>
                    <SelectItem value="year">Annual</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {reviewOptions.period === 'quarter' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right">Quarter</label>
                  <div className="col-span-3">
                    <Select
                      value={String(reviewOptions.quarterNumber)}
                      onValueChange={(value) => setReviewOptions({
                        ...reviewOptions,
                        quarterNumber: parseInt(value)
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select quarter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Q1</SelectItem>
                        <SelectItem value="2">Q2</SelectItem>
                        <SelectItem value="3">Q3</SelectItem>
                        <SelectItem value="4">Q4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right">Year</label>
                  <div className="col-span-3">
                    <Select
                      value={String(reviewOptions.year)}
                      onValueChange={(value) => setReviewOptions({
                        ...reviewOptions,
                        year: parseInt(value)
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(5)].map((_, i) => {
                          const year = new Date().getFullYear() - 2 + i;
                          return (
                            <SelectItem key={year} value={String(year)}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
            
            {reviewOptions.period === 'year' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right">Year</label>
                <div className="col-span-3">
                  <Select
                    value={String(reviewOptions.year)}
                    onValueChange={(value) => setReviewOptions({
                      ...reviewOptions,
                      year: parseInt(value)
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(5)].map((_, i) => {
                        const year = new Date().getFullYear() - 2 + i;
                        return (
                          <SelectItem key={year} value={String(year)}>
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            {/* Custom date range would be added here */}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOptionsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateReview} disabled={generateReview.isPending}>
              Generate Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Performance Review for {memberName}
            </DialogTitle>
          </DialogHeader>
          
          {generateReview.isPending && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader className="size-12 animate-spin text-primary" />
              <p className="text-lg font-medium">Generating Review...</p>
              <p className="text-sm text-muted-foreground">
                This may take a moment as we analyze performance data and generate insights.
              </p>
            </div>
          )}
          
          {generateReview.isError && (
            <div className="py-6">
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>Error Generating Review</AlertTitle>
                <AlertDescription>
                  {generateReview.error instanceof Error 
                    ? generateReview.error.message 
                    : "Failed to generate review"}
                </AlertDescription>
              </Alert>
              
              {generateReview.error instanceof Error && 
               generateReview.error.message.includes('Insufficient data') && (
                <div className="mt-4 space-y-4">
                  <p className="text-sm">
                    We don't have enough data to generate a comprehensive review. 
                    Additional performance ratings are needed to provide a fair assessment.
                  </p>
                  
                  <div className="p-4 border rounded-md bg-muted">
                    <h3 className="font-medium mb-2">Suggestions:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Score more activities for this team member</li>
                      <li>Ensure ratings span different categories (technical skills, behavioral competencies, etc.)</li>
                      <li>Provide specific feedback on strengths and areas for improvement</li>
                      <li>Encourage peers to contribute ratings and feedback</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {reviewContent && !generateReview.isPending && (
            <div className="prose prose-sm max-w-none py-4">
              <ReactMarkdown>
                {reviewContent}
              </ReactMarkdown>
            </div>
          )}
          
          <DialogFooter>
            {reviewContent && !generateReview.isPending && (
              <>
                <Button variant="outline" onClick={handleCloseModal}>
                  Close
                </Button>
                <Button onClick={() => window.print()}>
                  Print / Export
                </Button>
              </>
            )}
            
            {generateReview.isError && (
              <Button variant="outline" onClick={handleCloseModal}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Helper to get current quarter (1-4)
function getCurrentQuarter(): number {
  const month = new Date().getMonth();
  return Math.floor(month / 3) + 1;
}

// Component for showing review details when they are loaded from the database
export function ReviewDetails({ reviewId }: { reviewId: string }) {
  const { data: review, isLoading, error } = useReview(reviewId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 space-x-2">
        <Loader className="size-4 animate-spin" />
        <span>Loading review...</span>
      </div>
    );
  }

  if (error || !review) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertDescription>
          {error instanceof Error ? error.message : "Failed to load review"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Review</CardTitle>
        <CardDescription>
          Generated on {new Date(review.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{review.content}</ReactMarkdown>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Version: {review.version}
        </p>
        <Button onClick={() => window.print()}>Print / Export</Button>
      </CardFooter>
    </Card>
  );
}