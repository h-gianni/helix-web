import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import type { ApiResponse, BusinessActivityResponse } from "@/lib/types/api";

type TransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

async function checkTeamAccess(teamId: string, userId: string) {
  const user = await prisma.appUser.findUnique({
    where: { clerkId: userId },
  });

  if (!user) return false;

  const team = await prisma.gTeam.findFirst({
    where: {
      id: teamId,
      ownerId: user.id,
      deletedAt: null,
    },
  });

  if (team) return true;

  const member = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId: user.id,
      deletedAt: null,
    },
  });

  return !!member;
}

export async function PUT(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check team access
    const hasAccess = await checkTeamAccess(params.teamId, userId);
    if (!hasAccess) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    const { activityIds } = await request.json();

    if (!Array.isArray(activityIds)) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Invalid activity IDs" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx: TransactionClient) => {
      // First verify all activities exist and are accessible
      const activities = await tx.businessActivity.findMany({
        where: {
          id: { in: activityIds },
          deletedAt: null,
        },
        select: { id: true },
      });

      if (activities.length !== activityIds.length) {
        throw new Error("One or more activities not found");
      }

      // Update activities with new team
      await tx.businessActivity.updateMany({
        where: {
          id: { in: activityIds },
          deletedAt: null,
        },
        data: {
          teamId: params.teamId,
          updatedAt: new Date(),
        },
      });
    });

    return NextResponse.json<ApiResponse<void>>({
      success: true,
      data: undefined,
    });
  } catch (error) {
    console.error("Error updating team activities:", error);
    if (error instanceof Error && error.message === "One or more activities not found") {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "One or more activities not found" },
        { status: 404 }
      );
    }
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check team access
    const hasAccess = await checkTeamAccess(params.teamId, userId);
    if (!hasAccess) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    const activities = await prisma.businessActivity.findMany({
      where: {
        teamId: params.teamId,
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
        createdBy: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
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
    console.error("Error fetching team activities:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}