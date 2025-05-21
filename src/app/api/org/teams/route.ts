import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from '@/lib/prisma';
import { TeamMemberStatus } from "@prisma/client";

interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  jobTitle: string;
}

interface Team {
  name: string;
  functions: string[];
  categories: string[];
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

    console.log('teams-------------', teams);
   // return;

    if (!teams || !Array.isArray(teams)) {
      return NextResponse.json(
        { success: false, error: "Teams data is required" },
        { status: 400 }
      );
    }

    // Get the app user with org
    const appUser = await prisma.appUser.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        name: true,
        orgName: {
          select: {
            id: true
          }
        }
      }
    });

    if (!appUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Use transaction to ensure all operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      const createdTeams = await Promise.all(teams.map(async (team) => {
        // First, ensure we have a valid teamFunction
        let teamFunction = await tx.teamFunction.findFirst({
          where: {
            name: team.functions[0] || 'Default Team Function',
            deletedAt: null
          }
        });

        if (!teamFunction) {
          // Create a default team function if none exists
          teamFunction = await tx.teamFunction.create({
            data: {
              name: team.functions[0] || 'Default Team Function',
              description: `Team function for ${team.name}`
            }
          });
        }

        // Create the team with the valid teamFunction
        const newTeam = await tx.gTeam.create({
          data: {
            name: team.name,
            description: `Team created by ${appUser.name}`,
            teamFunctionId: teamFunction.id,
            ownerId: appUser.id,
            // Create team members
            teamMembers: {
              create: team.members.map((member) => ({
                userId: member.id,
                status: TeamMemberStatus.ACTIVE,
                firstName: member.fullName.split(' ')[0],
                lastName: member.fullName.split(' ').slice(1).join(' '),
                title: member.jobTitle
              }))
            }
          },
          include: {
            teamMembers: true,
            teamFunction: true
          }
        });

        // Create team functions/categories
        if (team.functions && team.functions.length > 0) {
          await Promise.all(team.functions.map(async (functionName) => {
            // Find or create the action
            const action = await tx.action.upsert({
              where: {
                name_categoryId: {
                  name: functionName,
                  categoryId: appUser.orgName?.[0]?.id || ''
                }
              },
              create: {
                name: functionName,
                description: `${functionName} function for ${team.name}`,
                categoryId: appUser.orgName?.[0]?.id || ''
              },
              update: {}
            });

            // Create team action
            return tx.orgAction.create({
              data: {
                actionId: action.id,
                teamId: newTeam.id,
                status: 'ACTIVE',
                createdBy: appUser.id
              }
            });
          }));
        }

        return newTeam;
      }));

      return createdTeams;
    });

    return NextResponse.json({
      success: true,
      data: {
        teams: result
      }
    });

  } catch (error) {
    console.error('Error creating teams:', error);
    return NextResponse.json(
      { success: false, error: "Failed to create teams" },
      { status: 500 }
    );
  }
} 