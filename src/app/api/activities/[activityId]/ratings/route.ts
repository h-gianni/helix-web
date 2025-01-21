// app/api/activities/[activityId]/ratings/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/lib/types/api";

export async function GET(
  request: Request,
  { params }: { params: { activityId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.appUser.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Get URL parameters
    const url = new URL(request.url);
    const memberId = url.searchParams.get("memberId");
    const teamId = url.searchParams.get("teamId");

    // Build the where clause
    const whereClause = {
      activityId: params.activityId,
      ...(memberId && { memberId }),
      ...(teamId && { member: { teamId } }),
    };

    const ratings = await prisma.memberRating.findMany({
      where: whereClause,
      include: {
        teamMember: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate statistics
    const stats = {
      totalRatings: ratings.length,
      averageValue: ratings.length > 0
        ? ratings.reduce((acc, curr) => acc + curr.value, 0) / ratings.length
        : 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        ratings,
        stats,
      },
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { activityId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.appUser.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { memberId, value } = body;

    if (!memberId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Member ID is required" },
        { status: 400 }
      );
    }

    if (typeof value !== 'number' || value < 1 || value > 5) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Rating value must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if activity exists
    const activity = await prisma.businessActivity.findUnique({
      where: { id: params.activityId },
    });

    if (!activity) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Activity not found" },
        { status: 404 }
      );
    }

    // Create rating
    const rating = await prisma.memberRating.create({
      data: {
        value,
        teamMemberId: memberId,
        activityId: params.activityId,
      },
      include: {
        teamMember: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, data: rating },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating rating:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}