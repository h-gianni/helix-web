import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { PrismaClient, Prisma } from "@prisma/client";
import type { ApiResponse } from "@/lib/types/api";

type TransactionClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use">;

export async function PUT(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { activityIds } = await request.json();

    await prisma.$transaction(async (tx: TransactionClient) => {
      // Clear existing activities associations
      await tx.activity.updateMany({
        where: {
          id: {
            in: activityIds
          }
        },
        data: {
          teamId: null
        }
      });

      // Update activities with new team
      await tx.activity.updateMany({
        where: {
          id: {
            in: activityIds
          }
        },
        data: {
          teamId: params.teamId
        }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating team activities:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const activities = await prisma.activity.findMany({
      where: {
        teamId: params.teamId
      },
    });

    return NextResponse.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error("Error fetching team activities:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}