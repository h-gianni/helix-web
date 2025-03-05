// app/api/org-activities/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type {
  ApiResponse,
  BusinessActivityResponse,
   ActivityResponse,
  CreateBusinessActivityInput,
  CreateActivityInput,
  JsonValue,
} from "@/lib/types/api";
import { v4 as uuidv4 } from 'uuid';


// Helper to check team access
async function checkTeamAccess(teamId: string, userId: string) {
  const user = await prisma.appUser.findUnique({
    where: { clerkId: userId },
  });

  if (!user) return false;

  // Check if user is team owner
  const team = await prisma.gTeam.findFirst({
    where: {
      id: teamId,
      ownerId: user.id,
    },
  });

  if (team) return true;

  // If not owner, check if they're a member
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
    const teamId = url.searchParams.get("teamId");

    const activities = await prisma.orgAction.findMany({
      where: teamId ? { 
        teamId,
        deletedAt: null 
      } : { 
        deletedAt: null 
      },
      select: {
        id: true,
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
            scores: true
          }
        }
      },
      orderBy: [
        {
          action: {
            category: {
              name: 'asc'
            }
          }
        },
        { createdAt: 'desc' }
      ],
    });


    const activitiesResponse: ActivityResponse[] = activities.map((businessActivity) => ({
      id: businessActivity.id,
      name: businessActivity.activity.name,
      description: businessActivity.activity.description,
      category: businessActivity.activity.category,
      priority: businessActivity.priority,
      status: businessActivity.status,
      dueDate: businessActivity.dueDate,
      teamId: businessActivity.teamId,
      createdBy: businessActivity.createdBy,
      createdAt: businessActivity.createdAt,
      updatedAt: businessActivity.updatedAt,
      deletedAt: businessActivity.deletedAt,
      customFields: businessActivity.customFields as JsonValue | undefined,
      team: businessActivity.team,
      impactScale: businessActivity.activity.impactScale,
      _count: businessActivity._count
    }));

    return NextResponse.json<ApiResponse<ActivityResponse[]>>({
      success: true,
      data: activitiesResponse,
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: CreateActivityInput = await request.json();
    const { activityId, teamId, priority = "MEDIUM", status = "ACTIVE", dueDate } = body;

    if (!activityId || !teamId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Activity ID and Team ID are required" },
        { status: 400 }
      );
    }

    // If teamId provided, verify access
    if (teamId) {
      const hasAccess = await checkTeamAccess(teamId, userId);
      if (!hasAccess) {
        return NextResponse.json<ApiResponse<never>>(
          { success: false, error: "Access denied" },
          { status: 403 }
        );
      }
    }

    const businessActivity = await prisma.businessActivity.create({
      data: {
        activityId,
        teamId,
        createdBy: userId,
        status,
        priority,
        dueDate,
      },
      select: {
        id: true,
        priority: true,
        status: true,
        dueDate: true,
        teamId: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        customFields: true,
        activity: {
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
            ratings: true
          }
        }
      },
    });

    const businessActivityResponse: BusinessActivityResponse = {
      id: businessActivity.id,
      priority: businessActivity.priority,
      status: businessActivity.status,
      dueDate: businessActivity.dueDate,
      teamId: businessActivity.teamId,
      createdBy: businessActivity.createdBy,
      createdAt: businessActivity.createdAt,
      updatedAt: businessActivity.updatedAt,
      deletedAt: businessActivity.deletedAt,
      customFields: businessActivity.customFields as JsonValue | undefined,
      activity: {
        id: businessActivity.activity.id,
        name: businessActivity.activity.name,
        description: businessActivity.activity.description,
        impactScale: businessActivity.activity.impactScale,
        category: businessActivity.activity.category
      },
      team: businessActivity.team,
      _count: businessActivity._count
    };

    return NextResponse.json<ApiResponse<BusinessActivityResponse>>(
      { success: true, data: businessActivityResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating business activity:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
