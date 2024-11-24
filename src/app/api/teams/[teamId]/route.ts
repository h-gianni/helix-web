import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type {
  ApiResponse,
  TeamDetailsResponse,
  TeamResponse,
  TransactionClient,
} from "@/lib/types/api";

// Helper to check if user is team owner
async function isTeamOwner(clerkId: string, teamId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) return false;

  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      ownerId: user.id,
    },
  });

  return !!team;
}

// Helper to check if user has access to team
async function checkTeamAccess(teamId: string, userId: string) {
  // First check if user exists
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) return false;

  // Check if user is team owner first
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      ownerId: user.id,
    },
  });

  if (team) return true; // Owner always has access

  // If not owner, check if they're a member
  const member = await prisma.member.findFirst({
    where: {
      teamId,
      userId: user.id,
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

    const team = await prisma.team.findUnique({
      where: { id: params.teamId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        initiatives: {
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
      ownerId: team.ownerId, // Add ownerId field
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
      members: team.members.map((member) => ({
        id: member.id,
        userId: member.userId,
        teamId: member.teamId,
        title: member.title,
        isAdmin: member.isAdmin,
        firstName: member.firstName,
        lastName: member.lastName,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
        user: {
          id: member.user.id,
          email: member.user.email,
          name: member.user.name,
        },
      })),
      initiatives: team.initiatives.map((initiative) => ({
        id: initiative.id,
        name: initiative.name,
        description: initiative.description,
        teamId: initiative.teamId,
        createdAt: initiative.createdAt,
        updatedAt: initiative.updatedAt,
        team: initiative.team,
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

    const body = await request.json();
    const { name, description } = body;

    if (!name?.trim()) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Team name is required" },
        { status: 400 }
      );
    }

    const team = await prisma.team.update({
      where: { id: params.teamId },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
    });

    return NextResponse.json<ApiResponse<TeamResponse>>({
      success: true,
      data: team as TeamResponse,
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

    // Delete all related records in a transaction
    await prisma.$transaction(async (tx: TransactionClient) => {
      // Delete all scores for this team's members
      await tx.score.deleteMany({
        where: {
          member: {
            teamId: params.teamId,
          },
        },
      });

      // Delete all goals for this team's members
      await tx.goal.deleteMany({
        where: {
          member: {
            teamId: params.teamId,
          },
        },
      });

      // Delete all reports for this team's members
      await tx.report.deleteMany({
        where: {
          member: {
            teamId: params.teamId,
          },
        },
      });

      // Delete all members
      await tx.member.deleteMany({
        where: {
          teamId: params.teamId,
        },
      });

      // Delete all initiatives
      await tx.initiative.deleteMany({
        where: {
          teamId: params.teamId,
        },
      });

      // Finally, delete the team
      await tx.team.delete({
        where: {
          id: params.teamId,
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
