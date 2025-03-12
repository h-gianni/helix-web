import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, BusinessActivityResponse } from "@/lib/types/api";
import { withErrorHandler } from '@/lib/api/error-handler';

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

type RouteContext = {
  params: Record<string, string>;
};

export const GET = withErrorHandler(async (
  request: Request,
  context: RouteContext
) => {
  const teamId = context.params.teamId;
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const hasAccess = await checkTeamAccess(teamId, userId);
  if (!hasAccess) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Access denied" },
      { status: 403 }
    );
  }

  const activities = await prisma.orgAction.findMany({
    where: {
      teamId: teamId,
      deletedAt: null,
    },
    include: {
      team: true,
      action: {
        include: {
          category: true  // Include the action category details if needed
        }
      },
      user: true,  // Include the user who created the action
      _count: {
        select: {
          scores: true,
        },
      },
    },
  });

  // Transform the response to include action details
  const transformedActivities = activities.map(activity => ({
    id: activity.id,
    name: activity.action.name,
    description: activity.action.description,
    category: activity.action.category?.name || '',
    impactScale: activity.action.impactScale,
    priority: activity.priority,
    status: activity.status,
    dueDate: activity.dueDate,
    teamId: activity.teamId,
    teamName: activity.team.name,
    createdAt: activity.createdAt,
    updatedAt: activity.updatedAt,
    deletedAt: activity.deletedAt,
    ratingsCount: activity._count.scores,
    addedAt: activity.createdAt,
    createdBy: activity.createdBy,
    createdByName: activity.user?.name || '',
    actionId: activity.actionId,
  }));


  return NextResponse.json({
    success: true,
    data: transformedActivities,
  });
});


export const PUT = withErrorHandler(async (
  request: Request,
  context: RouteContext
) => {
  const teamId = context.params.teamId;
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const hasAccess = await checkTeamAccess(teamId, userId);
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
    // Mark all existing activities as deleted
    await tx.businessActivity.updateMany({
      where: {
        teamId: teamId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    // Create or restore activities for the team
    for (const activityId of activityIds) {
      await tx.businessActivity.upsert({
        where: {
          id: activityId,
        },
        create: {
          id: activityId,
          teamId: teamId,
          name: "New Activity",
          activityId: activityId,
          createdBy: userId,
          status: 'ACTIVE',
          priority: 'MEDIUM',
        },
        update: {
          deletedAt: null,
          teamId: teamId,
        },
      });
    }
  });

  // Fetch and return the updated activities in the old format
  const updatedActivities = await prisma.businessActivity.findMany({
    where: {
      teamId: teamId,
      deletedAt: null,
    },
    include: {
      team: true,
    },
  });

  const transformedActivities = updatedActivities.map(activity => ({
    id: activity.id,
    name: activity.name,
    description: activity.description,
    category: activity.category || '',
    priority: activity.priority,
    status: activity.status,
    teamId: activity.teamId,
    addedAt: activity.createdAt,
    createdBy: activity.createdBy,
  }));

  return NextResponse.json({
    success: true,
    data: transformedActivities,
  });
});