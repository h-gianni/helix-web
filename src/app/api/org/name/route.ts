import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/lib/types/api";
import { Prisma } from "@prisma/client";

interface OrganizationNameInput {
  name: string;
  siteDomain: string;
}

interface OrganizationNameResponse {
  id: string;
  name: string;
  siteDomain: string;
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

    const body: OrganizationNameInput = await request.json();
    const { name, siteDomain } = body;

    if (!name?.trim() || !siteDomain?.trim()) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Organization name and site domain are required" },
        { status: 400 }
      );
    }

    // Start transaction
    try {
      const result = await prisma.$transaction(
        async (tx) => {
          // Check if organization name already exists
          const existingOrg = await tx.orgName.findFirst({
            where: {
              OR: [
                { name: name.trim() },
                { siteDomain: siteDomain.trim() }
              ]
            },
          });

          if (existingOrg) {
            throw new Error("Organization name or site domain already exists");
          }

          // Create new organization name
          const orgName = await tx.orgName.create({
            data: {
              name: name.trim(),
              siteDomain: siteDomain.trim(),
              userId: user.id
            },
          });

          // Update user's custom fields with organization info
          await tx.appUser.update({
            where: { id: user.id },
            data: {
              customFields: {
                ...(user.customFields as object || {}),
                organizationId: orgName.id,
                organizationName: orgName.name,
                organizationSiteDomain: orgName.siteDomain,
              },
            },
          });

          return orgName;
        },
        {
          maxWait: 10000, // 10 seconds max wait time
          timeout: 30000, // 30 seconds timeout
          isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
        }
      );

      const response: OrganizationNameResponse = {
        id: result.id,
        name: result.name,
        siteDomain: result.siteDomain || "",
      };

      return NextResponse.json<ApiResponse<OrganizationNameResponse>>(
        { success: true, data: response },
        { status: 201 }
      );
    } catch (txError) {
      console.error("Transaction error:", txError);
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: txError instanceof Error ? txError.message : "Transaction failed",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating organization name:", error);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
} 