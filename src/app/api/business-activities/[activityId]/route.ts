// app/api/business-activities/[activityId]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, BusinessActivityResponse } from "@/lib/types/api";

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

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const teamId = url.searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Team ID is required" },
        { status: 400 }
      );
    }

    // Check if user has access to the team
    const hasAccess = await checkTeamAccess(teamId, userId);
    if (!hasAccess) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    const activities = await prisma.businessActivity.findMany({
      where: {
        teamId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        priority: true,
        status: true,
        dueDate: true,
        teamId: true,
        createdAt: true,
        updatedAt: true,
        ratings: {
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
          },
        },
        _count: {
          select: {
            ratings: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json<ApiResponse<BusinessActivityResponse[]>>({
      success: true,
      data: activities as BusinessActivityResponse[],
    });
  } catch (error) {
    console.error("Error fetching business activities:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    // First get the activity to check team access
    const activity = await prisma.businessActivity.findUnique({
      where: { id: params.activityId },
      select: { teamId: true },
    });

    if (!activity) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Business activity not found" },
        { status: 404 }
      );
    }

    // Check if user has access to the team
    const hasAccess = await checkTeamAccess(activity.teamId, userId);
    if (!hasAccess) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description } = body;

    const updatedActivity = await prisma.businessActivity.update({
      where: { id: params.activityId },
      data: {
        name: name?.trim(),
        description: description?.trim() || null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        priority: true,
        status: true,
        dueDate: true,
        teamId: true,
        createdAt: true,
        updatedAt: true,
        ratings: {
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
          },
        },
        _count: {
          select: {
            ratings: true,
          },
        },
      },
    });

    return NextResponse.json<ApiResponse<BusinessActivityResponse>>({
      success: true,
      data: updatedActivity as BusinessActivityResponse,
    });
  } catch (error) {
    console.error("Error updating business activity:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // First get the activity to check team access
    const activity = await prisma.businessActivity.findUnique({
      where: { id: params.activityId },
      select: { teamId: true },
    });

    if (!activity) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Business activity not found" },
        { status: 404 }
      );
    }

    // Check if user has access to the team
    const hasAccess = await checkTeamAccess(activity.teamId, userId);
    if (!hasAccess) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    // Soft delete instead of hard delete
    await prisma.businessActivity.update({
      where: { id: params.activityId },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json<ApiResponse<void>>({
      success: true,
      data: undefined,
    });
  } catch (error) {
    console.error("Error deleting business activity:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}