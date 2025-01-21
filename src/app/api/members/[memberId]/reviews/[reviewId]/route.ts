// app/api/members/[memberId]/reviews/[reviewId]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, PerformanceReviewResponse } from "@/lib/types/api";
import type { ReviewStatus } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: { memberId: string; reviewId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content, status } = body;

    // Validate status if provided
    if (status && !['DRAFT', 'PUBLISHED', 'ACKNOWLEDGED'].includes(status)) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    const review = await prisma.performanceReview.update({
      where: {
        id: params.reviewId,
        teamMemberId: params.memberId,
      },
      data: {
        content: content?.trim(),
        status: status as ReviewStatus,
      },
      include: {
        teamMember: true,
      },
    });

    return NextResponse.json<ApiResponse<PerformanceReviewResponse>>({
      success: true,
      data: review as PerformanceReviewResponse,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { memberId: string; reviewId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only allow deletion of draft reviews
    const review = await prisma.performanceReview.findUnique({
      where: {
        id: params.reviewId,
        teamMemberId: params.memberId,
      },
    });

    if (!review) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    if (review.status !== 'DRAFT') {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Only draft reviews can be deleted" },
        { status: 400 }
      );
    }

    await prisma.performanceReview.delete({
      where: {
        id: params.reviewId,
      },
    });

    return NextResponse.json<ApiResponse<void>>({
      success: true,
      data: undefined,
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}