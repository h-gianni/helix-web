import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/lib/types/api";
import { Prisma } from "@prisma/client";
import { validateOnboardingInput } from "./validation.service";
import { manageOrganization } from "./organization.service";
import {
  processTeamMembers,
  assignTeamMemberships,
} from "./team-member.service";
import { processTeams } from "./team.service";
import { processActions } from "./action.service";

export interface CompleteOnboardingInput {
  organization: {
    name: string;
    siteDomain: string;
  };
  activities: {
    selected: string[];
    selectedByCategory: Record<string, string[]>;
  };
  teams: Array<{
    id: string;
    name: string;
    functions: string[];
    categories: string[];
    memberIds: string[]; // Added memberIds array to store assigned member IDs
  }>;
  teamMembers: Array<{
    id: string;
    fullName: string;
    email: string;
    jobTitle?: string;
  }>;
}

export interface CompleteOnboardingResponse {
  organization: {
    id: string;
    name: string;
    siteDomain: string;
  };
  teams: Array<{
    id: string;
    name: string;
    teamFunctionId: string;
  }>;
  activitiesCount: number;
  teamMembers: Array<{
    id: string;
    fullName: string;
    email: string;
    jobTitle?: string;
  }>;
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.appUser.findUnique({
      where: {
        clerkId: userId,
        deletedAt: null,
      },
    });

    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Please complete registration first" },
        { status: 404 }
      );
    }

    const body: CompleteOnboardingInput = await request.json();

    // Use validation service
    const validationResult = validateOnboardingInput(body);
    if (!validationResult.isValid && validationResult.response) {
      return validationResult.response;
    }

    const { organization, activities, teams, teamMembers } = body;

    // Start transaction for the entire onboarding process
    try {
      const result = await prisma.$transaction(
        async (tx) => {
          // 1. Create or update organization name using organization service
          const orgResult = await manageOrganization(
            tx,
            user.id,
            organization,
            user.customFields
          );

          // 2. Process team members using the team member service
          const createdTeamMembers = await processTeamMembers(
            tx,
            teamMembers || [],
            user.id
          );

          // 3. Create or update teams using team service
          const createdTeams = await processTeams(
            tx,
            teams,
            teamMembers,
            user.id
          );

          // 4. Create organization actions for each selected activity using action service
          const createdActions = await processActions(
            tx,
            activities,
            createdTeams,
            user.id
          );

          // 5. Insert record into teamMembers with teamId and userId using team-member service
          await assignTeamMemberships(tx, createdTeams, createdTeamMembers);

          return {
            teams: createdTeams,
            actionsCount: createdActions.length,
          };
        },
        {
          maxWait: 10000, // 10 seconds max wait time
          timeout: 30000, // 30 seconds timeout
          isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
        }
      );

      // Return a formatted response
      const response: CompleteOnboardingResponse = {
        organization: {
          id: user.id,
          name: organization.name.trim(),
          siteDomain: organization.siteDomain.trim(),
        },
        teams: result.teams.map((team) => ({
          id: team.id,
          name: team.name,
          teamFunctionId: team.teamFunctionId,
        })),
        activitiesCount: result.actionsCount,
        teamMembers: [],
      };

      return NextResponse.json<ApiResponse<CompleteOnboardingResponse>>(
        { success: true, data: response },
        { status: 201 }
      );
    } catch (txError) {
      console.error("Transaction error:", txError);
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error:
            txError instanceof Error ? txError.message : "Transaction failed",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
