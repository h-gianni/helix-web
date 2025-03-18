import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type {
  ApiResponse,
  UpdateTeamMemberInput,
  TeamMemberResponse,

} from "@/lib/types/api";

// Helper to get user from clerkId
async function getUserFromClerkId(clerkId: string) {
  return await prisma.appUser.findUnique({
    where: { clerkId },
  });
}

// Helper to check if user is team owner
async function isTeamOwner(teamId: string, userId: string) {
  const team = await prisma.gTeam.findFirst({
    where: {
      id: teamId,
      ownerId: userId,
    },
  });

  return !!team;
}

// Helper to check if user is a team admin
async function isTeamAdmin(teamId: string, userId: string) {
  const member = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId,
      isAdmin: true,
    },
  });
  return !!member;
}

// Helper to verify if a member exists within a team
async function verifyMember(memberId: string, teamId: string) {
  return await prisma.teamMember.findFirst({
    where: { id: memberId, teamId },
    include: {
      team: true,
    },
  });
}

// GET endpoint to retrieve member details
export async function GET(
  req: Request,
  { params }: { params: { teamId: string; memberId: string } }
) {
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

    const user = await getUserFromClerkId(userId);
    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Check if user is owner first, if yes, they always have access
    const isOwner = await isTeamOwner(params.teamId, user.id);

    // If not owner, check if they're an admin
    if (!isOwner) {
      const isAdmin = await isTeamAdmin(params.teamId, user.id);
      if (!isAdmin) {
        return NextResponse.json<ApiResponse<never>>(
          {
            success: false,
            error: "Access denied",
          },
          { status: 403 }
        );
      }
    }

    const member = await prisma.teamMember.findFirst({
      where: {
        id: params.memberId,
        teamId: params.teamId,
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        feedback: {
          select: {
            id: true,
            goals: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Member not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<TeamMemberResponse>>({
      success: true,
      data: member as TeamMemberResponse,
    });
  } catch (error) {
    console.error("Error fetching member details:", error);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update member details
export async function PATCH(
  req: Request,
  { params }: { params: { teamId: string; memberId: string } }
) {
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

    const user = await getUserFromClerkId(userId);
    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Check if user is owner first
    const isOwner = await isTeamOwner(params.teamId, user.id);

    // If not owner, check if they're an admin
    if (!isOwner) {
      const isAdmin = await isTeamAdmin(params.teamId, user.id);
      if (!isAdmin) {
        return NextResponse.json<ApiResponse<never>>(
          {
            success: false,
            error: "Only team owners or admins can update members",
          },
          { status: 403 }
        );
      }
    }

    const existingMember = await verifyMember(params.memberId, params.teamId);
    if (!existingMember) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Member not found",
        },
        { status: 404 }
      );
    }

    const {
      firstName,
      lastName,
      title,
      isAdmin: newIsAdmin,
    } = (await req.json()) as UpdateTeamMemberInput;

    // If changing admin status, check special conditions
    if (
      typeof newIsAdmin !== "undefined" &&
      newIsAdmin !== existingMember.isAdmin
    ) {
      // Only check admin count if not the owner and removing admin status
      if (!isOwner && !newIsAdmin && existingMember.isAdmin) {
        const adminCount = await prisma.teamMember.count({
          where: {
            teamId: params.teamId,
            isAdmin: true,
          },
        });

        if (adminCount === 1) {
          return NextResponse.json<ApiResponse<never>>(
            {
              success: false,
              error:
                "Cannot remove the last admin. Assign another admin first.",
            },
            { status: 400 }
          );
        }
      }
    }

    const member = await prisma.teamMember.update({
      where: { id: params.memberId },
      data: {
        firstName: firstName?.trim() ?? existingMember.firstName,
        lastName: lastName?.trim() ?? existingMember.lastName,
        title: title?.trim() ?? existingMember.title,
        isAdmin: newIsAdmin ?? existingMember.isAdmin,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json<ApiResponse<TeamMemberResponse>>({
      success: true,
      data: member as TeamMemberResponse,
    });
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove a member and their associated records

export async function DELETE(
  req: Request,
  { params }: { params: { teamId: string; memberId: string } }
) {
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

    const user = await getUserFromClerkId(userId);
    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Check if user is owner first
    const isOwner = await isTeamOwner(params.teamId, user.id);

    // If not owner, check if they're an admin
    if (!isOwner) {
      const isAdmin = await isTeamAdmin(params.teamId, user.id);
      if (!isAdmin) {
        return NextResponse.json<ApiResponse<never>>(
          {
            success: false,
            error: "Only team owners or admins can remove members",
          },
          { status: 403 }
        );
      }
    }

    const member = await verifyMember(params.memberId, params.teamId);
    if (!member) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Member not found",
        },
        { status: 404 }
      );
    }

    // If trying to delete an admin, ensure there's at least one other admin
    // (unless the requester is the owner)
    if (!isOwner && member.isAdmin) {
      const adminCount = await prisma.teamMember.count({
        where: {
          teamId: params.teamId,
          isAdmin: true,
        },
      });

      if (adminCount === 1) {
        return NextResponse.json<ApiResponse<never>>(
          {
            success: false,
            error: "Cannot delete the last admin. Assign another admin first.",
          },
          { status: 400 }
        );
      }
    }

    // Delete all related records in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.structuredFeedback.deleteMany({ where: { teamMemberId: params.memberId } });
      await tx.memberScore.deleteMany({ where: { teamMemberId: params.memberId } });
      await tx.memberComment.deleteMany({ where: { teamMemberId: params.memberId } });
      await tx.performanceReview.deleteMany({ where: { teamMemberId: params.memberId } });
      await tx.teamMember.delete({ where: { id: params.memberId } });
    });

    return NextResponse.json<ApiResponse<void>>({
      success: true,
      data: undefined,
    });
  } catch (error) {
    console.error("Error removing team member:", error);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}