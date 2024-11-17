// app/api/teams/[teamId]/members/[memberId]/ratings/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, ScoreResponse } from "@/lib/types/api";

async function getUserFromClerkId(clerkId: string) {
  return await prisma.user.findUnique({
    where: { clerkId },
  });
}

async function checkTeamAccess(teamId: string, userId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) return false;

  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      ownerId: user.id,
    },
  });

  if (team) return true;

  const member = await prisma.member.findFirst({
    where: {
      teamId,
      userId: user.id,
    },
  });

  return !!member;
}

async function validateInitiative(teamId: string, initiativeId: string) {
  console.log('Validating initiative:', { teamId, initiativeId }); // Debug log

  const teamInitiative = await prisma.teamInitiative.findFirst({
    where: {
      AND: [
        { teamId: teamId },
        { initiativeId: initiativeId }
      ]
    },
    include: {
      initiative: true,
      team: true
    }
  });

  console.log('Found teamInitiative:', teamInitiative); // Debug log

  return !!teamInitiative;
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
    const initiativeId = url.searchParams.get('initiativeId');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const where = {
      memberId: params.memberId,
      ...(initiativeId ? { initiativeId } : {}),
    };

    const [ratings, total] = await Promise.all([
      prisma.score.findMany({
        where,
        include: {
          initiative: true,
          member: {
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
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.score.count({ where }),
    ]);

    const averageRating = ratings.length > 0
      ? ratings.reduce((sum: number, rating: { value: number }) => sum + rating.value, 0) / ratings.length
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        ratings: ratings as ScoreResponse[],
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          current: page,
          limit,
        },
        stats: {
          average: averageRating,
          count: total,
        },
      },
    });

  } catch (error) {
    console.error("Error fetching ratings:", error);
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

    const hasAccess = await checkTeamAccess(params.teamId, userId);
    if (!hasAccess) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { initiativeId, rating, feedback } = body;

    // Add debug logs
    console.log('Received rating request:', {
      teamId: params.teamId,
      memberId: params.memberId,
      initiativeId,
      rating,
      feedback
    });

    // Validate initiative association
    const isValidInitiative = await validateInitiative(params.teamId, initiativeId);
    
    if (!isValidInitiative) {
      // Check if the initiative exists at all
      const initiativeExists = await prisma.initiative.findUnique({
        where: { id: initiativeId }
      });

      if (!initiativeExists) {
        return NextResponse.json<ApiResponse<never>>(
          { success: false, error: "Initiative not found" },
          { status: 404 }
        );
      }

      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Initiative is not associated with this team" },
        { status: 400 }
      );
    }

    // Create the rating
    const score = await prisma.score.create({
      data: {
        memberId: params.memberId,
        initiativeId,
        value: rating,
        feedback: feedback?.trim() || null,
      },
      include: {
        member: {
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
        initiative: true,
      },
    });

    return NextResponse.json<ApiResponse<ScoreResponse>>(
      { success: true, data: score as ScoreResponse },
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