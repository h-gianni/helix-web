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

    await prisma.$transaction(async (tx) => {
      // Get all activities currently associated with this team
      const currentActivities = await tx.businessActivity.findMany({
        where: {
          teamId: params.teamId,
          deletedAt: null,
        },
        select: { id: true },
      });

      const currentActivityIds = currentActivities.map(a => a.id);
      
      // Find activities to reassign to this team
      for (const activityId of activityIds) {
        await tx.businessActivity.update({
          where: { id: activityId },
          data: { 
            teamId: params.teamId,
            updatedAt: new Date()
          },
        });
      }

      // Find activities to remove from this team
      const activitiesToRemove = currentActivityIds.filter(
        id => !activityIds.includes(id)
      );

      // First, find an available team to reassign to
      if (activitiesToRemove.length > 0) {
        const availableTeam = await tx.gTeam.findFirst({
          where: {
            NOT: { id: params.teamId },
            deletedAt: null,
          },
          select: { id: true },
        });

        // Update activities to be assigned to another team
        if (availableTeam) {
          await tx.businessActivity.updateMany({
            where: {
              id: { in: activitiesToRemove },
              teamId: params.teamId,
            },
            data: {
              teamId: availableTeam.id,
              updatedAt: new Date(),
            },
          });
        }
      }
    });

    return NextResponse.json<ApiResponse<void>>({
      success: true,
      data: undefined,
    });
  } catch (error) {
    console.error("Error updating team activities:", error);
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

    const hasAccess = await checkTeamAccess(params.teamId, userId);
    if (!hasAccess) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    console.log("Fetching activities for team:", params.teamId); // Debug log

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
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        _count: {
          select: {
            ratings: true,
          },
        },
      },
    });

    console.log("Found activities:", activities); // Debug log

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