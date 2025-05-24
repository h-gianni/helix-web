import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from '@/lib/prisma';
import { TeamMemberStatus } from "@prisma/client";

interface TeamMember {
  fullName: string;
  email: string;
  jobTitle: string;
}

interface Team {
  name: string;
  description?: string;
  teamFunctionId: string; // This can be either an ID or a function name
  members: TeamMember[];
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const teams: Team[] = body.teams;

    if (!teams || !Array.isArray(teams)) {
      return NextResponse.json(
        { success: false, error: "Teams data is required" },
        { status: 400 }
      );
    }

    // Get the app user
    const appUser = await prisma.appUser.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!appUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Process each team in a transaction
    const createdTeams = await Promise.all(teams.map(async (team) => {
      return prisma.$transaction(async (tx) => {
        // Check if team name already exists for this owner
        const existingTeam = await tx.gTeam.findFirst({
          where: {
            name: team.name,
            ownerId: appUser.id,
            deletedAt: null
          }
        });

        if (existingTeam) {
          throw new Error(`Team "${team.name}" already exists`);
        }

        // Try to find team function by ID first, then by name if ID not found
        let teamFunction = await tx.teamFunction.findFirst({
          where: {
            OR: [
              { id: team.teamFunctionId },
              { name: team.teamFunctionId }
            ]
          }
        });

        // If team function doesn't exist, create it
        if (!teamFunction) {
          teamFunction = await tx.teamFunction.create({
            data: {
              name: team.teamFunctionId,
              description: `Team function for ${team.name}`
            }
          });
        }

        // Create the team with the resolved team function ID
        const newTeam = await tx.gTeam.create({
          data: {
            name: team.name,
            description: team.description || `Team created by ${appUser.id}`,
            teamFunctionId: teamFunction.id,
            ownerId: appUser.id
          }
        });

        // Create or get users first
        const userPromises = team.members.map(async (member) => {
          return tx.appUser.upsert({
            where: { email: member.email },
            create: {
              email: member.email,
              name: member.fullName
            },
            update: {},
            select: { id: true }
          });
        });

        const users = await Promise.all(userPromises);

        // Create team members with the user IDs
        await tx.teamMember.createMany({
          data: team.members.map((member, index) => ({
            teamId: newTeam.id,
            userId: users[index].id,
            status: TeamMemberStatus.ACTIVE,
            firstName: member.fullName.split(' ')[0],
            lastName: member.fullName.split(' ').slice(1).join(' ') || '',
            title: member.jobTitle || 'Team Member',
            isAdmin: false,
            joinedDate: new Date()
          }))
        });

        return newTeam;
      });
    }));

    return NextResponse.json({
      success: true,
      data: { teams: createdTeams }
    });

  } catch (error) {
    console.error('Error creating teams:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Failed to create teams" },
      { status: 500 }
    );
  }
} 