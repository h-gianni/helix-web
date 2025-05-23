import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/lib/types/api";

// Configure route segment
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes

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
    console.log('Received request:', { orgId, actions });

    if (!orgId || !actions || !Array.isArray(actions)) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Fetch existing global actions
    const existingGlobalActions = await prisma.orgGlobalActions.findMany({
      where: { orgId, deletedAt: null },
      select: { id: true, actionId: true }
    });
    console.log('Existing global actions:', existingGlobalActions);

    // Fetch actions with categories to ensure they are global
    const actionsWithCategories = await prisma.action.findMany({
      where: { id: { in: actions.map(a => a.actionId) } },
      include: { category: true }
    });
    console.log('Actions with categories:', actionsWithCategories);

    // Filter for only global actions
    const globalActions = actions.filter(action => {
      const matchingAction = actionsWithCategories.find(a => a.id === action.actionId);
      const isGlobal = matchingAction?.category?.isGlobal ?? false;
      console.log(`Action ${action.actionId} global status:`, isGlobal);
      return isGlobal;
    });
    console.log('Filtered global actions:', globalActions);

    // Create set of incoming actionIds
    const incomingActionIds = new Set(globalActions.map(a => a.actionId));
    console.log('Incoming action IDs:', Array.from(incomingActionIds));

    // Find records to delete
    const actionsToDelete = existingGlobalActions.filter(
      existing => !incomingActionIds.has(existing.actionId)
    );
    console.log('Actions to delete:', actionsToDelete);

    const results: any[] = [];

    // Delete unnecessary global actions
    if (actionsToDelete.length > 0) {
      const deleted = await prisma.orgGlobalActions.deleteMany({
        where: {
          id: { in: actionsToDelete.map(a => a.id) }
        }
      });
      results.push({ operation: 'delete', count: deleted.count });
      console.log('Deleted actions:', deleted);
    }

    // Find new actions to create
    const newActions = globalActions.filter(action => 
      !existingGlobalActions.some(existing => existing.actionId === action.actionId)
    );
    console.log('New actions to create:', newActions);

    const batchSize = 10;

    // Create new global actions in batches
    for (let i = 0; i < newActions.length; i += batchSize) {
      const batch = newActions.slice(i, i + batchSize);
      console.log(`Processing batch ${i/batchSize + 1}:`, batch);
      
      const batchResults = await Promise.all(
        batch.map(async action => {
          try {
            const result = await prisma.orgGlobalActions.create({
              data: {
                actionId: action.actionId,
                orgId,
                createdBy: user.id,
                status: action.status || "ACTIVE",
              },
              include: {
                action: true // Include the related action data
              }
            });
            console.log(`Created action: ${action.actionId}`, result);
            return result;
          } catch (error) {
            console.error(`Failed to create action ${action.actionId}:`, error);
            throw error;
          }
        })
      );
      results.push({ operation: 'create', actions: batchResults });
    }

    console.log('Final results:', results);

    return NextResponse.json<ApiResponse<{ actions: any[] }>>({
      success: true,
      data: { actions: results },
    });
  } catch (error) {
    console.error("Error creating global actions:", error);
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