import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/lib/types/api";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find the user by clerk ID
    const user = await prisma.appUser.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Get favorites from customFields or initialize empty object
    const customFields = user.customFields || {};
    const favorites = (customFields as any).favorites || {};

    // Fetch organization data and related records
    const organizationData = await prisma.orgName.findMany({
      where: { userId: user.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            subscriptionTier: true,
            customFields: true,
          },
        },
        // Include teams associated with the organization's user
        user: {
          select: {
            teams: {
              include: {
                teamFunction: true,
                teamMembers: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                      },
                    },
                    jobGrade: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json<
      ApiResponse<{
        favorites: Record<string, string[]>;
        organizations: any[];
      }>
    >({
      success: true,
      data: {
        favorites,
        organizations: organizationData,
      },
    });
  } catch (error) {
    console.error("Error fetching organization data:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
