import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, TeamMemberResponse, AddTeamMemberInput } from "@/lib/types/api";

// Helper to check if user is team admin
async function isTeamAdmin(teamId: string, userId: string) {
  const member = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId,
      isAdmin: true,
    },
  });
  return !!member;
}

// Helper to check if user is team owner
async function isTeamOwner(clerkId: string, teamId: string) {
  const user = await prisma.appUser.findUnique({
    where: { clerkId },
  });

  if (!user) return false;

  const team = await prisma.gTeam.findFirst({
    where: {
      id: teamId,
      ownerId: user.id,
    },
  });

  return !!team;
}

// Helper to get or create user by email
async function getOrCreateUser(email: string) {
  let user = await prisma.appUser.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.appUser.create({
      data: {
        email,
        clerkId: null, // This user doesn't have a Clerk account yet
      },
    });
  }

  return user;
}

// GET /api/teams/[teamId]/members - List team members
export async function GET(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>({
        success: false,
        error: "Unauthorized",
      }, { status: 401 });
    }

    // Check if user is owner first
    const isOwner = await isTeamOwner(userId, params.teamId);
    
    // If not owner, check if they're a team member
    if (!isOwner) {
      const user = await prisma.appUser.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        return NextResponse.json<ApiResponse<never>>({
          success: false,
          error: "User not found",
        }, { status: 404 });
      }

      const membership = await prisma.teamMember.findFirst({
        where: {
          teamId: params.teamId,
          userId: user.id,
        },
      });

      if (!membership) {
        return NextResponse.json<ApiResponse<never>>({
          success: false,
          error: "Access denied",
        }, { status: 403 });
      }
    }

    // Get all team members
    const members = await prisma.teamMember.findMany({
      where: {
        teamId: params.teamId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json<ApiResponse<TeamMemberResponse[]>>({
      success: true,
      data: members as TeamMemberResponse[],
    });

  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json<ApiResponse<never>>({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
}

// POST /api/teams/[teamId]/members - Add new member
export async function POST(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>({
        success: false,
        error: "Unauthorized",
      }, { status: 401 });
    }

    // Check if user is owner first
    const isOwner = await isTeamOwner(userId, params.teamId);
    
    // If not owner, check if they're an admin
    if (!isOwner) {
      const isAdmin = await isTeamAdmin(params.teamId, userId);
      if (!isAdmin) {
        return NextResponse.json<ApiResponse<never>>({
          success: false,
          error: "Only team owners or admins can add members",
        }, { status: 403 });
      }
    }

    // const body = await req.json();
    // const { email, title, isAdmin = false } = body as AddTeamMemberInput;

       // Handle FormData
       const formData = await req.formData();
       const email = formData.get('email') as string;
       const fullName = formData.get('fullName') as string;
       const title = formData.get('title') as string;
       const isAdmin = formData.get('isAdmin') === 'true';
       const jobGradeId = formData.get('jobGradeId') as string;
       const joinedDate = formData.get('joinedDate') as string;
       const profilePhoto = formData.get('profilePhoto') as File;

    if (!email?.trim()) {
      return NextResponse.json<ApiResponse<never>>({
        success: false,
        error: "Email is required",
      }, { status: 400 });
    }

    if (!fullName?.trim()) {
      return NextResponse.json<ApiResponse<never>>({
        success: false,
        error: "Full name is required",
      }, { status: 400 });
    }

    // Get or create user
    // const userToAdd = await getOrCreateUser(email.trim());
    // Get or create user with name
    const userToAdd = await prisma.appUser.upsert({
      where: { email: email.trim() },
      update: { name: fullName.trim() },
      create: {
        email: email.trim(),
        name: fullName.trim(),
        clerkId: null,
      },
    });

    // Check if user is already a member
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        teamId: params.teamId,
        userId: userToAdd.id,
      },
    });

    if (existingMember) {
      return NextResponse.json<ApiResponse<never>>({
        success: false,
        error: "User is already a team member",
      }, { status: 400 });
    }

     // Handle profile photo upload if present
     let profilePhotoUrl = null;
     if (profilePhoto) {
       // Implement your file upload logic here
       // profilePhotoUrl = await uploadFile(profilePhoto);
     }

// Add member
const member = await prisma.teamMember.create({
  data: {
    teamId: params.teamId,
    userId: userToAdd.id,
    title: title?.trim() || null,
    isAdmin,
    jobGradeId: jobGradeId || null,
    joinedDate: joinedDate ? new Date(joinedDate) : null,
    // profilePhotoUrl,
  },
  include: {
    user: {
      select: {
        id: true,
        email: true,
        name: true,
      },
    },
  },
});

    return NextResponse.json<ApiResponse<TeamMemberResponse>>({
      success: true,
      data: member as TeamMemberResponse,
    }, { status: 201 });

  } catch (error) {
    console.error("Error adding team member:", error);
    return NextResponse.json<ApiResponse<never>>({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
}