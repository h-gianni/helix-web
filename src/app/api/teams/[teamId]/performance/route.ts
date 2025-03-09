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

interface MemberWithRatings {
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

    // Get team and its members with ratings
    const team = await prisma.gTeam.findUnique({
      where: { 
        id: params.teamId 
      },
      include: {
        teamMembers: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            scores: {  // Changed from scores to ratings
              select: {
                value: true,
              },
            },
          },
        },
      },
    });

    console.log('Team found:', team?.id);
    console.log('Members found:', team?.teamMembers.length);

    if (!team) {
      console.log('Team not found');
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Team not found" },
        { status: 404 }
      );
    }

    // Map members to performance data
    const performanceData: MemberPerformance[] = team.teamMembers.map((member: MemberWithRatings) => {
      console.log('Processing member:', member.user.email);
      console.log('Member ratings:', member.scores.length);

      const totalRatings = member.scores.length;
      const averageRating = totalRatings > 0
        ? member.scores.reduce(
            (sum: number, rating: { value: number }) => sum + rating.value, 
            0
          ) / totalRatings
        : 0;

      return {
        id: member.id,
        name: member.user.name || member.user.email,
        title: member.title,
        averageRating,
        ratingsCount: totalRatings,
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