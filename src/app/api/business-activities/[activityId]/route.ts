// app/api/business-activities/[activityId]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, BusinessActivityResponse, JsonValue } from "@/lib/types/api";

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

    const orgActions = await prisma.orgAction.findMany({
      where: {
        teamId,
        deletedAt: null,
      },
      select: {
        id: true,
        actionId: true,
        priority: true,
        status: true,
        dueDate: true,
        teamId: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        customFields: true,
        action: {
          select: {
            id: true,
            name: true,
            description: true,
            impactScale: true,
            category: {
              select: {
                id: true,
                name: true,
                description: true
              }
            }
          }
        },
        team: {
          select: {
            id: true,
            name: true,
          }
        },
        scores: {
          select: {
            id: true,
            value: true,
            teamMemberId: true,
            actionId: true,
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
            scores: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform OrgAction to BusinessActivityResponse
    const businessActivities: any[] = orgActions.map(orgAction => ({
      id: orgAction.id,
      activityId: orgAction.actionId,
      priority: orgAction.priority,
      status: orgAction.status,
      dueDate: orgAction.dueDate,
      teamId: orgAction.teamId,
      createdBy: orgAction.createdBy,
      createdAt: orgAction.createdAt,
      updatedAt: orgAction.updatedAt,
      deletedAt: orgAction.deletedAt,
      customFields: orgAction.customFields as JsonValue | undefined,
      activity: {
        id: orgAction.action.id,
        name: orgAction.action.name,
        description: orgAction.action.description,
        impactScale: orgAction.action.impactScale,
        category: orgAction.action.category
      },
      team: orgAction.team,
      _count: {
        scores: orgAction._count.scores
      }
    }));

    return NextResponse.json<ApiResponse<BusinessActivityResponse[]>>({
      success: true,
      data: businessActivities,
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
    const orgAction = await prisma.orgAction.findUnique({
      where: { id: params.activityId },
      select: { teamId: true },
    });

    if (!orgAction) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Business activity not found" },
        { status: 404 }
      );
    }

    // Check if user has access to the team
    const hasAccess = await checkTeamAccess(orgAction.teamId, userId);
    if (!hasAccess) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status, priority, dueDate } = body;

    // Update the OrgAction with the new data
    const updatedOrgAction = await prisma.orgAction.update({
      where: { id: params.activityId },
      data: {
        status: status,
        priority: priority,
        dueDate: dueDate,
        // Note: We can't update name or description directly as they're part of the Action model
      },
      select: {
        id: true,
        actionId: true,
        priority: true,
        status: true,
        dueDate: true,
        teamId: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        customFields: true,
        action: {
          select: {
            id: true,
            name: true,
            description: true,
            impactScale: true,
            category: {
              select: {
                id: true,
                name: true,
                description: true
              }
            }
          }
        },
        team: {
          select: {
            id: true,
            name: true,
          }
        },
        _count: {
          select: {
            scores: true,
          },
        },
      },
    });

    // Transform to BusinessActivityResponse
    const businessActivity: BusinessActivityResponse = {
      id: updatedOrgAction.id,
      activityId: updatedOrgAction.actionId,
      priority: updatedOrgAction.priority,
      status: updatedOrgAction.status,
      dueDate: updatedOrgAction.dueDate,
      teamId: updatedOrgAction.teamId,
      createdBy: updatedOrgAction.createdBy,
      createdAt: updatedOrgAction.createdAt,
      updatedAt: updatedOrgAction.updatedAt,
      deletedAt: updatedOrgAction.deletedAt,
      customFields: updatedOrgAction.customFields as JsonValue | undefined,
      activity: {
        id: updatedOrgAction.action.id,
        name: updatedOrgAction.action.name,
        description: updatedOrgAction.action.description,
        impactScale: updatedOrgAction.action.impactScale,
        category: updatedOrgAction.action.category
      },
      team: updatedOrgAction.team,
      _count: {
        scores: updatedOrgAction._count.scores
      }
    };

    return NextResponse.json<ApiResponse<BusinessActivityResponse>>({
      success: true,
      data: businessActivity,
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
    const orgAction = await prisma.orgAction.findUnique({
      where: { id: params.activityId },
      select: { teamId: true },
    });

    if (!orgAction) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Business activity not found" },
        { status: 404 }
      );
    }

    // Check if user has access to the team
    const hasAccess = await checkTeamAccess(orgAction.teamId, userId);
    if (!hasAccess) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    // Soft delete instead of hard delete
    await prisma.orgAction.update({
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