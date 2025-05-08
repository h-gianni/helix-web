import { Prisma, PrismaClient } from "@prisma/client";

type TransactionClient = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never>,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export interface ActivityInput {
  selected: string[];
  selectedByCategory: Record<string, string[]>;
}

export interface ProcessedTeam {
  id: string;
  customFields: any;
  [key: string]: any;
}

/**
 * Process activities and create organization actions
 */
export const processActions = async (
  tx: TransactionClient,
  activities: ActivityInput,
  teams: ProcessedTeam[],
  userId: string
): Promise<any[]> => {
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
      for (const team of teams) {
        const teamCategories = (team.customFields as any)?.categories || [];

        // Only create action for teams that have this category selected
        if (teamCategories.includes(categoryId)) {
          try {
            const createdAction = await tx.orgAction.create({
              data: {
                actionId,
                teamId: team.id,
                status: "ACTIVE",
                priority: "MEDIUM",
                createdBy: userId,
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

  return createdActions;
};
