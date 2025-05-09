import { Prisma, PrismaClient } from "@prisma/client";

type TransactionClient = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never>,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export interface OrganizationInput {
  name: string;
  siteDomain: string;
}

export interface OrganizationResult {
  orgNameRecord: any | null;
}

export const manageOrganization = async (
  tx: TransactionClient,
  userId: string,
  organization: OrganizationInput,
  userCustomFields?: any
): Promise<OrganizationResult> => {
  let orgNameRecord = null;

  try {
    // Find existing organization
    orgNameRecord = await tx.orgName.findFirst({
      where: { userId },
    });

    // Update if exists, otherwise create
    if (orgNameRecord) {
      orgNameRecord = await tx.orgName.update({
        where: { id: orgNameRecord.id },
        data: {
          name: organization.name.trim(),
          siteDomain: organization.siteDomain.trim(),
        },
      });
    } else {
      orgNameRecord = await tx.orgName.create({
        data: {
          name: organization.name.trim(),
          siteDomain: organization.siteDomain.trim(),
          userId,
        },
      });
    }
  } catch (err) {
    console.error("Error managing organization name:", err);

    // Fallback to storing in user customFields
    if (userCustomFields !== undefined) {
      await tx.appUser.update({
        where: { id: userId },
        data: {
          customFields: {
            ...((userCustomFields as object) || {}),
            organizationName: organization.name.trim(),
          },
        },
      });
    }
  }

  return { orgNameRecord };
};
