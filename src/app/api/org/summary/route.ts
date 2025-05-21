import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from '@/lib/prisma';
import { BusinessActionStatus } from "@prisma/client";

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
    const { teams, members, globalActions, teamActions, organization } = body;

    // console.log('teams', members);
    // return;

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
      // Create teams and their members
      const createdTeams = await Promise.all(teams.map(async (team: any) => {
        const newTeam = await tx.gTeam.create({
          data: {
            name: team.name,
            description: team.description || `Team created by ${appUser.name}`,
            teamFunctionId: appUser.orgName?.[0]?.id || '',
            ownerId: appUser.id,
            teamMembers: {
              create: team.memberIds?.map((memberId: string) => ({
                userId: memberId,
                status: 'ACTIVE'
              })) || []
            }
          },
          include: {
            teamMembers: true,
            teamFunction: true
          }
        });

        // Create team actions
        if (team.functions && team.functions.length > 0) {
          await Promise.all(team.functions.map(async (functionName: string) => {
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
                status: 'ACTIVE' as BusinessActionStatus,
                createdBy: appUser.id
              }
            });
          }));
        }

        return newTeam;
      }));

      // Create global actions if any
      if (globalActions && globalActions.length > 0) {
        await Promise.all(globalActions.map(async (actionName: string) => {
          const action = await tx.action.upsert({
            where: {
              name_categoryId: {
                name: actionName,
                categoryId: appUser.orgName?.[0]?.id || ''
              }
            },
            create: {
              name: actionName,
              description: `Global action: ${actionName}`,
              categoryId: appUser.orgName?.[0]?.id || ''
            },
            update: {}
          });

          return tx.orgGlobalActions.create({
            data: {
              actionId: action.id,
              orgId: appUser.orgName?.[0]?.id || '',
              status: 'ACTIVE' as BusinessActionStatus,
              createdBy: appUser.id
            }
          });
        }));
      }

      return createdTeams;
    });

    return NextResponse.json({
      success: true,
      data: {
        teams: result
      }
    });

  } catch (error) {
    console.error('Error in summary setup:', error);
    return NextResponse.json(
      { success: false, error: "Failed to complete setup" },
      { status: 500 }
    );
  }
} 