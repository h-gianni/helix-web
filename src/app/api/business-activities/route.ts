// app/api/business-activities/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type {
  ApiResponse,
  BusinessActivityResponse as ActivityResponse,
  CreateBusinessActivityInput as CreateActivityInput,
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

    // Modify query to include null teamId or matching teamId
    const activities = await prisma.businessActivity.findMany({
      where: teamId ? { teamId } : {},  
       
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
        customFields: true,
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const activitiesResponses: ActivityResponse[] = activities.map((activities) => ({
      ...activities,
      customFields: activities.customFields as JsonValue | undefined,
    }));
    
    return NextResponse.json<ApiResponse<ActivityResponse[]>>({
      success: true,
      data: activitiesResponses,
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
    const { name, description, teamId } = body;

    if (!name?.trim()) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Activities name is required" },
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

    const activities = await prisma.businessActivity.create({
      data: {
        activityId: uuidv4(),
        name: name.trim(),
        description: description?.trim() || null,
        teamId,
        createdBy: userId,
        status: "ACTIVE",
        priority: "MEDIUM"
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
        customFields: true,
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    const activitiesResponse: ActivityResponse = {
      ...activities,
      customFields: activities.customFields as JsonValue | undefined,
    };

    return NextResponse.json<ApiResponse<ActivityResponse>>(
      { success: true, data: activitiesResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating activities:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
