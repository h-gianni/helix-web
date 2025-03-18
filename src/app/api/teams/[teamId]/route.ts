// app/api/teams/[teamId]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type {
  ApiResponse,
  JsonValue,
  TeamDetailsResponse,
  TeamResponse,
  
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
            scores: {
              include: {
                action: true,
              },
            },
          },
        },
        actions: {  // This is BusinessActivity
          where: {
            deletedAt: null
          },
          include: {
            action: {  // This is Activity model
              include: {
                category: true
              }
            },
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
      customFields: team.customFields as JsonValue | undefined,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
      deletedAt: team.deletedAt,
    
      teamFunction: team.teamFunction ? {
        id: team.teamFunction.id,
        name: team.teamFunction.name,
        description: team.teamFunction.description,
        jobTitles: team.teamFunction.jobTitles.map(jobTitle => ({
          id: jobTitle.id,
          name: jobTitle.name,
          teamFunctionId: jobTitle.teamFunctionId,
          createdAt: jobTitle.createdAt,
          updatedAt: jobTitle.updatedAt,
          deletedAt: jobTitle.deletedAt,
          customFields: jobTitle.customFields as JsonValue | undefined
        })),
        createdAt: team.teamFunction.createdAt,
        updatedAt: team.teamFunction.updatedAt
      } : null,
    
      members: team.teamMembers.map(member => ({
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
        customFields: member.customFields as JsonValue | undefined,
        user: {
          id: member.user.id,
          email: member.user.email,
          name: member.user.name
        }
      })),
    
      businessActivities: team.actions.map(businessActivity => ({
        id: businessActivity.id,
        // Changed from activityId to actionId to match OrgActionResponse
        actionId: businessActivity.actionId,
        // Add name, description from the action
        name: businessActivity.action.name,
        description: businessActivity.action.description,
        // Add category object at the top level
        category: {
          id: businessActivity.action.category.id,
          name: businessActivity.action.category.name,
          description: businessActivity.action.category.description
        },
        priority: businessActivity.priority,
        status: businessActivity.status,
        // Convert dates to ISO strings if necessary based on your type definition
        dueDate: businessActivity.dueDate ? businessActivity.dueDate.toISOString() : null,
        teamId: businessActivity.teamId,
        createdBy: businessActivity.createdBy,
        createdAt: businessActivity.createdAt.toISOString(),
        updatedAt: businessActivity.updatedAt.toISOString(),
        deletedAt: businessActivity.deletedAt ? businessActivity.deletedAt.toISOString() : null,
        customFields: businessActivity.customFields as JsonValue | undefined,
        // Renamed from activity to action to match OrgActionResponse
        action: {
          id: businessActivity.action.id,
          name: businessActivity.action.name,
          description: businessActivity.action.description,
          impactScale: businessActivity.action.impactScale,
          category: {
            id: businessActivity.action.category.id,
            name: businessActivity.action.category.name,
            description: businessActivity.action.category.description
          }
        },
        team: {
          id: businessActivity.team.id,
          name: businessActivity.team.name
        },
        // Add _count if needed by OrgActionResponse
        _count: {
          scores: 0 // You might want to include actual count from the database
        }
      }))
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

    return NextResponse.json({
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
    await prisma.$transaction(async (tx) => {
      // Get all team members first
      const teamMembers = await tx.teamMember.findMany({
        where: {
          teamId: params.teamId,
        },
        select: {
          id: true
        }
      });

      const memberIds = teamMembers.map((member: { id: string }) => member.id);

      if (memberIds.length > 0) {
        // Hard delete records for models without deletedAt field
        // For MemberScore - hard delete
        await tx.memberScore.deleteMany({
          where: {
            teamMemberId: {
              in: memberIds
            }
          }
        });

        // For StructuredFeedback - hard delete
        await tx.structuredFeedback.deleteMany({
          where: {
            teamMemberId: {
              in: memberIds
            }
          }
        });

        // For MemberComment - hard delete
        await tx.memberComment.deleteMany({
          where: {
            teamMemberId: {
              in: memberIds
            }
          }
        });

        // For PerformanceReview - soft delete (this model has deletedAt)
        // await tx.performanceReview.updateMany({
        //   where: {
        //     teamMemberId: {
        //       in: memberIds
        //     }
        //   },
        //   data: {
        //     deletedAt: now,
        //   },
        // });

           // Finally, soft delete the team
      await tx.gTeam.update({
        where: {
          id: params.teamId,
        },
        data: {
          deletedAt: now,
        },
      });
      }

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
      await tx.orgAction.updateMany({
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
    
    // More detailed error response
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
};