// app/api/onboarding/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/lib/types/api";
import { Prisma } from "@prisma/client";

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

    // First, create or verify team functions outside of the main transaction
    try {
      const allFunctionIds = teams.flatMap(team => team.functions || []);
      const uniqueFunctionIds = [...new Set(allFunctionIds)];
      
      // Check which functions already exist
      const existingFunctions = await prisma.teamFunction.findMany({
        where: {
          id: { in: uniqueFunctionIds },
          deletedAt: null
        },
        select: { id: true }
      });
      
      const existingFunctionIds = existingFunctions.map(func => func.id);
      const missingFunctionIds = uniqueFunctionIds.filter(id => !existingFunctionIds.includes(id));
      
      // Create missing team functions with default names
      if (missingFunctionIds.length > 0) {
        console.log(`Creating ${missingFunctionIds.length} missing team functions...`);
        
        for (const functionId of missingFunctionIds) {
          // Use a separate transaction for each function to isolate errors
          try {
            await prisma.teamFunction.create({
              data: {
                id: functionId,
                name: `Function ${functionId.substring(0, 8)}`,
                description: 'Automatically created during onboarding'
              }
            });
            console.log(`Created team function: ${functionId}`);
          } catch (err) {
            console.error(`Error creating team function ${functionId}:`, err);
            // Continue trying to create other functions
          }
        }
      }
    } catch (err) {
      console.error("Error handling team functions:", err);
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Failed to create team functions" },
        { status: 500 }
      );
    }

    // Now start a new transaction for the rest of the onboarding process
    try {
      const result = await prisma.$transaction(async (tx) => {
        // 1. Create or update organization name
        let orgNameRecord = null;
        try {
          orgNameRecord = await tx.orgName.findFirst({
            where: { userId: user.id }
          });
          
          if (orgNameRecord) {
            orgNameRecord = await tx.orgName.update({
              where: { id: orgNameRecord.id },
              data: { name: organization.name.trim() }
            });
          } else {
            orgNameRecord = await tx.orgName.create({
              data: {
                name: organization.name.trim(),
                userId: user.id
              }
            });
          }
        } catch (err) {
          console.error("Error managing organization name:", err);
          // Instead of storing in OrgName, store in user customFields as fallback
          await tx.appUser.update({
            where: { id: user.id },
            data: {
              customFields: {
                ...(user.customFields as object || {}),
                organizationName: organization.name.trim()
              }
            }
          });
        }

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

          try {
            let createdTeam;
            
            // Handle temporary IDs differently than existing IDs
            if (team.id.startsWith('temp-')) {
              // For temporary IDs, create a new team
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
            } else {
              // For existing IDs, try to update, if not found then create
              try {
                const existingTeam = await tx.gTeam.findUnique({
                  where: { id: team.id },
                  select: { id: true, customFields: true }
                });
                
                if (existingTeam) {
                  createdTeam = await tx.gTeam.update({
                    where: { id: team.id },
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
                  createdTeam = await tx.gTeam.create({
                    data: {
                      id: team.id,
                      name: team.name.trim(),
                      teamFunctionId,
                      ownerId: user.id,
                      customFields: {
                        categories: team.categories || []
                      }
                    }
                  });
                }
              } catch (updateError) {
                // If update fails, try creating
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

            if (createdTeam) {
              createdTeams.push(createdTeam);
            }
          } catch (teamError) {
            console.error(`Error processing team ${team.name}:`, teamError);
            // Continue with other teams
          }
        }

        // 3. Create organization actions for each selected activity
        const createdActions = [];
        const selectedByCategory = activities.selectedByCategory || {};

        for (const categoryId of Object.keys(selectedByCategory)) {
          const categoryActions = selectedByCategory[categoryId] || [];
          
          for (const actionId of categoryActions) {
            // Verify action exists
            const actionExists = await tx.action.findUnique({
              where: { id: actionId },
              select: { id: true }
            });
            
            if (!actionExists) {
              console.warn(`Action ${actionId} not found, skipping`);
              continue;
            }
            
            // For each action, we need to create an OrgAction for teams that have this category
            for (const team of createdTeams) {
              const teamCategories = (team.customFields as any)?.categories || [];
              
              // Only create action for teams that have this category selected
              if (teamCategories.includes(categoryId)) {
                try {
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
                } catch (actionError) {
                  console.error(`Error creating action ${actionId} for team ${team.id}:`, actionError);
                  // Continue with other actions
                }
              }
            }
          }
        }

        return {
          teams: createdTeams,
          actionsCount: createdActions.length
        };
      }, {
        maxWait: 10000, // 10 seconds max wait time
        timeout: 30000, // 30 seconds timeout
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted // Less strict isolation level
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
    } catch (txError) {
      console.error("Transaction error:", txError);
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: txError instanceof Error ? txError.message : "Transaction failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}