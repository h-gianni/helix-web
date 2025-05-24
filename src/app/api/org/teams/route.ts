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
  teamFunctionId?: string;
  ownerId?: string;
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
        console.log(`Processing team: ${team.name}`);
        const startTime = Date.now();

        // Get or create teamFunction
        let teamFunction = null;
        
        if (team.teamFunctionId) {
          // Try to find by ID first
          teamFunction = await tx.teamFunction.findUnique({
            where: { id: team.teamFunctionId }
          });
        }
        
        if (!teamFunction && team.functions && team.functions.length > 0) {
          // Use upsert to handle existing team functions with the same name
          teamFunction = await tx.teamFunction.upsert({
            where: {
              name: team.functions[0]
            },
            create: {
              name: team.functions[0],
              description: `Team function for ${team.name}`
            },
            update: {
              // Update description if needed, but keep existing function
              description: `Team function for ${team.name}`
            }
          });
        }

        if (!teamFunction) {
          throw new Error(`No team function found or created for team: ${team.name}`);
        }

        console.log(`Team function processed in ${Date.now() - startTime}ms`);

        // Batch create users to improve performance
        const memberStartTime = Date.now();
        const userEmails = team.members.map(member => member.email);
        
        // Find existing users in one query
        const existingUsers = await tx.appUser.findMany({
          where: {
            email: { in: userEmails }
          },
          select: { id: true, email: true, name: true }
        });

        // Create map of existing users by email
        const existingUserMap = new Map(existingUsers.map(user => [user.email, user]));

        // Identify users that need to be created
        const newUserEmails = userEmails.filter(email => !existingUserMap.has(email));
        
        // Batch create new users
        if (newUserEmails.length > 0) {
          const newUsers = await tx.appUser.createMany({
            data: newUserEmails.map(email => {
              const member = team.members.find(m => m.email === email);
              return {
                email: email,
                name: member?.fullName || '',
                clerkId: null
              };
            })
          });

          // Fetch the newly created users to get their IDs
          const createdUsers = await tx.appUser.findMany({
            where: {
              email: { in: newUserEmails }
            },
            select: { id: true, email: true, name: true }
          });

          // Add newly created users to the map
          createdUsers.forEach(user => existingUserMap.set(user.email, user));
        }

        console.log(`Users processed in ${Date.now() - memberStartTime}ms`);

        // Prepare team member data
        const createdMembers = team.members.map(member => {
          const user = existingUserMap.get(member.email);
          if (!user) {
            throw new Error(`User not found for email: ${member.email}`);
          }

          return {
            userId: user.id,
            status: TeamMemberStatus.ACTIVE,
            firstName: member.fullName.split(' ')[0],
            lastName: member.fullName.split(' ').slice(1).join(' ') || '',
            title: member.jobTitle || 'Team Member',
            isAdmin: false,
            joinedDate: new Date(),
            photoUrl: null,
            jobGradeId: null,
            customFields: {
              originalEmail: member.email,
              originalFullName: member.fullName,
              originalJobTitle: member.jobTitle,
              memberType: 'onboarding_created',
              isPlaceholderUser: true,
              onboardingSource: 'team_creation'
            }
          };
        });

        console.log(`Creating team "${team.name}" with ${createdMembers.length} team members (no login access)`);

        // Create the team with team members
        const teamStartTime = Date.now();
        const newTeam = await tx.gTeam.create({
          data: {
            name: team.name,
            description: team.description || `Team created by ${appUser.name}`,
            teamFunctionId: teamFunction.id,
            ownerId: team.ownerId || appUser.id,
            teamMembers: {
              create: createdMembers
            }
          },
          include: {
            teamMembers: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    name: true
                  }
                }
              }
            },
            teamFunction: true
          }
        });

        console.log(`Team created in ${Date.now() - teamStartTime}ms`);
        console.log(`Successfully created team "${newTeam.name}" with ${newTeam.teamMembers.length} team-only members`);

        // Verify team members were created correctly
        if (newTeam.teamMembers.length !== team.members.length) {
          throw new Error(`Mismatch in team member count for team "${team.name}". Expected: ${team.members.length}, Created: ${newTeam.teamMembers.length}`);
        }

        // Log team member details for verification
        newTeam.teamMembers.forEach((teamMember: any, index: number) => {
          const customFields = teamMember.customFields as any;
          console.log(`Team member ${index + 1}: ${customFields?.originalFullName} (${customFields?.originalEmail}) - Title: ${teamMember.title} - Placeholder User: ${customFields?.isPlaceholderUser}`);
        });

        // Create team actions/functions (defer to reduce transaction time)
        const actionsStartTime = Date.now();
        if (team.functions && team.functions.length > 0) {
          // First, ensure we have a valid action category for team functions
          const teamFunctionCategory = await tx.actionCategory.upsert({
            where: {
              name: 'Team Functions'
            },
            create: {
              name: 'Team Functions',
              description: 'Functions and capabilities assigned to teams',
              isGlobal: false
            },
            update: {}
          });

          // Process actions in batches to reduce transaction load
          const actionPromises = team.functions.map(async (functionName) => {
            // Find or create the action
            const action = await tx.action.upsert({
              where: {
                name_categoryId: {
                  name: functionName,
                  categoryId: teamFunctionCategory.id // Use the correct category ID
                }
              },
              create: {
                name: functionName,
                description: `${functionName} function for ${team.name}`,
                categoryId: teamFunctionCategory.id // Use the correct category ID
              },
              update: {}
            });

            // Create team action
            return tx.orgAction.create({
              data: {
                actionId: action.id,
                teamId: newTeam.id,
                status: 'ACTIVE',
                createdBy: team.ownerId || appUser.id
              }
            });
          });

          await Promise.all(actionPromises);
        }

        console.log(`Actions processed in ${Date.now() - actionsStartTime}ms`);
        console.log(`Total time for team "${team.name}": ${Date.now() - startTime}ms`);

        return newTeam;
      }));

      return createdTeams;
    }, {
      timeout: 30000, // Increase timeout to 30 seconds
    });

    // Log overall summary
    const totalTeams = result.length;
    const totalMembers = result.reduce((sum, team: any) => sum + (team.teamMembers?.length || 0), 0);
    console.log(`🎉 Successfully created ${totalTeams} teams with a total of ${totalMembers} team members`);

    return NextResponse.json({
      success: true,
      data: {
        teams: result,
        summary: {
          teamsCreated: totalTeams,
          membersCreated: totalMembers
        }
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