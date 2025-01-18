// app/api/teams/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, TeamResponse } from "@/lib/types/api";

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
        deletedAt: null 
      },
      include: {
        teams: {
          where: {
            deletedAt: null
          },
          include: {
            teamFunction: {
              include: {
                jobTitles: {
                  where: {
                    deletedAt: null
                  }
                },
              }
            },
          },
        },
        teamMembers: {
          where: {
            deletedAt: null,
            team: {
              deletedAt: null
            }
          },
          include: {
            team: {
              include: {
                teamFunction: {
                  include: {
                    jobTitles: {
                      where: {
                        deletedAt: null
                      }
                    },
                  }
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

    // Create a Map to store unique teams by ID
    const teamsMap = new Map([
      ...user.teams,
      ...user.teamMembers.map((member: { team: any }) => member.team),
    ].map((team) => [team.id, team]));

    // Convert Map back to array and transform to match TeamResponse type
    const teams: TeamResponse[] = Array.from(teamsMap.values()).map(team => ({
      id: team.id,
      name: team.name,
      description: team.description,
      businessFunctionId: team.teamFunctionId,
      businessFunction: {
        id: team.teamFunction.id,
        name: team.teamFunction.name,
        description: team.teamFunction.description,
        jobTitles: team.teamFunction.jobTitles,
        createdAt: team.teamFunction.createdAt,
        updatedAt: team.teamFunction.updatedAt,
      },
      ownerId: team.ownerId,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    }));

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
  
  // Debug auth header
  const authHeader = request.headers.get('authorization');
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

    const { name, businessFunctionId, description } = body;

    if (!name?.trim() || !businessFunctionId) {
      console.log("❌ Missing required fields:", { name, businessFunctionId });
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Team name and business function are required" },
        { status: 400 }
      );
    }

    console.log("👤 Finding user with clerkId:", userId);
    const user = await prisma.appUser.findUnique({
      where: { 
        clerkId: userId,
        deletedAt: null 
      },
    });

    if (!user) {
      console.log("❌ User not found - Please complete registration");
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Please complete registration first" },
        { status: 404 }
      );
    }

    // Verify business function exists
    const businessFunction = await prisma.teamFunction.findUnique({
      where: { 
        id: businessFunctionId,
        deletedAt: null
      },
    });

    if (!businessFunction) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Business function not found" },
        { status: 404 }
      );
    }

    console.log("📝 Creating team for user:", user.id);
    const team = await prisma.gTeam.create({
      data: {
        name: name.trim(),
        description: description?.trim(),
        teamFunctionId: businessFunctionId,
        ownerId: user.id,
      },
      include: {
        teamFunction: {
          include: {
            jobTitles: {
              where: {
                deletedAt: null
              }
            },
          }
        },
      },
    });

    const teamResponse: TeamResponse = {
      id: team.id,
      name: team.name,
      description: team.description,
      businessFunctionId: team.teamFunctionId,
      businessFunction: {
        id: team.teamFunction.id,
        name: team.teamFunction.name,
        description: team.teamFunction.description,
        jobTitles: team.teamFunction.jobTitles,
        createdAt: team.teamFunction.createdAt,
        updatedAt: team.teamFunction.updatedAt,
      },
      ownerId: team.ownerId,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
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