// app/api/disciplines/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { 
  ApiResponse, 
  DisciplineResponse, 
  CreateDisciplineInput 
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

    const disciplines = await prisma.discipline.findMany({
      include: {
        jobTitles: true,
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

    return NextResponse.json<ApiResponse<DisciplineResponse[]>>({
      success: true,
      data: disciplines,
    });
  } catch (error) {
    console.error("Error fetching disciplines:", error);
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

    const body = await request.json() as CreateDisciplineInput;
    const { name, description, jobTitles } = body;

    if (!name?.trim()) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Discipline name is required" },
        { status: 400 }
      );
    }

    const discipline = await prisma.discipline.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        jobTitles: {
          create: jobTitles?.map((title: string) => ({
            name: title.trim(),
          })) || [],
        },
      },
      include: {
        jobTitles: true,
      },
    });

    return NextResponse.json<ApiResponse<DisciplineResponse>>(
      { success: true, data: discipline },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating discipline:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}