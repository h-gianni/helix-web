// src/app/api/user/activities/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
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

    // Get URL parameters for pagination and filtering
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const teamId = url.searchParams.get('teamId');
    const status = url.searchParams.get('status');
    const skip = (page - 1) * limit;

    // Build the where clause for filtering
    const whereClause: any = {
      createdBy: user.id,
      deletedAt: null
    };

    if (teamId) {
      whereClause.teamId = teamId;
    }

    if (status) {
      whereClause.status = status;
    }

    // Fetch activities created by the user
    const actions = await prisma.orgAction.findMany({
      where: whereClause,
      select: {
        id: true,
        priority: true,
        status: true,
        dueDate: true,
        teamId: true,
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
        team: {
          select: {
            id: true,
            name: true
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
    const transformedActivities = actions.map(activity => ({
      id: activity.id,
      name: activity.action.name,
      description: activity.action.description,
      priority: activity.priority,
      status: activity.status,
      dueDate: activity.dueDate,
      teamId: activity.teamId,
      teamName: activity.team.name,
      category: {
        id: activity.action.category.id,
        name: activity.action.category.name
      },
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
      ratingsCount: activity._count.scores
    }));

    console.log(transformedActivities, "transformedActivities-----------");

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
    console.error('Error fetching user activities:', error);
    return NextResponse.json(
      { error: "Failed to fetch user activities" },
      { status: 500 }
    );
  }
}