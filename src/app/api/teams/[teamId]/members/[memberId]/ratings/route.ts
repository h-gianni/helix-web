// app/api/teams/[teamId]/members/[memberId]/ratings/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, RatingResponse } from "@/lib/types/api";

async function checkTeamAccess(teamId: string, userId: string) {
  const user = await prisma.appUser.findUnique({
    where: { clerkId: userId },
  });

  if (!user) return false;

  const team = await prisma.gTeam.findFirst({
    where: {
      id: teamId,
      ownerId: user.id,
    },
  });

  if (team) return true;

  const member = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId: user.id,
    },
  });

  return !!member;
}

async function validateActivity(teamId: string, activityId: string) {
  const businessActivity = await prisma.businessActivity.findFirst({
    where: {
      id: activityId,
      teamId: teamId,
    },
  });

  return !!businessActivity;
}

export async function GET(
  request: Request,
  { params }: { params: { teamId: string; memberId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const hasAccess = await checkTeamAccess(params.teamId, userId);
    if (!hasAccess) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const activityId = url.searchParams.get("activityId");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const page = parseInt(url.searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const where = {
      teamMemberId: params.memberId,
      ...(activityId ? { activityId } : {}),
    };

    const [ratings, total] = await Promise.all([
      prisma.memberRating.findMany({
        where,
        select: {
          id: true,
          value: true,
          teamMemberId: true,
          activityId: true,
          createdAt: true,
          updatedAt: true,
          teamMember: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                },
              },
            },
          },
          activity: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.memberRating.count({ where }),
    ]);

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        ratings: ratings as RatingResponse[],
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          current: page,
          limit,
        },
        stats: {
          average: averageRating,
          count: total,
        },
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
  { params }: { params: { teamId: string; memberId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const hasAccess = await checkTeamAccess(params.teamId, userId);
    if (!hasAccess) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { activityId, value } = body;

    // Validate activity association
    const isValidActivity = await validateActivity(params.teamId, activityId);

    if (!isValidActivity) {
      const activityExists = await prisma.businessActivity.findUnique({
        where: { id: activityId },
      });

      if (!activityExists) {
        return NextResponse.json<ApiResponse<never>>(
          { success: false, error: "Activity not found" },
          { status: 404 }
        );
      }

      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Activity is not associated with this team",
        },
        { status: 400 }
      );
    }

    // Create the rating
    const rating = await prisma.memberRating.create({
      data: {
        teamMemberId: params.memberId,
        activityId,
        value,
      },
      select: {
        id: true,
        value: true,
        teamMemberId: true,
        activityId: true,
        createdAt: true,
        updatedAt: true,
        teamMember: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        activity: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return NextResponse.json<ApiResponse<RatingResponse>>(
      { success: true, data: rating as RatingResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving rating:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}