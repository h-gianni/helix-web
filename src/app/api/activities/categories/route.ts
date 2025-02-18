import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withErrorHandler } from '@/lib/api/error-handler'


export const GET = withErrorHandler(async () => {
    const categories = await prisma.activityCategory.findMany({
      include: {
        activities: {
          select: {
            id: true,
            name: true,
            description: true,
            impactScale: true,
            _count: {
              select: {
                businessActivities: true
              }
            }
          }
        }
      }
    })
  
    return NextResponse.json({ success: true, data: categories })
  })