// app/api/teams/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type { ApiResponse, TeamResponse } from "@/lib/types/api";

interface UserWithTeams {
  teams: Team[];
  members: TeamMember[];
}

interface Team {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}

interface TeamMember {
  team: Team;
}

// Add initiative interface based on your schema
interface Initiative {
  id: string;
  name: string;
  description: string | null;
  teamId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const POST = async (request: Request) => {
  const { userId } = await auth();

  try {
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name?.trim()) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Team name is required",
        },
        { status: 400 }
      );
    }

    // Get user from Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    console.log("Creating team for user:", user.id);

    // Get all available initiatives
    const initiatives = await prisma.initiative.findMany();

    // Create team and associate all initiatives in a transaction
    const team = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // Create the team
        const newTeam = await tx.team.create({
          data: {
            name: name.trim(),
            ownerId: user.id,
          },
        });

        // Associate all initiatives with the team
        if (initiatives.length > 0) {
          await tx.teamInitiative.createMany({
            data: initiatives.map((initiative: Initiative) => ({
              teamId: newTeam.id,
              initiativeId: initiative.id,
            })),
          });
        }

        return newTeam;
      }
    );

    console.log("Team created:", team);

    return NextResponse.json<ApiResponse<TeamResponse>>(
      {
        success: true,
        data: team as TeamResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
};

export const GET = async (request: Request) => {
  try {
    const { userId } = await auth();

    //const token = await auth().se;

    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const user = (await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        teams: true, // Teams owned by user
        members: {
          // Teams where user is a member
          include: {
            team: true,
          },
        },
      },
    })) as UserWithTeams | null;

    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Create a Map to store unique teams by ID
    const teamsMap = new Map(
      [
        ...user.teams,
        ...user.members.map((member: TeamMember) => member.team),
      ].map((team: Team) => [team.id, team])
    );

    // Convert Map back to array
    const teams = Array.from(teamsMap.values());

    return NextResponse.json<ApiResponse<TeamResponse[]>>({
      success: true,
      data: teams as TeamResponse[],
    });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
};
