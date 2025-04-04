// app/api/teams/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, TeamResponse } from "@/lib/types/api";

interface TeamMemberWithUser {
  id: string;
  title: string | null;
  isAdmin: boolean;
  user?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  // Add other fields that might be accessed
}

export const GET = async (request: Request) => {
  console.log("🎯 GET /api/teams - Started");
  try {
    const { userId } = await auth();

    if (!userId) {
      console.log("❌ No userId found");
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("👤 Finding user with clerkId:", userId);
    const user = await prisma.appUser.findUnique({
      where: {
        clerkId: userId,
        deletedAt: null,
      },
      include: {
        teams: {
          where: {
            deletedAt: null,
          },
          include: {
            teamFunction: {
              include: {
                jobTitles: {
                  where: {
                    deletedAt: null,
                  },
                },
              },
            },
            // Include team members for each team
            teamMembers: {
              where: {
                deletedAt: null,
              },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        teamMembers: {
          where: {
            deletedAt: null,
            team: {
              deletedAt: null,
            },
          },
          include: {
            team: {
              include: {
                teamFunction: {
                  include: {
                    jobTitles: {
                      where: {
                        deletedAt: null,
                      },
                    },
                  },
                },
                // Include team members for the teams the user is a member of
                teamMembers: {
                  where: {
                    deletedAt: null,
                  },
                  include: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      console.log("❌ User not found - Please complete registration");
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Please complete registration first" },
        { status: 404 }
      );
    }
    console.error(user.teams);
    // Create a Map to store unique teams by ID
    const userOwnedTeams = user.teams.map((team) => ({
      ...team,
      members: team.teamMembers || [],
    }));

    const userMemberTeams = user.teamMembers.map((member) => ({
      ...member.team,
      members: member.team.teamMembers || [],
    }));

    // Combine and deduplicate teams
    const teamsMap = new Map();
    [...userOwnedTeams, ...userMemberTeams].forEach((team) => {
      // If team already exists in map, don't override
      if (!teamsMap.has(team.id)) {
        teamsMap.set(team.id, team);
      }
    });

    // Convert Map back to array and transform to match TeamResponse type
    const teams: TeamResponse[] = Array.from(teamsMap.values()).map((team) => {
      // Transform members to match the expected format in TeamResponse
      const members = (team.members || []).map(
        (member: TeamMemberWithUser) => ({
          id: member.id,
          title: member.title,
          name: member.user?.name || null,
          email: member.user?.email || "",
        })
      );

      return {
        id: team.id,
        name: team.name,
        description: team.description,
        teamFunctionId: team.teamFunctionId,
        ownerId: team.ownerId,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
        deletedAt: team.deletedAt,
        customFields: team.customFields,
        teamFunction: team.teamFunction
          ? {
              id: team.teamFunction.id,
              name: team.teamFunction.name,
            }
          : null,
        members: members,
        // You could calculate average performance here if needed
        // averagePerformance: calculateAveragePerformance(team)
      };
    });

    console.log("✅ Successfully fetched teams:", teams.length);

    return NextResponse.json<ApiResponse<TeamResponse[]>>({
      success: true,
      data: teams,
    });
  } catch (error) {
    console.error("❌ Error fetching teams:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};
export const POST = async (request: Request) => {
  console.log("🎯 POST /api/teams - Started");

  const authHeader = request.headers.get("authorization");
  console.log("📝 Auth header:", authHeader?.substring(0, 20) + "...");

  try {
    const { userId } = await auth();
    console.log("🔑 Auth result:", { userId });

    if (!userId) {
      console.log("❌ No userId found in auth result");
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("📦 Request body:", body);

    const { name, teamFunctionId, description } = body;

    if (!name?.trim() || !teamFunctionId) {
      console.log("❌ Missing required fields:", { name, teamFunctionId });
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Team name and team function are required" },
        { status: 400 }
      );
    }

    console.log("👤 Finding user with clerkId:", userId);
    const user = await prisma.appUser.findUnique({
      where: {
        clerkId: userId,
        deletedAt: null,
      },
    });

    if (!user) {
      console.log("❌ User not found - Please complete registration");
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Please complete registration first" },
        { status: 404 }
      );
    }

    // Verify team function exists
    const teamFunction = await prisma.teamFunction.findUnique({
      where: {
        id: teamFunctionId,
        deletedAt: null,
      },
    });

    if (!teamFunction) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Team function not found" },
        { status: 404 }
      );
    }

    console.log("📝 Creating team for user:", user.id);
    const team = await prisma.gTeam.create({
      data: {
        name: name.trim(),
        description: description?.trim(),
        teamFunctionId: teamFunctionId,
        ownerId: user.id,
      },
    });

    const teamResponse: TeamResponse = {
      id: team.id,
      name: team.name,
      description: team.description,
      teamFunctionId: team.teamFunctionId,
      ownerId: team.ownerId,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
      deletedAt: team.deletedAt,
      members: [],
    };

    console.log("✅ Team created successfully:", teamResponse);

    return NextResponse.json<ApiResponse<TeamResponse>>(
      { success: true, data: teamResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating team:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};
