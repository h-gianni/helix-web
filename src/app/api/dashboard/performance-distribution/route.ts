import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withErrorHandler } from '@/lib/api/error-handler'
import { getAuthenticatedUser } from "@/lib/api/auth-helpers";
import { ApiResponse } from '@/lib/types/api';

interface PerformanceCategory {
    name: string;
    value: number;
    minRating?: number;
    maxRating?: number;
  }


export const GET = async () => {

    const authResult = await getAuthenticatedUser();

     // If the result is a NextResponse, it's an error response
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const userId = authResult;

    try {

       const user = await prisma.appUser.findUnique({
        where: {clerkId: userId },
        include: {
            teams: true,
            teamMembers: {
                include: {
                    team: true
                }
            }
        }
       });

       

       if(!user) {
        return NextResponse.json<ApiResponse<never>>(
            {success: false, error: 'User Not found'},
            {status: 404}
        )
       }

        // Collect all team IDs user has access to
        const teamIds = new Set([
            ...user.teams.map(team => team.id),
            ...user.teamMembers.map(member => member.teamId)
        ])



const members = await prisma.teamMember.findMany({
    where: {
        teamId: { in: Array.from(teamIds)},
        deletedAt: null
    },
    include: {
        scores: {
            select: {
                value: true
            }
        }
    }
})

console.log(members, "ahjsdvbsd---------------")

  // Define performance categories
  const categories: PerformanceCategory[] = [
    { name: "Star", value: 0, minRating: 4.5, maxRating: 5.0 },
    { name: "Strong", value: 0, minRating: 4.0, maxRating: 4.49 },
    { name: "Solid", value: 0, minRating: 3.0, maxRating: 3.99 },
    { name: "Lower", value: 0, minRating: 2.0, maxRating: 2.99 },
    { name: "Poor", value: 0, minRating: 0, maxRating: 1.99 },
    { name: "Not Scored", value: 0 }
  ];

  members.forEach(member => {
    if(member.scores.length === 0) {
        // If member has no scores, add to "Not Scored" category
        categories.find(cat=>cat.name === "Not Scored")!.value++
    }else {
        // Calculate average score
        const totalScore = member.scores.reduce((sum, score) => sum + score.value, 0);
        const averageScore = totalScore / member.scores.length;

// Find matching category
const category = categories.find(cat => 
    cat.minRating !== undefined && 
    cat.maxRating !== undefined &&
    averageScore >= cat.minRating && 
    averageScore <= cat.maxRating
  );

  if (category) {
    category.value++;
  }
    }

  });

   // Filter out empty categories
   const distribution = categories.filter(cat => cat.value > 0);


       
   return NextResponse.json<ApiResponse<PerformanceCategory[]>>({
    success: true,
    data: distribution,
  });

    } catch (error) {
        return NextResponse.json<ApiResponse<never>>(
            { success: false, error: "Internal server error" },
            { status: 500 }
          );
        
    }

   
 
  
   
  }