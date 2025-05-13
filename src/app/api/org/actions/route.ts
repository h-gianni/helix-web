import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/lib/types/api";

// GET - Fetch global actions for an organization
export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get("orgId");

    if (!orgId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Organization ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.appUser.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const globalActions = await prisma.orgGlobalActions.findMany({
      where: {
        orgId,
        deletedAt: null,
      },
      include: {
        action: true,
      },
    });

    return NextResponse.json<ApiResponse<{ actions: any[] }>>({
      success: true,
      data: {
        actions: globalActions,
      },
    });
  } catch (error) {
    console.error("Error fetching global actions:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new global actions
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
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const { orgId, actions } = await request.json();

    if (!orgId || !actions || !Array.isArray(actions)) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const createdActions = await prisma.$transaction(
      actions.map((action) =>
        prisma.orgGlobalActions.create({
          data: {
            actionId: action.actionId,
            orgId,
            createdBy: user.id,
            status: action.status || "ACTIVE",
          },
        })
      )
    );

    return NextResponse.json<ApiResponse<{ actions: any[] }>>({
      success: true,
      data: {
        actions: createdActions,
      },
    });
  } catch (error) {
    console.error("Error creating global actions:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update global actions
export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { orgId, actions } = await request.json();

    if (!orgId || !actions || !Array.isArray(actions)) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const user = await prisma.appUser.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Get existing actions for this org
    const existingActions = await prisma.orgGlobalActions.findMany({
      where: {
        orgId,
        deletedAt: null,
      },
    });

    const existingActionIds = new Set(existingActions.map(a => a.id));
    const newActionIds = new Set(actions.map(a => a.id));

    // Separate actions into categories
    const actionsToCreate = actions.filter(a => !a.id);
    const actionsToUpdate = actions.filter(a => existingActionIds.has(a.id));
    const actionsToDelete = existingActions.filter(a => !newActionIds.has(a.id));

    // Perform all operations in a transaction
    const result = await prisma.$transaction([
      // Create new actions
      ...actionsToCreate.map(action =>
        prisma.orgGlobalActions.create({
          data: {
            actionId: action.actionId,
            orgId,
            createdBy: user.id,
            status: action.status || "ACTIVE",
          },
        })
      ),
      // Update existing actions
      ...actionsToUpdate.map(action =>
        prisma.orgGlobalActions.update({
          where: { id: action.id },
          data: {
            status: action.status,
            updatedAt: new Date(),
          },
        })
      ),
      // Soft delete removed actions
      ...actionsToDelete.map(action =>
        prisma.orgGlobalActions.update({
          where: { id: action.id },
          data: {
            deletedAt: new Date(),
          },
        })
      ),
    ]);

    return NextResponse.json<ApiResponse<{ actions: any[] }>>({
      success: true,
      data: {
        actions: result,
      },
    });
  } catch (error) {
    console.error("Error updating global actions:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete global actions
export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const ids = searchParams.get("ids")?.split(",");

    if (!ids || ids.length === 0) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Action IDs are required" },
        { status: 400 }
      );
    }

    const deletedActions = await prisma.$transaction(
      ids.map((id) =>
        prisma.orgGlobalActions.update({
          where: { id },
          data: {
            deletedAt: new Date(),
          },
        })
      )
    );

    return NextResponse.json<ApiResponse<{ actions: any[] }>>({
      success: true,
      data: {
        actions: deletedActions,
      },
    });
  } catch (error) {
    console.error("Error deleting global actions:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
