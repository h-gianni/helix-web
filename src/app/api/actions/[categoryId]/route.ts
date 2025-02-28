import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from "@clerk/nextjs/server";
import { withErrorHandler } from '@/lib/api/error-handler'
import { ApiResponse, OrgActionResponse } from '@/lib/types/api';
import { ActionCategory } from '@/lib/types/api/action';


interface ActionCategoryResponse {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  actions: 
    {
      id: string;
      name: string;
      description: string | null;
      impactScale: number | null;
      _count: {
        orgActions: number
      }
    }[]
  
}

export async function GET(request: Request, { params }: { params: { categoryId: string } }) { 

  
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  const actions = await prisma.actionCategory.findMany({
    where: {
      id: params.categoryId
    },
    include: {
      actions: {
        select: {
          id: true,
          name: true,
          description: true,
          impactScale: true,
          _count: {
            select: {
              orgActions: true
            }
          }
        }
      }
    }

  })

   if (!actions) {
        return NextResponse.json<ApiResponse<never>>(
          { success: false, error: "Activity not found" },
          { status: 404 }
        );
      }

       return NextResponse.json<ApiResponse<ActionCategoryResponse[]>>({
            success: true,
            data: actions.map(action => ({
              ...action,
              createdAt: action.createdAt.toISOString(),
              updatedAt: action.updatedAt.toISOString(),
            }))
        })
}
