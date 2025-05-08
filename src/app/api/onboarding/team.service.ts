import { Prisma, PrismaClient } from "@prisma/client";

type TransactionClient = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never>,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export interface TeamInput {
  id: string;
  name: string;
  functions: string[];
  categories: string[];
  memberIds: string[];
}

export interface TeamMemberMapping {
  id: string;
  email: string;
}

export interface ProcessedTeam {
  id: string;
  name: string;
  teamFunctionId: string;
  ownerId: string;
  customFields: any;
  memberIds: string[];
  [key: string]: any; // For any additional properties
}

/**
 * Process team functions for a team
 */
const processTeamFunction = async (
  tx: TransactionClient,
  team: TeamInput
): Promise<any | null> => {
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
  }

  return teamFunction;
};

/**
 * Create or update teams
 */
export const processTeams = async (
  tx: TransactionClient,
  teams: TeamInput[],
  teamMembers: Array<{
    id: string;
    fullName: string;
    email: string;
    jobTitle?: string;
  }>,
  ownerId: string
): Promise<ProcessedTeam[]> => {
  const createdTeams: ProcessedTeam[] = [];

  for (const team of teams) {
    if (!team.name?.trim()) {
      console.warn("Skipping team without a name");
      continue;
    }

    try {
      // Process team function
      const teamFunction = await processTeamFunction(tx, team);

      let createdTeam: any;

      // Handle temporary IDs differently than existing IDs
      if (team.id.startsWith("temp-")) {
        // For temporary IDs, create a new team
        createdTeam = await tx.gTeam.create({
          data: {
            name: team.name.trim(),
            teamFunctionId: teamFunction?.id ?? "",
            ownerId: ownerId,
            customFields: {
              categories: team.categories || [],
              functions: team.functions || [],
            },
          },
        });
      } else {
        // For existing IDs, try to update, if not found then create
        try {
          const existingTeam = await tx.gTeam.findUnique({
            where: { id: team.id },
            select: { id: true, customFields: true },
          });

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
          } else {
            createdTeam = await tx.gTeam.create({
              data: {
                name: team.name.trim(),
                teamFunctionId: teamFunction?.id ?? "",
                ownerId: ownerId,
                customFields: {
                  categories: team.categories || [],
                  functions: team.functions || [],
                },
              },
            });
          }
        } catch (updateError) {
          // If update fails, try creating
          createdTeam = await tx.gTeam.create({
            data: {
              name: team.name.trim(),
              teamFunctionId: teamFunction?.id ?? "",
              ownerId: ownerId,
              customFields: {
                categories: team.categories || [],
                functions: team.functions || [],
              },
            },
          });
        }
      }

      if (createdTeam) {
        // Add member emails to the team for later relationship creation
        const teamMemberEmails = teamMembers
          .filter((mem) => team.memberIds.includes(mem.id))
          .map((mem) => mem.email);

        createdTeam.memberIds = teamMemberEmails;
        createdTeams.push(createdTeam);
      }
    } catch (teamError) {
      console.error(`Error processing team ${team.name}:`, teamError);
      // Continue with other teams
    }
  }

  return createdTeams;
};
