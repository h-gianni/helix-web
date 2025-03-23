// src/app/api/user/teams/[teamId]/route.ts
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

    // Fetch detailed team information
    const team = await prisma.gTeam.findUnique({
      where: {
        id: params.teamId,
        deletedAt: null
      },
      include: {
        teamFunction: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        teamMembers: {
          where: { deletedAt: null },
          select: {
            id: true,
            title: true,
            isAdmin: true,
            status: true,
            firstName: true,
            lastName: true,
            photoUrl: true,
            joinedDate: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true
              }
            },
            _count: {
              select: {
                scores: true,
                feedback: true,
                reviews: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        owner: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    // Check if the user is the owner
    const isOwner = team.owner.id === user.id;

    // Get member info if the user is a member
    const memberInfo = team.teamMembers.find(member => member.user.id === user.id);

    // Transform the data for response
    const teamData = {
      id: team.id,
      name: team.name,
      description: team.description,
      teamFunction: team.teamFunction,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
      owner: {
        id: team.owner.id,
        name: team.owner.name,
        email: team.owner.email
      },
      members: team.teamMembers.map(member => ({
        id: member.id,
        title: member.title,
        isAdmin: member.isAdmin,
        status: member.status,
        name: member.firstName && member.lastName 
          ? `${member.firstName} ${member.lastName}` 
          : member.user.name,
        email: member.user.email,
        photoUrl: member.photoUrl,
        joinedDate: member.joinedDate,
        stats: {
          ratingsCount: member._count.scores,
          feedbackCount: member._count.feedback,
          reviewsCount: member._count.reviews
        }
      })),
      userRole: {
        isOwner,
        isMember: !!memberInfo,
        isAdmin: memberInfo?.isAdmin || false,
      }
    };

    return NextResponse.json({
      success: true,
      data: teamData
    });
  } catch (error) {
    console.error('Error fetching team details:', error);
    return NextResponse.json(
      { error: "Failed to fetch team details" },
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