import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { teamId: string; memberId: string } }
) {
  try {
    const { teamId, memberId } = params;

    // Get current quarter dates
    const now = new Date();
    const currentQuarter = Math.floor((now.getMonth() / 3));
    const currentYear = now.getFullYear();
    const quarterStart = new Date(currentYear, currentQuarter * 3, 1);
    const quarterEnd = new Date(currentYear, (currentQuarter + 1) * 3, 0);

    // Get all ratings for the member
    const allRatings = await prisma.memberScore.findMany({
      where: {
        teamMemberId: memberId,
      },
      include: {
        action: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate current rating
    const currentRating = allRatings.reduce((sum, rating) => sum + rating.value, 0) / allRatings.length || 0;

    // Get current quarter ratings
    const currentQuarterRatings = allRatings.filter(
      rating => rating.createdAt >= quarterStart && rating.createdAt <= quarterEnd
    );
    const currentQuarterRating = currentQuarterRatings.reduce((sum, rating) => sum + rating.value, 0) / 
      currentQuarterRatings.length || 0;

    // Calculate quarterly trend
    const previousQuarterStart = new Date(quarterStart);
    previousQuarterStart.setMonth(previousQuarterStart.getMonth() - 3);
    const previousQuarterRatings = allRatings.filter(
      rating => rating.createdAt >= previousQuarterStart && rating.createdAt < quarterStart
    );
    const previousQuarterRating = previousQuarterRatings.reduce((sum, rating) => sum + rating.value, 0) / 
      previousQuarterRatings.length || 0;
    
    const quarterlyTrend = currentQuarterRating > previousQuarterRating ? 'up' : 
      currentQuarterRating < previousQuarterRating ? 'down' : 'stable';

    // Get total feedbacks
    const totalFeedbacks = await prisma.structuredFeedback.count({
      where: {
        teamMemberId: memberId,
      },
    });

    // Get team standings
    const teamMembers = await prisma.memberScore.groupBy({
      by: ['teamMemberId'],
      where: {
        teamMember: {
          teamId,
        },
        createdAt: {
          gte: quarterStart,
          lte: quarterEnd,
        },
      },
      _avg: {
        value: true,
      },
    });

    const sortedTeamMembers = teamMembers.sort((a, b) => 
      (b._avg.value || 0) - (a._avg.value || 0)
    );
    const teamPosition = sortedTeamMembers.findIndex(m => m.teamMemberId === memberId) + 1;

    // Calculate team position trend
    const previousQuarterTeamMembers = await prisma.memberScore.groupBy({
      by: ['teamMemberId'],
      where: {
        teamMember: {
          teamId,
        },
        createdAt: {
          gte: previousQuarterStart,
          lt: quarterStart,
        },
      },
      _avg: {
        value: true,
      },
    });

    const sortedPreviousTeamMembers = previousQuarterTeamMembers.sort((a, b) => 
      (b._avg.value || 0) - (a._avg.value || 0)
    );
    const previousTeamPosition = sortedPreviousTeamMembers.findIndex(m => m.teamMemberId === memberId) + 1;

    const teamPositionTrend = teamPosition < previousTeamPosition ? 'up' : 
      teamPosition > previousTeamPosition ? 'down' : 'stable';

    // Get top activities
    const topActivities = await prisma.memberScore.groupBy({
      by: ['actionId'],
      where: {
        teamMemberId: memberId,
      },
      _avg: {
        value: true,
      },
      _count: {
        value: true,
      },
      orderBy: [
        {
          _avg: {
            value: 'desc',
          },
        },
      ],
      take: 3,
    });

    const topActivitiesWithDetails = await Promise.all(
      topActivities.map(async (activity) => {
        const activityDetails = await prisma.orgAction.findUnique({
          where: {
            id: activity.actionId,
          },
          select: {
            id: true,
            // name: true,
          },
        });
        return {
          id: activity.actionId,
          // name: activityDetails?.name || 'Unknown Activity',
          averageRating: activity._avg.value || 0,
          ratingsCount: activity._count.value,
        };
      })
    );

    // Calculate quarterly performance
    const quarters = [];
    for (let i = 0; i < 4; i++) {
      const quarterDate = new Date(quarterStart);
      quarterDate.setMonth(quarterDate.getMonth() - (i * 3));
      const quarterEnd = new Date(quarterDate);
      quarterEnd.setMonth(quarterDate.getMonth() + 3);

      const quarterRatings = allRatings.filter(
        rating => rating.createdAt >= quarterDate && rating.createdAt < quarterEnd
      );

      quarters.push({
        quarter: `Q${Math.floor((quarterDate.getMonth() / 3) + 1)} ${quarterDate.getFullYear()}`,
        averageRating: quarterRatings.reduce((sum, rating) => sum + rating.value, 0) / quarterRatings.length || 0,
        totalRatings: quarterRatings.length,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        currentRating,
        totalRatings: allRatings.length,
        currentQuarterRating,
        quarterlyTrend,
        totalFeedbacks,
        teamPosition,
        teamPositionTrend,
        topActivities: topActivitiesWithDetails,
        quarterlyPerformance: quarters,
      },
    });
  } catch (error) {
    console.error("Error in member dashboard API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard data",
      },
      { status: 500 }
    );
  }
}