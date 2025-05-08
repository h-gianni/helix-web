import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the user
    const user = await prisma.appUser.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch categories with their actions
    const categories = await prisma.actionCategory.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        actions: {
          select: {
            id: true,
            name: true,
            description: true,
            impactScale: true,
            orgActions: {
              where: {
                createdBy: user.id,
                deletedAt: null
              },
              select: {
                id: true,
                status: true,
                priority: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching user action categories:', error);
    return NextResponse.json(
      { error: "Failed to fetch user action categories" },
      { status: 500 }
    );
  }
} 