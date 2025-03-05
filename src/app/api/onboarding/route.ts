// app/api/onboarding/complete/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/lib/types/api";

export interface CompleteOnboardingInput {
  organization: {
    name: string;
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
  }>;
}

export interface CompleteOnboardingResponse {
  organization: {
    id: string;
    name: string;
  };
  teams: Array<{
    id: string;
    name: string;
    teamFunctionId: string;
  }>;
  activitiesCount: number;
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
        deletedAt: null 
      },
    });

    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Please complete registration first" },
        { status: 404 }
      );
    }

    const body: CompleteOnboardingInput = await request.json();
    const { organization, activities, teams } = body;

    if (!organization?.name?.trim()) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Organization name is required" },
        { status: 400 }
      );
    }

    if (!teams || teams.length === 0) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "At least one team is required" },
        { status: 400 }
      );
    }

    // Start a transaction to ensure all or nothing is committed
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update the user's organization name in customFields
      const updatedUser = await tx.appUser.update({
        where: { id: user.id },
        data: {
          customFields: {
            ...(user.customFields as object || {}),
            organizationName: organization.name.trim()
          }
        }
      });

      // 2. Create or update teams
      const createdTeams = [];
      for (const team of teams) {
        if (!team.name?.trim()) {
          continue; // Skip teams without names
        }

        // Get the first function as teamFunctionId
        const teamFunctionId = team.functions && team.functions.length > 0 
          ? team.functions[0] 
          : null;

        if (!teamFunctionId) {
          continue; // Skip teams without a function
        }

        let createdTeam;
        
        // Handle temporary IDs differently than existing IDs
        if (team.id.startsWith('temp-')) {
          // For temporary IDs, try to find by name and owner
          const existingTeam = await tx.gTeam.findFirst({
            where: {
              name: team.name.trim(),
              ownerId: user.id,
              deletedAt: null
            }
          });
          
          if (existingTeam) {
            // Update existing team
            createdTeam = await tx.gTeam.update({
              where: { id: existingTeam.id },
              data: {
                name: team.name.trim(),
                teamFunctionId,
                customFields: {
                  ...((existingTeam.customFields as object) || {}),
                  categories: team.categories || []
                }
              }
            });
          } else {
            // Create new team
            createdTeam = await tx.gTeam.create({
              data: {
                name: team.name.trim(),
                teamFunctionId,
                ownerId: user.id,
                customFields: {
                  categories: team.categories || []
                }
              }
            });
          }
        } else {
          // For existing IDs, update directly
          try {
            createdTeam = await tx.gTeam.update({
              where: { id: team.id },
              data: {
                name: team.name.trim(),
                teamFunctionId,
                customFields: {
                  ...((await tx.gTeam.findUnique({
                    where: { id: team.id },
                    select: { customFields: true }
                  }))?.customFields as object || {}),
                  categories: team.categories || []
                }
              }
            });
          } catch (err) {
            // If team doesn't exist with this ID, create it
            createdTeam = await tx.gTeam.create({
              data: {
                name: team.name.trim(),
                teamFunctionId,
                ownerId: user.id,
                customFields: {
                  categories: team.categories || []
                }
              }
            });
          }
        }

        createdTeams.push(createdTeam);
      }

      // 3. Create organization actions for each selected activity
      const createdActions = [];
      const selectedActivities = activities.selected || [];
      const selectedByCategory = activities.selectedByCategory || {};

      for (const categoryId of Object.keys(selectedByCategory)) {
        const categoryActions = selectedByCategory[categoryId] || [];
        
        for (const actionId of categoryActions) {
          // For each action, we need to create an OrgAction for teams that have this category
          for (const team of createdTeams) {
            const teamCategories = (team.customFields as any)?.categories || [];
            
            // Only create action for teams that have this category selected
            if (teamCategories.includes(categoryId)) {
              const createdAction = await tx.orgAction.create({
                data: {
                  actionId,
                  teamId: team.id,
                  status: 'ACTIVE',
                  priority: 'MEDIUM',
                  createdBy: user.id
                }
              });
              
              createdActions.push(createdAction);
            }
          }
        }
      }

      return {
        user: updatedUser,
        teams: createdTeams,
        actionsCount: createdActions.length
      };
    });

    // Return a formatted response
    const response: CompleteOnboardingResponse = {
      organization: {
        id: user.id,
        name: organization.name.trim()
      },
      teams: result.teams.map(team => ({
        id: team.id,
        name: team.name,
        teamFunctionId: team.teamFunctionId
      })),
      activitiesCount: result.actionsCount
    };

    return NextResponse.json<ApiResponse<CompleteOnboardingResponse>>(
      { success: true, data: response },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error completing onboarding:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}