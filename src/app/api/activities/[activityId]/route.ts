// app/api/activities/[activityId]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { 
  ApiResponse, 
  ActivityResponse,
  UpdateActivityInput 
} from "@/lib/types/api";

export async function GET(
  request: Request,
  { params }: { params: { activityId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const activity = await prisma.activity.findUnique({
      where: { 
        id: params.activityId,
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            ratings: true,
          },
        },
      },
    });

    if (!activity) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Activity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<ActivityResponse>>({
      success: true,
      data: activity as ActivityResponse,
    });
  } catch (error) {
    console.error("Error fetching activity:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { activityId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json() as UpdateActivityInput;
    const { name, description } = body;

    if (!name?.trim()) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.update({
      where: { id: params.activityId },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
      include: {
        _count: {
          select: {
            ratings: true,
          },
        },
      },
    });

    return NextResponse.json<ApiResponse<ActivityResponse>>({
      success: true,
      data: activity as ActivityResponse,
    });
  } catch (error) {
    console.error("Error updating activity:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { activityId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if activity has any ratings
    const activity = await prisma.activity.findUnique({
      where: { id: params.activityId },
      include: {
        _count: {
          select: {
            ratings: true,
          },
        },
      },
    });

    if (!activity) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Activity not found" },
        { status: 404 }
      );
    }

    if (activity._count.ratings > 0) {
      // Soft delete if activity has ratings
      await prisma.activity.update({
        where: { id: params.activityId },
        data: { deletedAt: new Date() },
      });
    } else {
      // Hard delete if no ratings exist
      await prisma.activity.delete({
        where: { id: params.activityId },
      });
    }

    return NextResponse.json<ApiResponse<void>>({
      success: true,
      data: undefined,
    });
  } catch (error) {
    console.error("Error deleting activity:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}