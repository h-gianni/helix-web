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

    // Fetch organization data with only the needed fields
    const organizationData = await prisma.orgName.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        siteDomain: true,
        user: {
          select: {
            teams: {
              where: {
                deletedAt: null,
              },
              select: {
                id: true,
                name: true,
                description: true,
                teamMembers: {
                  select: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Transform the data structure to organizations > teams > user
    const restructuredData = organizationData.map((org) => {
      return {
        id: org.id,
        name: org.name,
        siteDomain: org.siteDomain,
        teams: org.user?.teams || [],
      };
    });

    return NextResponse.json<
      ApiResponse<{
        organizations: any[];
      }>
    >({
      success: true,
      data: {
        organizations: restructuredData,
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
