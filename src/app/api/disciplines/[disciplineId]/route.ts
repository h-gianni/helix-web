// app/api/disciplines/[disciplineId]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { 
  ApiResponse, 
  TeamFunctionResponse as  DisciplineResponse,
  UpdateTeamFunctionInput as UpdateDisciplineInput 
} from "@/lib/types/api";

export async function GET(
  request: Request,
  { params }: { params: { disciplineId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const discipline = await prisma.teamFunction.findUnique({
      where: { 
        id: params.disciplineId,
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

    if (!discipline) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Discipline not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<DisciplineResponse>>({
      success: true,
      data: discipline as DisciplineResponse,
    });
  } catch (error) {
    console.error("Error fetching discipline:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { disciplineId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json() as UpdateDisciplineInput;
    const { name, description } = body;

    if (!name?.trim()) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const discipline = await prisma.teamFunction.update({
      where: { id: params.disciplineId },
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

    return NextResponse.json<ApiResponse<DisciplineResponse>>({
      success: true,
      data: discipline as DisciplineResponse,
    });
  } catch (error) {
    console.error("Error updating discipline:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { disciplineId: string } }
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
      where: { id: params.disciplineId },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json<ApiResponse<void>>({
      success: true,
      data: undefined,
    });
  } catch (error) {
    console.error("Error deleting discipline:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}