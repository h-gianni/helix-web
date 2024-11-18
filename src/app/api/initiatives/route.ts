// app/api/initiatives/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, InitiativeResponse, CreateInitiativeInput } from "@/lib/types/api";

// Helper to check team access
async function checkTeamAccess(teamId: string, userId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) return false;

  // Check if user is team owner
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      ownerId: user.id,
    },
  });

  if (team) return true;

  // If not owner, check if they're a member
  const member = await prisma.member.findFirst({
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
    const teamId = url.searchParams.get('teamId');

    // Modify query to include null teamId or matching teamId
    const initiatives = await prisma.initiative.findMany({
      where: teamId ? {
        OR: [
          { teamId },
          { teamId: null }
        ]
      } : {},
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json<ApiResponse<InitiativeResponse[]>>({
      success: true,
      data: initiatives,
    });
  } catch (error) {
    console.error("Error fetching initiatives:", error);
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

    const body: CreateInitiativeInput = await request.json();
    const { name, description, teamId } = body;

    if (!name?.trim()) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Initiative name is required" },
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

    const initiative = await prisma.initiative.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        teamId,
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json<ApiResponse<InitiativeResponse>>(
      { success: true, data: initiative },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating initiative:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}