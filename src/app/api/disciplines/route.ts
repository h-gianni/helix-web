// app/api/business-functions/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { 
  ApiResponse, 
  TeamFunctionResponse,
  CreateTeamFunctionInput,
} from "@/lib/types/api";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const businessFunctions = await prisma.teamFunction.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        customFields: true,
        jobTitles: {
          select: {
            id: true,
            name: true,
            teamFunctionId: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            customFields: true,
          },
        },
        _count: {
          select: {
            teams: true,
          },
        },
      },
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: 'asc',
      },
    });

    console.log("Fetched business functions:", businessFunctions);

    return NextResponse.json<ApiResponse<TeamFunctionResponse[]>>({
      success: true,
      data: businessFunctions as TeamFunctionResponse[],
    });
  } catch (error) {
    console.error("Error fetching business functions:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json() as CreateTeamFunctionInput;
    const { name, description, jobTitles, customFields } = body;

    if (!name?.trim()) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Business function name is required" },
        { status: 400 }
      );
    }

    // Check if name already exists (case-insensitive)
    const existingFunction = await prisma.teamFunction.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: 'insensitive',
        },
        deletedAt: null,
      },
    });

    if (existingFunction) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Business function with this name already exists" },
        { status: 400 }
      );
    }

    const businessFunction = await prisma.teamFunction.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        customFields,
        jobTitles: {
          create: jobTitles?.map((title: string) => ({
            name: title.trim(),
          })) || [],
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        customFields: true,
        jobTitles: {
          select: {
            id: true,
            name: true,
            teamFunctionId: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            customFields: true,
          },
        },
      },
    });

    return NextResponse.json<ApiResponse<TeamFunctionResponse>>(
      { success: true, data: businessFunction as TeamFunctionResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating business function:", error);
    
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('Unique constraint failed')) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Business function with this name already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}