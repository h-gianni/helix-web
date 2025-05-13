import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/lib/types/api";

// Configure body parser limits
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Adjust based on your needs
    },
  },
};

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

    // Fetch actions with their categories
    const actionsWithCategories = await prisma.action.findMany({
      where: {
        id: {
          in: actions.map(a => a.actionId)
        }
      },
      include: {
        category: true
      }
    });

    // Separate actions based on category type
    const globalActions: any[] = [];
    const teamActions: any[] = [];

    actions.forEach(action => {
      const actionWithCategory = actionsWithCategories.find(a => a.id === action.actionId);
      if (actionWithCategory?.category.isGlobal) {
        globalActions.push(action);
      } else {
        teamActions.push(action);
      }
    });

    // Define batch size to prevent transaction timeouts
    const batchSize = 10; // Adjust based on your needs
    const createdGlobalActions: any[] = [];
    const createdTeamActions: any[] = [];

    // Process global actions in batches
    for (let i = 0; i < globalActions.length; i += batchSize) {
      const batch = globalActions.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(action =>
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
      createdGlobalActions.push(...batchResults);
    }

    // Process team actions in batches
    for (let i = 0; i < teamActions.length; i += batchSize) {
      const batch = teamActions.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(action =>
          prisma.orgTeamActions.create({
            data: {
              actionId: action.actionId,
              orgId,
              createdBy: user.id,
              status: action.status || "ACTIVE",
            },
          })
        )
      );
      createdTeamActions.push(...batchResults);
    }

    const result = [
      { OrgGlobalActions: createdGlobalActions },
      { OrgTeamActions: createdTeamActions }
    ];

    return NextResponse.json<ApiResponse<{ actions: any[] }>>({
      success: true,
      data: {
        actions: result,
      },
    });
  } catch (error) {
    console.error("Error creating actions:", error);
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

    const batchSize = 10;
    const results: any[] = [];
    
    // Process creates in batches
    for (let i = 0; i < actionsToCreate.length; i += batchSize) {
      const batch = actionsToCreate.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(action =>
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
      results.push(...batchResults);
    }
    
    // Process updates in batches
    for (let i = 0; i < actionsToUpdate.length; i += batchSize) {
      const batch = actionsToUpdate.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(action =>
          prisma.orgGlobalActions.update({
            where: { id: action.id },
            data: {
              status: action.status,
              updatedAt: new Date(),
            },
          })
        )
      );
      results.push(...batchResults);
    }
    
    // Process deletes in batches
    for (let i = 0; i < actionsToDelete.length; i += batchSize) {
      const batch = actionsToDelete.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(action =>
          prisma.orgGlobalActions.update({
            where: { id: action.id },
            data: {
              deletedAt: new Date(),
            },
          })
        )
      );
      results.push(...batchResults);
    }

    return NextResponse.json<ApiResponse<{ actions: any[] }>>({
      success: true,
      data: {
        actions: results,
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
    const idsParam = searchParams.get("ids");
    
    if (!idsParam) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Action IDs are required" },
        { status: 400 }
      );
    }
    
    const ids = idsParam.split(",");

    if (ids.length === 0) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Action IDs are required" },
        { status: 400 }
      );
    }

    const batchSize = 10;
    const deletedActions: any[] = [];
    
    // Process deletes in batches
    for (let i = 0; i < ids.length; i += batchSize) {
      const batchIds = ids.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batchIds.map(id =>
          prisma.orgGlobalActions.update({
            where: { id },
            data: {
              deletedAt: new Date(),
            },
          })
        )
      );
      deletedActions.push(...batchResults);
    }

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