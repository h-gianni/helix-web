import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// GET /api/org/members - Get all team members for an organization
export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get("orgId");

    if (!orgId) {
      return NextResponse.json(
        { success: false, error: "Organization ID is required" },
        { status: 400 }
      );
    }

    const members = await prisma.teamMember.findMany({
      where: {
        teamId: orgId,
        deletedAt: null,
      },
      select: {
        id: true,
        userId: true,
        teamId: true,
        title: true,
        isAdmin: true,
        status: true,
        firstName: true,
        lastName: true,
        photoUrl: true,
        joinedDate: true,
        jobGradeId: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: { members } });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

// POST /api/org/members - Create new team members
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orgId, members } = body;

    if (!orgId || !members || !Array.isArray(members)) {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Create all members in a transaction
    const createdMembers = await prisma.$transaction(async (tx) => {
      // First, check if a default team function exists
      let teamFunction = await tx.teamFunction.findFirst({
        where: {
          name: "Default"
        }
      });

      // If no default team function exists, create one
      if (!teamFunction) {
        teamFunction = await tx.teamFunction.create({
          data: {
            name: "Default",
            description: "Default team function created during member onboarding"
          }
        });
      }

      // Check if a team exists for this org
      let team = await tx.gTeam.findFirst({
        where: {
          id: orgId
        }
      });

      // If no team exists, create a default team
      if (!team) {
        team = await tx.gTeam.create({
          data: {
            id: orgId,
            name: "Default Team",
            description: "Default team created during member onboarding",
            teamFunctionId: teamFunction.id,
            ownerId: userId
          }
        });
      }

      // Now create the members
      return Promise.all(
        members.map((member) =>
          tx.teamMember.create({
            data: {
              team: {
                connect: {
                  id: team.id
                }
              },
              title: member.title || "",
              isAdmin: member.isAdmin || false,
              firstName: member.firstName,
              lastName: member.lastName,
              photoUrl: member.photoUrl,
              joinedDate: member.joinedDate || new Date(),
              jobGradeId: member.jobGradeId,
              status: member.status || "ACTIVE",
              user: {
                create: {
                  email: member.email,
                  name: `${member.firstName} ${member.lastName}`.trim()
                }
              }
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
          })
        )
      );
    });

    return NextResponse.json({ success: true, data: { members: createdMembers } });
  } catch (error) {
    console.error("Error creating team members:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create team members" },
      { status: 500 }
    );
  }
}

// PATCH /api/org/members - Update existing team members
export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orgId, members } = body;

    if (!orgId || !members || !Array.isArray(members)) {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Update all members in a transaction
    const updatedMembers = await prisma.$transaction(
      members.map((member) =>
        prisma.teamMember.update({
          where: {
            id: member.id,
            teamId: orgId,
          },
          data: {
            title: member.title,
            isAdmin: member.isAdmin,
            firstName: member.firstName,
            lastName: member.lastName,
            photoUrl: member.photoUrl,
            joinedDate: member.joinedDate,
            jobGradeId: member.jobGradeId,
            status: member.status,
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
        })
      )
    );

    return NextResponse.json({ success: true, data: { members: updatedMembers } });
  } catch (error) {
    console.error("Error updating team members:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update team members" },
      { status: 500 }
    );
  }
}

// DELETE /api/org/members - Delete team members
export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get("orgId");
    const memberIds = searchParams.get("memberIds")?.split(",");

    if (!orgId || !memberIds || !Array.isArray(memberIds)) {
      return NextResponse.json(
        { success: false, error: "Organization ID and member IDs are required" },
        { status: 400 }
      );
    }

    // Soft delete all specified members in a transaction
    await prisma.$transaction(
      memberIds.map((memberId) =>
        prisma.teamMember.update({
          where: {
            id: memberId,
            teamId: orgId,
          },
          data: {
            deletedAt: new Date(),
          },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting team members:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete team members" },
      { status: 500 }
    );
  }
} 