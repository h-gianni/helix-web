import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) { 
    try {
        const { userId } = await auth();
        if (!userId) {
          return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
          );
          
        }
    
    
    const user = await prisma.appUser.findUnique({
        where: {clerkId: userId},
        select:{
            id: true,
        }
    })

    if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

        // Get URL parameters for pagination
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Fetch teams the user owns
    const teamsOwned = await prisma.gTeam.findMany({
        where: {
          ownerId: user.id,
          deletedAt: null
        },
        select: {
          id: true,
          name: true,
          description: true,
          teamFunctionId: true,
          createdAt: true,
          teamFunction: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              teamMembers: true,
              actions: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

       // Fetch teams where the user is a member
    const teamMemberships = await prisma.teamMember.findMany({
        where: {
          userId: user.id,
          deletedAt: null,
          team: {
            deletedAt: null,
            ownerId: { not: user.id } // Exclude teams the user owns
          }
        },
        select: {
          id: true,
          title: true,
          isAdmin: true,
          team: {
            select: {
              id: true,
              name: true,
              description: true,
              teamFunctionId: true,
              createdAt: true,
              teamFunction: {
                select: {
                  id: true,
                  name: true
                }
              },
              _count: {
                select: {
                  teamMembers: true,
                  actions: true
                }
              }
            }
          }
        },
        orderBy: {
          team: {
            createdAt: 'desc'
          }
        }
      });

      // Count total teams for pagination
    const totalOwnedCount = await prisma.gTeam.count({
        where: {
          ownerId: user.id,
          deletedAt: null
        }
      });

      const totalMembershipCount = await prisma.teamMember.count({
        where: {
          userId: user.id,
          deletedAt: null,
          team: {
            deletedAt: null,
            ownerId: { not: user.id }
          }
        }
      });

       // Format team memberships for response
    const memberTeams = teamMemberships.map(membership => ({
        id: membership.team.id,
        name: membership.team.name,
        description: membership.team.description,
        teamFunctionId: membership.team.teamFunctionId,
        teamFunction: membership.team.teamFunction,
        createdAt: membership.team.createdAt,
        memberInfo: {
          id: membership.id,
          title: membership.title,
          isAdmin: membership.isAdmin
        },
        memberCount: membership.team._count.teamMembers,
        activityCount: membership.team._count.actions
      }));
  
      return NextResponse.json({
        success: true,
        data: {
          owned: teamsOwned.map(team => ({
            id: team.id,
            name: team.name,
            description: team.description,
            teamFunctionId: team.teamFunctionId,
            teamFunction: team.teamFunction,
            createdAt: team.createdAt,
            memberCount: team._count.teamMembers,
            activityCount: team._count.actions,
            isOwner: true
          })),
          member: memberTeams,
        },
        pagination: {
          owned: {
            total: totalOwnedCount,
            pages: Math.ceil(totalOwnedCount / limit),
            current: page,
            limit
          },
          member: {
            total: totalMembershipCount,
            pages: Math.ceil(totalMembershipCount / limit),
            current: page,
            limit
          }
        }
      });
    } catch (error) {
      console.error('Error fetching user teams:', error);
      return NextResponse.json(
        { error: "Failed to fetch user teams" },
        { status: 500 }
      );
    }
  }
    

    