import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/lib/types/api";

interface OnboardingStatus {
  isOnboardingComplete: boolean;
}

export async function GET() {
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
      include: {
        orgName: true,
        teams: true,
        teamMembers: true,
      },
    });

    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has completed onboarding
    const hasOrgName = user.orgName && user.orgName.length > 0;
    const hasTeams = user.teams && user.teams.length > 0;
    const hasTeamMembers = user.teamMembers && user.teamMembers.length > 0;

    const isOnboardingComplete = hasOrgName && (hasTeams || hasTeamMembers);


    console.log(isOnboardingComplete,'isOnboardingComplete------------------');
    return NextResponse.json<ApiResponse<OnboardingStatus>>({
      success: true,
      data: {
        isOnboardingComplete,
      },
    });
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
} 