// app/api/teams/[teamId]/members/[memberId]/ratings/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, RatingResponse } from "@/lib/types/api";

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

async function validateActivity(teamId: string, activityId: string) {
  console.log("Validating activity:", { teamId, activityId }); // Debug log
  const activity = await prisma.orgAction.findFirst({
    where: {
      id: activityId,
      teamId: teamId,
      deletedAt: null,
    },
  });
  console.log("Found activity:", activity); // Debug log
  return !!activity;
}

export async function GET(
  request: Request,
  { params }: { params: { teamId: string; memberId: string } }
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

    const url = new URL(request.url);
    const actionId = url.searchParams.get("activityId"); // Keep param name for backward compatibility
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const page = parseInt(url.searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const where = {
      teamMemberId: params.memberId,
      ...(actionId ? { actionId } : {}),
    };

    const [scores, total] = await Promise.all([
      prisma.memberScore.findMany({
        where,
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
              firstName: true,
              lastName: true,
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                },
              },
            },
          },
          action: {
            include: {
              action: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.memberScore.count({ where }),
    ]);

    // Transform to match expected response format
    const transformedScores = scores.map(score => ({
      id: score.id,
      value: score.value,
      teamMemberId: score.teamMemberId,
      activityId: score.actionId, // Map to expected client field
      createdAt: score.createdAt,
      updatedAt: score.updatedAt,
      teamMember: score.teamMember,
      activity: { // Transform OrgAction + Action to expected Activity format
        id: score.actionId,
        name: score.action.action.name,
        description: score.action.action.description,
      },
    }));

    const averageScore =
      scores.length > 0
        ? scores.reduce((sum, score) => sum + score.value, 0) / scores.length
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        ratings: transformedScores, // Keep field name for backward compatibility
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          current: page,
          limit,
        },
        stats: {
          average: averageScore,
          count: total,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching scores:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { teamId: string; memberId: string } }
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
    console.log("Received rating request:", { // Debug log
      teamId: params.teamId,
      memberId: params.memberId,
      body
    });

    const { activityId, value } = body;

    // Validate that the teamMember exists and belongs to the team
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        id: params.memberId,
        teamId: params.teamId,
        deletedAt: null
      }
    });

    if (!teamMember) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Team member not found or not associated with this team",
        },
        { status: 404 }
      );
    }

    // Validate orgAction association
    const orgAction = await prisma.orgAction.findFirst({
      where: {
        id: activityId,
        teamId: params.teamId,
        deletedAt: null
      }
    });

    if (!orgAction) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Action is not associated with this team",
        },
        { status: 400 }
      );
    }

    // Check if a score already exists for this member and action
    const existingScore = await prisma.memberScore.findFirst({
      where: {
        teamMemberId: params.memberId,
        actionId: activityId
      }
    });

    let score;
    
    if (existingScore) {
      // Update existing score
      score = await prisma.memberScore.update({
        where: {
          id: existingScore.id
        },
        data: {
          value: value
        },
        include: {
          teamMember: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                }
              }
            }
          },
          action: {
            include: {
              action: true
            }
          }
        }
      });
    } else {
      // Create new score
      score = await prisma.memberScore.create({
        data: {
          teamMemberId: params.memberId,
          actionId: activityId,
          value: value,
        },
        include: {
          teamMember: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                }
              }
            }
          },
          action: {
            include: {
              action: true
            }
          }
        }
      });
    }

    // Transform the response to match expected format
    const transformedResponse = {
      id: score.id,
      value: score.value,
      teamMemberId: score.teamMemberId,
      actionId: score.actionId,
      createdAt: score.createdAt,
      updatedAt: score.updatedAt,
      teamMember: score.teamMember,
      activity: {
        id: score.action.id,
        name: score.action.action.name,
        description: score.action.action.description
      }
    };

    return NextResponse.json<ApiResponse<typeof transformedResponse>>(
      { success: true, data: transformedResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving rating:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}