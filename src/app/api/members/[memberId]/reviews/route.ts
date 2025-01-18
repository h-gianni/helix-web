// app/api/members/[memberId]/reviews/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, PerformanceReviewResponse } from "@/lib/types/api";
import type { ReviewStatus } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get URL parameters for filtering
    const url = new URL(request.url);
    const year = url.searchParams.get("year");
    const quarter = url.searchParams.get("quarter");
    const status = url.searchParams.get("status") as ReviewStatus | null;

    // Build where clause
    const whereClause: any = {
      memberId: params.memberId,
      ...(year && { year: parseInt(year) }),
      ...(quarter && { quarter: parseInt(quarter) }),
      ...(status && { status }),
    };

    const reviews = await prisma.performanceReview.findMany({
      where: whereClause,
      include: {
        member: true,
      },
      orderBy: [
        { year: 'desc' },
        { quarter: 'desc' },
      ],
    });

    return NextResponse.json<ApiResponse<PerformanceReviewResponse[]>>({
      success: true,
      data: reviews as PerformanceReviewResponse[],
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { memberId: string } }
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
    const { quarter, year, content } = body;

    if (!quarter || !year || !content) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Quarter, year, and content are required" },
        { status: 400 }
      );
    }

    if (quarter < 1 || quarter > 4) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Quarter must be between 1 and 4" },
        { status: 400 }
      );
    }

    // Check for existing review
    const existingReview = await prisma.performanceReview.findFirst({
      where: {
        memberId: params.memberId,
        quarter,
        year,
      },
    });

    if (existingReview) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Review already exists for this quarter" },
        { status: 400 }
      );
    }

    // Create review
    const review = await prisma.performanceReview.create({
      data: {
        memberId: params.memberId,
        quarter,
        year,
        content,
        status: 'DRAFT',
      },
      include: {
        member: true,
      },
    });

    return NextResponse.json<ApiResponse<PerformanceReviewResponse>>(
      { success: true, data: review as PerformanceReviewResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}