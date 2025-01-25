// app/api/dashboard/performers/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/lib/types/api";

export const dynamic = 'force-dynamic'

interface Performer {
  id: string;
  name: string;
  title: string | null;
  teamId: string;
  teamName: string;
  averageRating: number;
  ratingsCount: number;
}

interface TeamWithId {
  id: string;
}

interface MemberWithTeam {
  teamId: string;
}

interface MemberWithScores {
  id: string;
  title: string | null;
  user: {
    name: string | null;
    email: string;
  };
  team: {
    id: string;
    name: string;
  };
  ratings: {
    value: number;
  }[];
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's accessible teams
    const user = await prisma.appUser.findUnique({
      where: { clerkId: userId },
      include: {
        teams: true,     // Teams owned
        teamMembers: {       // Teams where user is a member
          include: {
            team: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Collect all team IDs user has access to
    const teamIds = new Set([
      ...user.teams.map((team: TeamWithId) => team.id),
      ...user.teamMembers.map((member: MemberWithTeam) => member.teamId)
    ]);

    // Get all members from these teams with their scores
    const membersWithScores = await prisma.teamMember.findMany({
      where: {
        teamId: {
          in: Array.from(teamIds)
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        ratings: {
          select: {
            value: true,
          },
        },
      },
    });

    // Transform data into performers format
    const performers: Performer[] = membersWithScores.map((member: MemberWithScores) => {
      const totalScores = member.ratings.length;
      const averageRating = totalScores > 0
        ? member.ratings.reduce(
            (sum: number, score: { value: number }) => sum + score.value,
            0
          ) / totalScores
        : 0;

      return {
        id: member.id,
        name: member.user.name || member.user.email,
        title: member.title,
        teamId: member.team.id,
        teamName: member.team.name,
        averageRating,
        ratingsCount: totalScores,
      };
    });

    console.log('Performers data prepared:', performers.length); // Debug log

    return NextResponse.json<ApiResponse<{ performers: Performer[] }>>({
      success: true,
      data: {
        performers,
      },
    });

  } catch (error) {
    console.error("Error fetching performers:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}