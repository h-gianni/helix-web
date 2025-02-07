// app/api/teams/[teamId]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type {
  ApiResponse,
  JsonValue,
  TeamDetailsResponse,
  TeamResponse,
  TransactionClient,
} from "@/lib/types/api";

// Helper to check if user is team owner
async function isTeamOwner(clerkId: string, teamId: string) {
  const user = await prisma.appUser.findUnique({
    where: { clerkId },
  });

  if (!user) return false;

  const team = await prisma.gTeam.findFirst({
    where: {
      id: teamId,
      ownerId: user.id,
      deletedAt: null,
    },
  });

  return !!team;
}

// Helper to check if user has access to team
async function checkTeamAccess(teamId: string, userId: string) {
  // First check if user exists and not deleted
  const user = await prisma.appUser.findUnique({
    where: { 
      clerkId: userId,
      deletedAt: null
    },
  });

  if (!user) return false;

  // Check if user is team owner first
  const team = await prisma.gTeam.findFirst({
    where: {
      id: teamId,
      ownerId: user.id,
      deletedAt: null,
    },
  });

  if (team) return true; // Owner always has access

  // If not owner, check if they're a member
  const member = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId: user.id,
      deletedAt: null,
      team: {
        deletedAt: null
      }
    },
  });

  return !!member;
}

export const GET = async (
  request: Request,
  { params }: { params: { teamId: string } }
) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Check if user is owner or has team access
    const hasAccess = await checkTeamAccess(params.teamId, userId);
    if (!hasAccess) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Access denied",
        },
        { status: 403 }
      );
    }

    const team = await prisma.gTeam.findUnique({
      where: { 
        id: params.teamId,
        deletedAt: null
      },
      include: {
        teamFunction: {
          include: {
            jobTitles: {
              where: {
                deletedAt: null
              }
            },
          }
        },
        teamMembers: {
          where: {
            deletedAt: null
          },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
            jobGrade: true,
            ratings: {
              include: {
                activity: true,
              },
            },
          },
        },
        activities: {
          where: {
            deletedAt: null
          },
          include: {
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
        },
      },
    });

    if (!team) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Team not found",
        },
        { status: 404 }
      );
    }

    // Transform the data to match TeamDetailsResponse type
    const transformedTeam: TeamDetailsResponse = {
      id: team.id,
      name: team.name,
      description: team.description,
      teamFunctionId: team.teamFunctionId,
      ownerId: team.ownerId,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
      deletedAt: team.deletedAt,
      customFields: team.customFields as JsonValue | undefined,
      members: team.teamMembers.map((member) => ({
        id: member.id,
        userId: member.userId,
        teamId: member.teamId,
        title: member.title,
        isAdmin: member.isAdmin,
        status: member.status,
        firstName: member.firstName,
        lastName: member.lastName,
        photoUrl: member.photoUrl,
        joinedDate: member.joinedDate,
        jobGradeId: member.jobGradeId,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
        deletedAt: member.deletedAt,
        customFields: member.customFields as JsonValue | undefined,  // Explicitly handle undefined
        user: {
          id: member.user.id,
          email: member.user.email,
          name: member.user.name,
        },
      })),
      businessActivities: team.activities.map((activity) => ({
        id: activity.id,
        name: activity.name,
        description: activity.description,
        category: activity.category,
        priority: activity.priority,
        status: activity.status,
        dueDate: activity.dueDate,
        teamId: activity.teamId,
        createdBy: activity.createdBy,
        createdAt: activity.createdAt,
        updatedAt: activity.updatedAt,
        deletedAt: activity.deletedAt,
        customFields: activity.customFields as JsonValue | undefined,  // Explicitly handle undefined
        // _count: activity._count.ratings ? activity._count.ratings :  undefined,
      })),
    };
    return NextResponse.json<ApiResponse<TeamDetailsResponse>>({
      success: true,
      data: transformedTeam,
    });
  } catch (error) {
    console.error("Error fetching team details:", error);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
};

export async function PATCH(
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

    // Check if user is owner
    const isOwner = await isTeamOwner(userId, params.teamId);
    if (!isOwner) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Only team owners can update team details" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name?.trim()) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Team name is required" },
        { status: 400 }
      );
    }

    const team = await prisma.gTeam.update({
      where: { id: params.teamId },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
      include: {
        teamFunction: {
          include: {
            jobTitles: {
              where: {
                deletedAt: null
              }
            },
          }
        },
      },
    });

    return NextResponse.json<ApiResponse<TeamResponse>>({
      success: true,
      data: {
        id: team.id,
        name: team.name,
        description: team.description,
        
        teamFunctionId: team.teamFunctionId,
        // businessFunction: {
        //   id: team.teamFunction.id,
        //   name: team.teamFunction.name,
        //   description: team.teamFunction.description,
        //   jobTitles: team.teamFunction.jobTitles,
        //   createdAt: team.teamFunction.createdAt,
        //   updatedAt: team.teamFunction.updatedAt,
        //    customFields: team.customFields as JsonValue | undefined,
        // },
        ownerId: team.ownerId,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating team:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const DELETE = async (
  request: Request,
  { params }: { params: { teamId: string } }
) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Check if user is the team owner
    const isOwner = await isTeamOwner(userId, params.teamId);
    if (!isOwner) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Only team owners can delete teams",
        },
        { status: 403 }
      );
    }

    const now = new Date();

    // Soft delete all related records in a transaction
    await prisma.$transaction(async (tx: TransactionClient) => {
      // Soft delete all ratings for this team's members
      await tx.memberRating.updateMany({
        where: {
          teamMember: {
            teamId: params.teamId,
          },
        },
        data: {
          deletedAt: now,
        },
      });

      // Soft delete all structured feedback
      await tx.structuredFeedback.updateMany({
        where: {
          teamMember: {
            teamId: params.teamId,
          },
        },
        data: {
          deletedAt: now,
        },
      });

      // Soft delete all comments
      await tx.memberComment.updateMany({
        where: {
          teamMember: {
            teamId: params.teamId,
          },
        },
        data: {
          deletedAt: now,
        },
      });

      // Soft delete all performance reviews
      await tx.performanceReview.updateMany({
        where: {
          teamMember: {
            teamId: params.teamId,
          },
        },
        data: {
          deletedAt: now,
        },
      });

      // Soft delete all members
      await tx.teamMember.updateMany({
        where: {
          teamId: params.teamId,
        },
        data: {
          deletedAt: now,
        },
      });

      // Soft delete activities for this team
      await tx.businessActivity.updateMany({
        where: {
          teamId: params.teamId,
        },
        data: {
          deletedAt: now,
        },
      });

      // Finally, soft delete the team
      await tx.gTeam.update({
        where: {
          id: params.teamId,
        },
        data: {
          deletedAt: now,
        },
      });
    });

    return NextResponse.json<ApiResponse<void>>({
      success: true,
      data: undefined,
    });
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
};