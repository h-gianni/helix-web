import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { 
  ApiResponse, 
  TeamFunctionResponse,
  UpdateTeamFunctionInput
} from "@/lib/types/api";

export async function GET(
  request: Request,
  { params }: { params: { teamFunctionId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const teamFunction = await prisma.teamFunction.findUnique({
      where: { 
        id: params.teamFunctionId,
        deletedAt: null,
      },
      include: {
        jobTitles: true,
        _count: {
          select: {
            teams: true,
          },
        },
      },
    });

    if (!teamFunction) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Team function not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<TeamFunctionResponse>>({
      success: true,
      data: teamFunction as TeamFunctionResponse,
    });
  } catch (error) {
    console.error("Error fetching team function:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { teamFunctionId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json() as UpdateTeamFunctionInput;
    const { name, description } = body;

    if (!name?.trim()) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const teamFunction = await prisma.teamFunction.update({
      where: { id: params.teamFunctionId },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
      include: {
        jobTitles: true,
        _count: {
          select: {
            teams: true,
          },
        },
      },
    });

    return NextResponse.json<ApiResponse<TeamFunctionResponse>>({
      success: true,
      data: teamFunction as TeamFunctionResponse,
    });
  } catch (error) {
    console.error("Error updating team function:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { teamFunctionId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Soft delete by setting deletedAt
    await prisma.teamFunction.update({
      where: { id: params.teamFunctionId },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json<ApiResponse<void>>({
      success: true,
      data: undefined,
    });
  } catch (error) {
    console.error("Error deleting team function:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}