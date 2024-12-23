// app/api/teams/[teamId]/performance/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/lib/types/api";

interface MemberPerformance {
  id: string;
  name: string;
  title: string | null;
  averageRating: number;
  ratingsCount: number;
}

interface MemberWithScores {
  id: string;
  title: string | null;
  user: {
    name: string | null;
    email: string;
  };
  scores: {
    value: number;
  }[];
}

export async function GET(
  _request: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    console.log('Performance API called for team:', params.teamId);

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get team and its members
    const team = await prisma.team.findUnique({
      where: { 
        id: params.teamId 
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            scores: {
              select: {
                value: true,
              },
            },
          },
        },
      },
    });

    console.log('Team found:', team?.id);
    console.log('Members found:', team?.members.length);

    if (!team) {
      console.log('Team not found');
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Team not found" },
        { status: 404 }
      );
    }

    // Map members to performance data
    const performanceData: MemberPerformance[] = team.members.map((member: MemberWithScores) => {
      console.log('Processing member:', member.user.email);
      console.log('Member scores:', member.scores.length);

      const totalScores = member.scores.length;
      const averageRating = totalScores > 0
        ? member.scores.reduce(
            (sum: number, score: { value: number }) => sum + score.value, 
            0
          ) / totalScores
        : 0;

      return {
        id: member.id,
        name: member.user.name || member.user.email,
        title: member.title,
        averageRating,
        ratingsCount: totalScores,
      };
    });

    console.log('Performance data prepared:', performanceData.length);

    return NextResponse.json<ApiResponse<{ members: MemberPerformance[] }>>({
      success: true,
      data: {
        members: performanceData,
      },
    });

  } catch (error) {
    console.error("Error fetching team performance:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}