// src/app/api/user/teams/[teamId]/activities/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the user
    const user = await prisma.appUser.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has access to the team
    const hasAccess = await checkTeamAccess(params.teamId, user.id);
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Get URL parameters for pagination and filtering
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const status = url.searchParams.get('status');
    const skip = (page - 1) * limit;

    // Build the where clause for filtering
    const whereClause: any = {
      teamId: params.teamId,
      deletedAt: null
    };

    if (status) {
      whereClause.status = status;
    }

    // Fetch team activities
    const activities = await prisma.orgAction.findMany({
      where: whereClause,
      select: {
        id: true,
        priority: true,
        status: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true,
        action: {
          select: {
            id: true,
            name: true,
            description: true,
            impactScale: true,
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            scores: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // Count total activities for pagination
    const totalCount = await prisma.orgAction.count({
      where: whereClause
    });

    // Transform the data for response
    const transformedActivities = activities.map(activity => ({
      id: activity.id,
      name: activity.action.name,
      description: activity.action.description,
      priority: activity.priority,
      status: activity.status,
      dueDate: activity.dueDate,
      category: {
        id: activity.action.category.id,
        name: activity.action.category.name
      },
      impactScale: activity.action.impactScale,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
      ratingsCount: activity._count.scores
    }));

    return NextResponse.json({
      success: true,
      data: transformedActivities,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        current: page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching team activities:', error);
    return NextResponse.json(
      { error: "Failed to fetch team activities" },
      { status: 500 }
    );
  }
}

// Helper function to check team access
async function checkTeamAccess(teamId: string, userId: string) {
  const team = await prisma.gTeam.findFirst({
    where: {
      id: teamId,
      OR: [
        { ownerId: userId },
        { teamMembers: { some: { userId, deletedAt: null } } }
      ],
      deletedAt: null
    }
  });

  return !!team;
}