// src/app/dashboard/teams/[teamId]/members/[memberId]/reviews/[reviewId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageBreadcrumbs } from "@/components/ui/composite/AppHeader";
import { PageHeader } from "@/components/ui/composite/PageHeader";
import { Button } from "@/components/ui/core/Button";
import { Loader } from "@/components/ui/core/Loader";
import { Textarea } from "@/components/ui/core/Textarea";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { Badge } from "@/components/ui/core/Badge";
import {
  ArrowLeft,
  Save,
  EyeIcon,
  EditIcon,
  SendIcon,
  AlertCircle,
  CheckIcon,
  FileIcon,
} from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/core/Tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/Card";
import MarkdownRenderer from "@/components/ui/core/MarkdownRenderer";
import { 
  useReview, 
  useUpdateReview, 
  usePublishReview 
} from "@/store/review-store";
import { useMemberDetails } from "@/store/member-store";

export default function ReviewPage() {
  const params = useParams() as {
    teamId: string;
    memberId: string;
    reviewId: string;
  };
  const router = useRouter();
  
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [editContent, setEditContent] = useState("");
  const [isSaved, setIsSaved] = useState(true);
  
  const { data: review, isLoading: isReviewLoading, error: reviewError } = useReview(params.reviewId);
  const { data: member, isLoading: isMemberLoading } = useMemberDetails({
    teamId: params.teamId,
    memberId: params.memberId,
  });
  
  const updateReview = useUpdateReview();
  const publishReview = usePublishReview();
  
  // Set initial edit content when review is loaded
  useEffect(() => {
    if (review) {
      setEditContent(review.content);
    }
  }, [review]);
  
  // Check if content has been changed
  useEffect(() => {
    if (review) {
      setIsSaved(review.content === editContent);
    }
  }, [review, editContent]);
  
  const handleSave = async () => {
    if (!review) return;
    
    try {
      await updateReview.mutateAsync({
        reviewId: review.id,
        content: editContent,
      });
      setIsSaved(true);
    } catch (err) {
      console.error("Failed to save review:", err);
    }
  };
  
  const handlePublish = async () => {
    if (!review) return;
    
    try {
      // First save any pending changes
      if (!isSaved) {
        await updateReview.mutateAsync({
          reviewId: review.id,
          content: editContent,
        });
      }
      
      // Then publish the review
      await publishReview.mutateAsync(review.id);
      
      // Switch to view mode
      setMode("view");
    } catch (err) {
      console.error("Failed to publish review:", err);
    }
  };
  
  const isLoading = isReviewLoading || isMemberLoading;
  const error = reviewError;
  
  const memberName = member
    ? member.firstName && member.lastName
      ? `${member.firstName} ${member.lastName}`
      : member.user.email
    : "Team Member";
  
  const breadcrumbItems = [
    { href: "/dashboard/teams", label: "Teams" },
    {
      href: `/dashboard/teams/${params.teamId}`,
      label: member?.team?.name || "Team",
    },
    {
      href: `/dashboard/teams/${params.teamId}/members/${params.memberId}`,
      label: memberName,
    },
    {
      label: review ? `Q${review.quarter} ${review.year} Review` : "Performance Review",
    },
  ];
  
  if (isLoading) {
    return (
      <div className="loader">
        <Loader size="base" label="Loading..." />
      </div>
    );
  }
  
  if (error || !review) {
    return (
      <div className="ui-loader-error">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Review not found"}
          </AlertDescription>
        </Alert>
        <Button
          variant="secondary"
          onClick={() => router.push(`/dashboard/teams/${params.teamId}/members/${params.memberId}`)}
          className="mt-4"
        >
          <ArrowLeft className="size-4 mr-2" /> Back to Member
        </Button>
      </div>
    );
  }
  
  const isDraft = review.status === "DRAFT";
  const isPublished = review.status === "PUBLISHED";
  const isAcknowledged = review.status === "ACKNOWLEDGED";
  
  return (
    <>
      <PageBreadcrumbs items={breadcrumbItems} />
      <PageHeader
        title={`Q${review.quarter} ${review.year} Performance Review`}
        backButton={{
          onClick: () => router.push(`/dashboard/teams/${params.teamId}/members/${params.memberId}`),
        }}
        actions={
          <>
            {isDraft && mode === "view" && (
              <Button variant="secondary" onClick={() => setMode("edit")}>
                <EditIcon className="size-4 mr-2" /> Edit
              </Button>
            )}
            
            {mode === "edit" && (
              <Button variant="secondary" onClick={() => setMode("view")}>
                <EyeIcon className="size-4 mr-2" /> Preview
              </Button>
            )}
            
            {isDraft && (
              <Button 
                onClick={handlePublish}
                disabled={updateReview.isPending || publishReview.isPending || (mode === "edit" && !isSaved)}
              >
                <SendIcon className="size-4 mr-2" /> Publish
              </Button>
            )}
          </>
        }
      />
      
      <main className="layout-page-main">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Performance Review 
                    <Badge 
                    //   variant={
                    //     isDraft ? "secondary" : 
                    //     isPublished ? "success" : 
                    //     "primary"
                    //   }
                    >
                      {isDraft ? "Draft" : isPublished ? "Published" : "Acknowledged"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    For {memberName} • Q{review.quarter} {review.year} • v{review.version}
                  </CardDescription>
                </div>
                
                <div>
                  {mode === "edit" && (
                    <Button 
                    //   variant="primary"
                      onClick={handleSave}
                      disabled={updateReview.isPending || isSaved}
                    >
                      {updateReview.isPending ? (
                        <>
                          <Loader className="size-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="size-4 mr-2" />
                          Save
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {mode === "view" ? (
                <div className="py-2">
                  <MarkdownRenderer content={review.content} />
                </div>
              ) : (
                <div className="space-y-4">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[500px] font-mono"
                  />
                  
                  {!isSaved && (
                    <div className="flex justify-end">
                      <span className="text-sm text-muted-foreground">
                        Unsaved changes
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                {isPublished && (
                  <>
                    Published on {new Date(review.updatedAt).toLocaleDateString()}
                  </>
                )}
                {isAcknowledged && (
                  <>
                    Acknowledged by {memberName} on {new Date(review.updatedAt).toLocaleDateString()}
                  </>
                )}
              </div>
              
              {mode === "edit" && (
                <Button 
                //   variant="primary"
                  onClick={handleSave}
                  disabled={updateReview.isPending || isSaved}
                >
                  {updateReview.isPending ? (
                    <>
                      <Loader className="size-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="size-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  );
}