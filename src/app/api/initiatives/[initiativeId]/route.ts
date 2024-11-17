// app/api/initiatives/[initiativeId]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, InitiativeResponse } from "@/lib/types/api";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get teamId from query parameter
    const url = new URL(request.url);
    const teamId = url.searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Team ID is required" },
        { status: 400 }
      );
    }

    const initiatives = await prisma.initiative.findMany({
      where: {
        teamId,
      },
      include: {
        scores: true,
        team: true,
        _count: {
          select: {
            scores: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json<ApiResponse<InitiativeResponse[]>>({
      success: true,
      data: initiatives as InitiativeResponse[],
    });
  } catch (error) {
    console.error("Error fetching initiatives:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { initiativeId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description } = body;

    const initiative = await prisma.initiative.update({
      where: { id: params.initiativeId },
      data: {
        name: name?.trim(),
        description: description?.trim() || null,
      },
      include: {
        scores: true,
        _count: {
          select: {
            scores: true,
          },
        },
      },
    });

    return NextResponse.json<ApiResponse<InitiativeResponse>>({
      success: true,
      data: initiative as InitiativeResponse,
    });
  } catch (error) {
    console.error("Error updating initiative:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { initiativeId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.initiative.delete({
      where: { id: params.initiativeId },
    });

    return NextResponse.json<ApiResponse<void>>({
      success: true,
      data: undefined,
    });
  } catch (error) {
    console.error("Error deleting initiative:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}