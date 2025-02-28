import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withErrorHandler } from '@/lib/api/error-handler'


export const GET = withErrorHandler(async () => {
    const categories = await prisma.actionCategory.findMany({
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

    // Transform the data into the requested format
    const formattedData: { [key: string]: string[] } = {};

  categories.forEach(category => {
    const slug = category.name.toLowerCase().replace(/\s+/g, '-');
    
    // Map the actions to their descriptions (or name as fallback)
    formattedData[slug] = category.actions.map(action => {
      return action.description || action.name;
    });
  });
  
    return NextResponse.json({ success: true, data: categories })
  })