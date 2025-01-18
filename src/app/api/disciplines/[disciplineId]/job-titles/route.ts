// app/api/disciplines/[disciplineId]/job-titles/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { 
  ApiResponse,
  JobTitleResponse 
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

    const jobTitles = await prisma.jobTitle.findMany({
      where: { 
        disciplineId: params.disciplineId,
        deletedAt: null,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json<ApiResponse<JobTitleResponse[]>>({
      success: true,
      data: jobTitles as JobTitleResponse[],
    });
  } catch (error) {
    console.error("Error fetching job titles:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
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

    const { name } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Job title name is required" },
        { status: 400 }
      );
    }

    // Check if discipline exists
    const discipline = await prisma.discipline.findUnique({
      where: { id: params.disciplineId },
    });

    if (!discipline) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Discipline not found" },
        { status: 404 }
      );
    }

    // Create job title
    const jobTitle = await prisma.jobTitle.create({
      data: {
        name: name.trim(),
        disciplineId: params.disciplineId,
      },
    });

    return NextResponse.json<ApiResponse<JobTitleResponse>>(
      { success: true, data: jobTitle as JobTitleResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating job title:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}