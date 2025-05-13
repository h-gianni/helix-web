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

    // Fetch existing records
    const existingGlobalActions = await prisma.orgGlobalActions.findMany({
      where: { orgId, deletedAt: null },
      select: { id: true, actionId: true }
    });
    const existingTeamActions = await prisma.orgTeamActions.findMany({
      where: { orgId, deletedAt: null },
      select: { id: true, actionId: true }
    });

    // Fetch actions with categories
    const actionsWithCategories = await prisma.action.findMany({
      where: { id: { in: actions.map(a => a.actionId) } },
      include: { category: true }
    });

    // Create sets of incoming actionIds for quick lookup
    const incomingGlobalActionIds = new Set(
      actions.filter(action => 
        actionsWithCategories.find(a => a.id === action.actionId)?.category.isGlobal
      ).map(a => a.actionId)
    );

    const incomingTeamActionIds = new Set(
      actions.filter(action => 
        !actionsWithCategories.find(a => a.id === action.actionId)?.category.isGlobal
      ).map(a => a.actionId)
    );

    // Find records to delete
    const globalActionsToDelete = existingGlobalActions.filter(
      existing => !incomingGlobalActionIds.has(existing.actionId)
    );
    const teamActionsToDelete = existingTeamActions.filter(
      existing => !incomingTeamActionIds.has(existing.actionId)
    );

    const results: any[] = [];
console.log("Global Actions to delete:", globalActionsToDelete);
    // Delete unnecessary global actions
    if (globalActionsToDelete.length > 0) {
      const deletedGlobal = await prisma.orgGlobalActions.deleteMany({
        where: {
          id: { in: globalActionsToDelete.map(a => a.id) }
        }
      });
      results.push({ type: 'global', operation: 'delete', count: deletedGlobal.count });
    }

    // Delete unnecessary team actions
    if (teamActionsToDelete.length > 0) {
      const deletedTeam = await prisma.orgTeamActions.deleteMany({
        where: {
          id: { in: teamActionsToDelete.map(a => a.id) }
        }
      });
      results.push({ type: 'team', operation: 'delete', count: deletedTeam.count });
    }

    // Handle creation of new records
    const newGlobalActions = actions.filter(action => {
      const isGlobal = actionsWithCategories.find(a => a.id === action.actionId)?.category.isGlobal;
      return isGlobal && !existingGlobalActions.some(existing => existing.actionId === action.actionId);
    });

    const newTeamActions = actions.filter(action => {
      const isGlobal = actionsWithCategories.find(a => a.id === action.actionId)?.category.isGlobal;
      return !isGlobal && !existingTeamActions.some(existing => existing.actionId === action.actionId);
    });

    const batchSize = 10;

    // Create new global actions
    for (let i = 0; i < newGlobalActions.length; i += batchSize) {
      const batch = newGlobalActions.slice(i, i + batchSize);
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
      results.push({ type: 'global', operation: 'create', actions: batchResults });
    }

    // Create new team actions
    for (let i = 0; i < newTeamActions.length; i += batchSize) {
      const batch = newTeamActions.slice(i, i + batchSize);
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
      results.push({ type: 'team', operation: 'create', actions: batchResults });
    }

    return NextResponse.json<ApiResponse<{ actions: any[] }>>({
      success: true,
      data: { actions: results },
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