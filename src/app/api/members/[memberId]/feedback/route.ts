// app/api/members/[memberId]/feedback/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, StructuredFeedbackResponse } from "@/lib/types/api";

export async function GET(
  request: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const feedback = await prisma.structuredFeedback.findMany({
      where: {
        teamMemberId: params.memberId,
      },
      include: {
        teamMember: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json<ApiResponse<StructuredFeedbackResponse[]>>({
      success: true,
      data: feedback as StructuredFeedbackResponse[],
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { memberId: string } }
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
    const { strengths, improvements, goals } = body;

    if (!Array.isArray(strengths) || !Array.isArray(improvements) || !Array.isArray(goals)) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Invalid feedback format" },
        { status: 400 }
      );
    }

    // Create feedback
    const feedback = await prisma.structuredFeedback.create({
      data: {
        teamMemberId: params.memberId,
        strengths,
        improvements,
        goals,
      },
      include: {
        teamMember: true,
      },
    });

    return NextResponse.json<ApiResponse<StructuredFeedbackResponse>>(
      { success: true, data: feedback as StructuredFeedbackResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating feedback:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}