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
    const { organization, activities, teams, teamMembers } = body;

    console.log("teams----------------------- anme", teams);

    // Validation checks
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

    // Start transaction for the entire onboarding process
    try {
      const result = await prisma.$transaction(
        async (tx) => {
          // 1. Create or update organization name
          let orgNameRecord = null;
          try {
            orgNameRecord = await tx.orgName.findFirst({
              where: { userId: user.id },
            });

            if (orgNameRecord) {
              orgNameRecord = await tx.orgName.update({
                where: { id: orgNameRecord.id },
                data: { name: organization.name.trim() },
              });
            } else {
              orgNameRecord = await tx.orgName.create({
                data: {
                  name: organization.name.trim(),
                  userId: user.id,
                },
              });
            }
          } catch (err) {
            console.error("Error managing organization name:", err);
            // Fallback to storing in user customFields
            await tx.appUser.update({
              where: { id: user.id },
              data: {
                customFields: {
                  ...((user.customFields as object) || {}),
                  organizationName: organization.name.trim(),
                },
              },
            });
          }
          // 4. Create app user for each selected teamMember
          const createdTeamMembers = [];
          for (const member of teamMembers || []) {
            if (!member.email?.trim() || !member.fullName?.trim()) {
              console.warn(
                `Skipping team member with missing email or name: ${JSON.stringify(
                  member
                )}`
              );
              continue;
            }

            try {
              // Check if the user already exists
              let appUser = await tx.appUser.findUnique({
                where: { email: member.email.trim() },
                select: { id: true },
              });

              if (!appUser) {
                // Create a new app user if not exists
                appUser = await tx.appUser.create({
                  data: {
                    email: member.email.trim(),
                    name: member.fullName.trim(),
                    // jobTitle: member.jobTitle?.trim() || null,
                    customFields: {
                      invitedBy: user.id,
                    },
                  },
                });
              }

              createdTeamMembers.push({ id: appUser, email: member.email });
            } catch (memberError) {
              console.error(
                `Error processing team member ${member.email}:`,
                memberError
              );
              // Continue with other team members
            }
          }
          // 2. Create or update teams
          const createdTeams = [];
          for (const team of teams) {
            if (!team.name?.trim()) {
              continue; // Skip teams without names
            }

            // Create or get team function (based on first function in the array)
            let teamFunction = null;
            if (team.functions && team.functions.length > 0) {
              const functionName = team.functions[0];

              // Try to find existing team function
              teamFunction = await tx.teamFunction.findFirst({
                where: {
                  name: functionName,
                  deletedAt: null,
                },
              });

              // Create if not exists
              if (!teamFunction) {
                teamFunction = await tx.teamFunction.create({
                  data: {
                    name: functionName,
                    description: `Function for ${team.name}`,
                  },
                });
              }

              console.log("team function--------------------", teamFunction);
            }

            try {
              let createdTeam: any;

              // Handle temporary IDs differently than existing IDs
              if (team.id.startsWith("temp-")) {
                // For temporary IDs, create a new team
                createdTeam = await tx.gTeam.create({
                  data: {
                    name: team.name.trim(),
                    teamFunctionId: teamFunction?.id ?? "",
                    ownerId: user.id,
                    customFields: {
                      categories: team.categories || [],
                      functions: team.functions || [],
                    },
                  },
                });

                console.log(
                  "temp function if--------------------",
                  createdTeam
                );
              } else {
                console.log("team id--------------------", team.id);

                // For existing IDs, try to update, if not found then create
                try {
                  const existingTeam = await tx.gTeam.findUnique({
                    where: { id: team.id },
                    select: { id: true, customFields: true },
                  });

                  console.log(
                    "existingTeam function if--------------------",
                    createdTeam
                  );

                  if (existingTeam) {
                    createdTeam = await tx.gTeam.update({
                      where: { id: team.id },
                      data: {
                        name: team.name.trim(),
                        teamFunctionId: teamFunction?.id ?? "",
                        customFields: {
                          ...((existingTeam.customFields as object) || {}),
                          categories: team.categories || [],
                          functions: team.functions || [],
                        },
                      },
                    });
                    console.log(
                      "easy function if--------------------",
                      createdTeam
                    );
                  } else {
                    createdTeam = await tx.gTeam.create({
                      data: {
                        // id: team.id,
                        name: team.name.trim(),
                        teamFunctionId: teamFunction?.id ?? "",
                        ownerId: user.id,
                        customFields: {
                          categories: team.categories || [],
                          functions: team.functions || [],
                        },
                      },
                    });
                  }

                  console.log(
                    "easy function else--------------------",
                    createdTeam
                  );
                } catch (updateError) {
                  // If update fails, try creating
                  createdTeam = await tx.gTeam.create({
                    data: {
                      name: team.name.trim(),
                      teamFunctionId: teamFunction?.id ?? "",
                      ownerId: user.id,
                      customFields: {
                        categories: team.categories || [],
                        functions: team.functions || [],
                      },
                    },
                  });
                }
              }

              if (createdTeam) {
                const teamMemberEmails = teamMembers
                  .filter((mem) => team.memberIds.includes(mem.id))
                  .map((mem) => mem.email);
                createdTeam["memberIds"] = teamMemberEmails;
                console.log("teamIndex--------------------", createdTeam);
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
                select: { id: true },
              });

              if (!actionExists) {
                console.warn(`Action ${actionId} not found, skipping`);
                continue;
              }

              // For each action, create an OrgAction for teams that have this category
              for (const team of createdTeams) {
                const teamCategories =
                  (team.customFields as any)?.categories || [];

                // Only create action for teams that have this category selected
                if (teamCategories.includes(categoryId)) {
                  try {
                    const createdAction = await tx.orgAction.create({
                      data: {
                        actionId,
                        teamId: team.id,
                        status: "ACTIVE",
                        priority: "MEDIUM",
                        createdBy: user.id,
                      },
                    });

                    createdActions.push(createdAction);
                  } catch (actionError) {
                    console.error(
                      `Error creating action ${actionId} for team ${team.id}:`,
                      actionError
                    );
                    // Continue with other actions
                  }
                }
              }
            }
          }

          // 5. Insert record into teamMembers with teamId and userId
          for (const team of createdTeams) {
            for (const member of team.memberIds) {
              try {
                const appUserId = createdTeamMembers.find(
                  (mem) => mem.email === member
                )?.id;
                if (!appUserId) {
                  console.warn(`User ${member} not found, skipping`);
                  continue;
                }
                await tx.teamMember.create({
                  data: {
                    teamId: team.id,
                    userId: appUserId.id,
                  },
                });
              } catch (teamMemberError) {
                console.error(
                  `Error adding user ${user.id} to team ${team.id}:`,
                  teamMemberError
                );
                // Continue with other teams
              }
            }
          }
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
