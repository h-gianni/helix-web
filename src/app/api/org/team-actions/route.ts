import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { a } from "node_modules/framer-motion/dist/types.d-B50aGbjN";

export async function GET(
  request: Request,
  { params }: { params: { orgId: string } }
) {
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

    // Get all actions for the organization
    const teamActions = await prisma.orgTeamActions.findMany({
      where: {
        orgId: orgId || "",
        // createdBy: userId,
        // action: {
        //   category: {
        //     isGlobal: false // Only get non-global actions
        //   }
        // }
        deletedAt: null,
      },
      include: {
        action: {
          include: {
            category: true
          }
        }
      }
    });

    console.log('teamActions from org/team-actions------------------', teamActions)

    return NextResponse.json({
      success: true,
      data: {
        teamActions
      }
    });
  } catch (error) {
    console.error("Error fetching team actions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch team actions" },
      { status: 500 }
    );
  }
} 