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
    const categories = await prisma.actionCategory.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        actions: {
          select: {
            id: true,
            name: true,
            description: true,
            impactScale: true,
            orgActions: {
              select: {
                id: true,
                status: true,
                priority: true,
              },
            },
          },
        },
        _count: {
          select: {
            actions: true,
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
        activities: category._count.actions,
      },
      activities: category.actions.map(action => ({
        id: action.id,
        name: action.name,
        description: action.description,
        impactScale: action.impactScale,
        businessActivities: action.orgActions
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
    const existingCategory = await prisma.actionCategory.findFirst({
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
    const category = await prisma.actionCategory.create({
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
            actions: true,
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
        activities: category._count.actions,
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