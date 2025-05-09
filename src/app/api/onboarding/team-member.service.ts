import { Prisma, PrismaClient } from "@prisma/client";

type TransactionClient = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never>,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export interface TeamMemberInput {
  id: string;
  fullName: string;
  email: string;
  jobTitle?: string;
}

export interface TeamMemberResult {
  id: { id: string };
  email: string;
}

export interface TeamWithMembers {
  id: string;
  memberIds: string[];
  [key: string]: any;
}

/**
 * Creates or finds app users for the provided team members
 */
export const processTeamMembers = async (
  tx: TransactionClient,
  teamMembers: TeamMemberInput[],
  invitedBy: string
): Promise<TeamMemberResult[]> => {
  const createdTeamMembers: TeamMemberResult[] = [];

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
            // Add job title if provided
            ...(member.jobTitle?.trim()
              ? { jobTitle: member.jobTitle.trim() }
              : {}),
            customFields: {
              invitedBy,
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

  return createdTeamMembers;
};

/**
 * Assigns team members to teams by creating TeamMember records
 */
export const assignTeamMemberships = async (
  tx: TransactionClient,
  teams: TeamWithMembers[],
  teamMembers: TeamMemberResult[]
): Promise<void> => {
  for (const team of teams) {
    for (const memberEmail of team.memberIds) {
      try {
        const appUser = teamMembers.find(
          (mem) => mem.email === memberEmail
        )?.id;

        if (!appUser) {
          console.warn(`User ${memberEmail} not found, skipping`);
          continue;
        }

        await tx.teamMember.create({
          data: {
            teamId: team.id,
            userId: appUser.id,
          },
        });
      } catch (teamMemberError) {
        console.error(
          `Error adding user ${memberEmail} to team ${team.id}:`,
          teamMemberError
        );
        // Continue with other team members
      }
    }
  }
};
