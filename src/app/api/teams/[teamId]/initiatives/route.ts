// app/api/teams/[teamId]/initiatives/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { PrismaClient } from "@prisma/client";
import type { ApiResponse } from "@/lib/types/api";

type TransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

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

    const { initiativeIds } = await request.json();

    await prisma.$transaction(async (tx: TransactionClient) => {
      // Delete existing relationships
      await tx.teamInitiative.deleteMany({
        where: { teamId: params.teamId },
      });

      // Create new relationships
      await tx.teamInitiative.createMany({
        data: initiativeIds.map((initiativeId: string) => ({
          teamId: params.teamId,
          initiativeId,
        })),
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating team initiatives:", error);
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

    const teamInitiatives = await prisma.teamInitiative.findMany({
      where: { teamId: params.teamId },
      include: {
        initiative: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: teamInitiatives,
    });
  } catch (error) {
    console.error("Error fetching team initiatives:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
