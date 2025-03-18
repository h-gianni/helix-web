// app/api/activities/[activityId]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { 
  ApiResponse, 
  BusinessActivityResponse,
  OrgActionResponse,
  UpdateBusinessActivityInput as UpdateActivityInput 
} from "@/lib/types/api";

export async function GET(
  request: Request,
  { params }: { params: { activityId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const activity = await prisma.orgAction.findUnique({
      where: { 
        id: params.activityId,
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            scores: true,
          },
        },
        action:{
          include: {
            category: true
          }
        },
        team: {
          select: {
            id: true,
            name: true
          }
        }
      },

    });

    if (!activity) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Activity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<OrgActionResponse>>({
      success: true,
      data: {
        id: activity.id,
        name: activity.action.name, // This comes from the relation
        description: activity.action.description,
        actionId: activity.actionId,
        category: {
          id: activity.action.category.id,
          name: activity.action.category.name,
          description: activity.action.category.description,
        },
        priority: activity.priority,
        status: activity.status,
        dueDate: activity.dueDate?.toISOString() ?? null,
        teamId: activity.teamId,
        createdBy: activity.createdBy,
        createdAt: activity.createdAt.toISOString(),
        updatedAt: activity.updatedAt.toISOString(),
        deletedAt: activity.deletedAt?.toISOString() ?? null,
        customFields: typeof activity.customFields === 'string' 
          ? JSON.parse(activity.customFields) 
          : activity.customFields,
        action: {
          id: activity.action.id,
          name: activity.action.name,
          description: activity.action.description,
          impactScale: activity.action.impactScale,
          category: {
            id: activity.action.category.id,
            name: activity.action.category.name,
            description: activity.action.category.description,
          }
        },
        team: {
          id: activity.team.id,
          name: activity.team.name,
        },
        _count: activity._count
      }
    });
  } catch (error) {
    console.error("Error fetching activity:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// export async function PATCH(
//   request: Request,
//   { params }: { params: { activityId: string } }
// ) {
//   try {
//     const { userId } = await auth();
//     if (!userId) {
//       return NextResponse.json<ApiResponse<never>>(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const body = await request.json() as UpdateActivityInput;
//     const { name, description } = body;

//     if (!name?.trim()) {
//       return NextResponse.json<ApiResponse<never>>(
//         { success: false, error: "Name is required" },
//         { status: 400 }
//       );
//     }

//     const activity = await prisma.orgAction.update({
//       where: { id: params.activityId },
//       data: {
//         name: name.trim(),
//         description: description?.trim() || null,
//       },
//       include: {
//         _count: {
//           select: {
//             scores: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json<ApiResponse<BusinessActivityResponse>>({
//       success: true,
//       data: activity
//     });
//   } catch (error) {
//     console.error("Error updating activity:", error);
//     return NextResponse.json<ApiResponse<never>>(
//       { success: false, error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

export async function DELETE(
  request: Request,
  { params }: { params: { activityId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if activity has any ratings
    const activity = await prisma.orgAction.findUnique({
      where: { id: params.activityId },
      include: {
        _count: {
          select: {
            scores: true,
          },
        },
      },
    });

    if (!activity) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Activity not found" },
        { status: 404 }
      );
    }

    if (activity._count.scores > 0) {
      // Soft delete if activity has ratings
      await prisma.orgAction.update({
        where: { id: params.activityId },
        data: { deletedAt: new Date() },
      });
    } else {
      // Hard delete if no ratings exist
      await prisma.orgAction.delete({
        where: { id: params.activityId },
      });
    }

    return NextResponse.json<ApiResponse<void>>({
      success: true,
      data: undefined,
    });
  } catch (error) {
    console.error("Error deleting activity:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}