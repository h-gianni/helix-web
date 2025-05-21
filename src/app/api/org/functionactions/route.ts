import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/lib/types/api";

// Configure route segment
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes

// GET - Fetch team/function actions for an organization
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

    const teamActions = await prisma.orgTeamActions.findMany({
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
        actions: teamActions,
      },
    });
  } catch (error) {
    console.error("Error fetching team actions:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new team/function actions
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

    // Fetch existing team actions
    const existingTeamActions = await prisma.orgTeamActions.findMany({
      where: { orgId, deletedAt: null },
      select: { id: true, actionId: true }
    });

    // Fetch actions with categories to ensure they are team actions (not global)
    const actionsWithCategories = await prisma.action.findMany({
      where: { id: { in: actions.map(a => a.actionId) } },
      include: { category: true }
    });

    // Filter for only team actions (not global)
    const teamActions = actions.filter(action => 
      !actionsWithCategories.find(a => a.id === action.actionId)?.category.isGlobal
    );

    // Create set of incoming actionIds
    const incomingActionIds = new Set(teamActions.map(a => a.actionId));

    // Find records to delete
    const actionsToDelete = existingTeamActions.filter(
      existing => !incomingActionIds.has(existing.actionId)
    );

    const results: any[] = [];

    // Delete unnecessary team actions
    if (actionsToDelete.length > 0) {
      const deleted = await prisma.orgTeamActions.deleteMany({
        where: {
          id: { in: actionsToDelete.map(a => a.id) }
        }
      });
      results.push({ operation: 'delete', count: deleted.count });
    }

    // Find new actions to create
    const newActions = teamActions.filter(action => 
      !existingTeamActions.some(existing => existing.actionId === action.actionId)
    );

    const batchSize = 10;

    // Create new team actions in batches
    for (let i = 0; i < newActions.length; i += batchSize) {
      const batch = newActions.slice(i, i + batchSize);
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
      results.push({ operation: 'create', actions: batchResults });
    }

    return NextResponse.json<ApiResponse<{ actions: any[] }>>({
      success: true,
      data: { actions: results },
    });
  } catch (error) {
    console.error("Error creating team actions:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete team/function actions
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
          prisma.orgTeamActions.update({
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
    console.error("Error deleting team actions:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
} 