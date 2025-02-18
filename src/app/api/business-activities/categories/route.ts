// app/api/business-activities/categories/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type {
  ApiResponse,
  BusinessActivityCategoryResponse as CategoryResponse,
  CreateBusinessActivityCategoryInput as CreateCategoryInput,
  JsonValue,
} from "@/lib/types/api";

export async function GET(request: Request) {
  console.log('Available Prisma models:', Object.keys(prisma))
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Using the correct model name based on your Prisma schema
    const categories = await prisma.activityCategory.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        activities: {
          select: {
            id: true,
            name: true,
            description: true,
            impactScale: true,
            businessActivities: {
              select: {
                id: true,
                name: true,
                status: true,
                priority: true,
              },
            },
          },
        },
        _count: {
          select: {
            activities: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const categoriesResponse: CategoryResponse[] = categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
      _count: {
        activities: category._count.activities,
      },
      activities: category.activities.map(activity => ({
        id: activity.id,
        name: activity.name,
        description: activity.description,
        impactScale: activity.impactScale,
        businessActivities: activity.businessActivities
      }))
    }));

    return NextResponse.json<ApiResponse<CategoryResponse[]>>({
      success: true,
      data: categoriesResponse,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
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

    const body: CreateCategoryInput = await request.json();
    const { name, description } = body;

    if (!name?.trim()) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    // Check for duplicate category names
    const existingCategory = await prisma.activityCategory.findFirst({
      where: {
        name: name.trim(),
      },
    });

    if (existingCategory) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Category with this name already exists" },
        { status: 400 }
      );
    }

    // Create new category
    const category = await prisma.activityCategory.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            activities: true,
          },
        },
      },
    });

    const categoryResponse: CategoryResponse = {
      id: category.id,
      name: category.name,
      description: category.description,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
      _count: {
        activities: category._count.activities,
      },
      activities: []
    };

    return NextResponse.json<ApiResponse<CategoryResponse>>(
      { success: true, data: categoryResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}