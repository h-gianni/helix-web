import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/lib/types/api";
import { Prisma } from "@prisma/client";

/**
 * Debug endpoint for hard deleting onboarding data
 * This is intended for development/testing purposes only
 */
export async function GET(request: Request) {
  try {
    // Only allow in development environment
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Debug endpoints are not available in production",
        },
        { status: 403 }
      );
    }

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the current user
    const user = await prisma.appUser.findUnique({
      where: {
        clerkId: userId,
        deletedAt: null,
      },
    });

    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Use a transaction to ensure all deletions are atomic
    const deletionResult = await prisma.$transaction(
      async (tx) => {
        // 1. Find all teams owned by this user
        const userTeams = await tx.gTeam.findMany({
          where: { ownerId: user.id },
          select: { id: true },
        });

        const teamIds = userTeams.map((team) => team.id);

        // 2. Delete all org actions associated with those teams
        const deletedActions = await tx.orgAction.deleteMany({
          where: {
            teamId: { in: teamIds },
          },
        });

        // 3. Delete team member associations
        const deletedTeamMembers = await tx.teamMember.deleteMany({
          where: {
            teamId: { in: teamIds },
          },
        });

        // 4. Delete all teams
        const deletedTeams = await tx.gTeam.deleteMany({
          where: { ownerId: user.id },
        });

        // 5. Delete organization
        const deletedOrg = await tx.orgName.deleteMany({
          where: { userId: user.id },
        });

        // 6. Clean up any invited team members (optional - uncomment if needed)
        /*
        const deletedInvitedUsers = await tx.appUser.deleteMany({
          where: {
            customFields: {
              path: ['invitedBy'],
              equals: user.id,
            }
          },
        });
        */

        return {
          orgActions: deletedActions.count,
          teamMembers: deletedTeamMembers.count,
          teams: deletedTeams.count,
          organizations: deletedOrg.count,
        };
      },
      {
        maxWait: 5000,
        timeout: 10000,
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      }
    );

    return NextResponse.json<ApiResponse<typeof deletionResult>>(
      {
        success: true,
        data: deletionResult,
        message: "Successfully deleted onboarding data",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in debug endpoint:", error);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
