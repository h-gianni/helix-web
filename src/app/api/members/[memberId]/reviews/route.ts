// app/api/members/[memberId]/reviews/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, PerformanceReviewResponse } from "@/lib/types/api";
import { z } from "zod";
import { OpenAI } from "openai";
import { ReviewStatus } from "@prisma/client";
import { generateReview, CategoryRatings } from "@/lib/ai/review-generator";

// Input schema for the request
const reviewRequestSchema = z.object({
  period: z.enum(['quarter', 'year', 'custom']).optional().default('quarter'),
  quarterNumber: z.number().min(1).max(4).optional(),
  year: z.number().optional(),
  customStartDate: z.string().optional(),
  customEndDate: z.string().optional(),
});

export type ReviewRequest = z.infer<typeof reviewRequestSchema>;

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.DEEP_SEEK_API_KEY,
  defaultHeaders: {
    // "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
    // "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
  },
});

export async function GET(
  request: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }



    // Get URL parameters for filtering
    const url = new URL(request.url);
   
    const year = url.searchParams.get("year");
    const quarter = url.searchParams.get("quarter");
    const status = url.searchParams.get("status") as ReviewStatus | null;

    // Build where clause
    const whereClause = {
      teamMemberId: params.memberId,
      ...(year && { year: parseInt(year) }),
      ...(quarter && { quarter: parseInt(quarter) }),
      ...(status && { status }),
    };

    const reviews = await prisma.performanceReview.findMany({
      where: whereClause,
      include: {
        teamMember: true,
      },
      orderBy: [
        { year: 'desc' },
        { quarter: 'desc' },
      ],
    });

    return NextResponse.json<ApiResponse<PerformanceReviewResponse[]>>({
      success: true,
      data: reviews as PerformanceReviewResponse[],
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// export async function POST(
//   request: Request,
//   { params }: { params: { memberId: string } }
// ) {
//   try {
//     const { userId } = await auth();
//     if (!userId) {
//       return NextResponse.json<ApiResponse<never>>(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const body = await request.json();
//     console.log("📦 Request body:------------", body);

//     const { quarter, year, teamId, content } = body;

//     if (!quarter || !year || !teamId) {
//       return NextResponse.json<ApiResponse<never>>(
//         { success: false, error: "Quarter, year, and content are required" },
//         { status: 400 }
//       );
//     }

//     if (quarter < 1 || quarter > 4) {
//       return NextResponse.json<ApiResponse<never>>(
//         { success: false, error: "Quarter must be between 1 and 4" },
//         { status: 400 }
//       );
//     }

//     // Check for existing review
//     const existingReview = await prisma.performanceReview.findFirst({
//       where: {
//         teamMemberId: params.memberId,
//         quarter,
//         year,
//       },
//     });

//     if (existingReview) {
//       return NextResponse.json<ApiResponse<never>>(
//         { success: false, error: "Review already exists for this quarter" },
//         { status: 400 }
//       );
//     }

//     // Create review
//     const review = await prisma.performanceReview.create({
//       data: {
//         teamMemberId: params.memberId,
//         quarter,
//         year,
//         content,
//         status: 'DRAFT',
//       },
//       include: {
//         teamMember: true,
//       },
//     });

//     return NextResponse.json<ApiResponse<PerformanceReviewResponse>>(
//       { success: true, data: review as PerformanceReviewResponse },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating review:", error);
//     return NextResponse.json<ApiResponse<never>>(
//       { success: false, error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }



export async function POST(
  request: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    // Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the team ID from request body
    // const { teamId, quarter, year } = await request.json();

    const body = await request.json();
    const validatedData = reviewRequestSchema.parse(body);
    
    // if (!teamId || !quarter || !year) {
    //   return NextResponse.json(
    //     { success: false, error: "Missing required parameters" },
    //     { status: 400 }
    //   );
    // }

    // Validate the member belongs to the team
  // Get the member to ensure they exist
  const teamMember = await prisma.teamMember.findUnique({
    where: { id: params.memberId },
    include: {
      user: true,
      team: true,
      jobGrade: true,
    }
  });
    if (!teamMember) {
      return NextResponse.json(
        { success: false, error: "Member not found in the specified team" },
        { status: 404 }
      );
    }

    // Calculate date range for the review period
    const { startDate, endDate } = calculateDateRange(validatedData);

    // Get ratings for this member
    const scores = await prisma.memberScore.findMany({
      where: {
        teamMemberId: params.memberId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        }
      },
      include: {
        action: {
          include: {
            action: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get feedback for this member
    const feedback = await prisma.structuredFeedback.findMany({
      where: {
        teamMemberId: params.memberId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
   // Fetch comments
   const comments = await prisma.memberComment.findMany({
    where: {
      teamMemberId: params.memberId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Check if there's enough data
  const hasSufficientData = checkDataSufficiency(scores, feedback, comments);

  if (!hasSufficientData.sufficient) {
    return NextResponse.json({
      success: false,
      error: "Insufficient data",
      details: hasSufficientData.message,
      recommendations: hasSufficientData.recommendations,
      missingData: {
        ratingsCount: scores.length,
        feedbackCount: feedback.length,
        commentsCount: comments.length,
        minRequired: hasSufficientData.minRequired
      }
    }, { status: 400 });
  }

   // Group ratings by category
   const categorizedRatings = categorizeMemberRatings(scores);

   // Generate the review
   const review = await generateReview({
    teamMember,
    scores,
    categorizedRatings,
    feedback,
    comments,
    period: {
      type: validatedData.period,
      startDate,
      endDate
    }
  });

   // Create a performance review in the database
   const quarterNumber = validatedData.quarterNumber || getCurrentQuarter();
   const year = validatedData.year || new Date().getFullYear();

   // Check if review already exists
   const existingReview = await prisma.performanceReview.findFirst({
    where: {
      teamMemberId: params.memberId,
      quarter: quarterNumber,
      year: year
    }
  });


  let savedReview;

  if (existingReview) {
    // Update existing review
    savedReview = await prisma.performanceReview.update({
      where: { id: existingReview.id },
      data: {
        content: review.content,
        status: 'DRAFT',
        version: { increment: 1 },
        customFields: JSON.parse(JSON.stringify({
          generatedBy: 'AI',
          generatedAt: new Date().toISOString(),
          analysisData: review.analysisData
        }))
      }
    });
  } else {
    // Create new review
    savedReview = await prisma.performanceReview.create({
      data: {
        teamMemberId: params.memberId,
        quarter: quarterNumber,
        year: year,
        content: review.content,
        status: 'DRAFT',
        customFields: JSON.parse(JSON.stringify({
          generatedBy: 'AI',
          generatedAt: new Date().toISOString(),
          analysisData: review.analysisData
        }))
      }
    });
  }

  return NextResponse.json({
    success: true,
    data: {
      review: savedReview,
      analysis: review.analysisData
    }
  });

    

    // // Calculate average score
    // const totalScores = scores.reduce((sum, score) => sum + score.value, 0);
    // const averageScore = scores.length > 0 ? totalScores / scores.length : 0;

    // // Group scores by category for analysis
    // const scoresByCategory: Record<string, { total: number; count: number; scores: number[] }> = {};
    
    // scores.forEach(score => {
    //   const categoryName = score.action.action.category.name;
      
    //   if (!scoresByCategory[categoryName]) {
    //     scoresByCategory[categoryName] = { total: 0, count: 0, scores: [] };
    //   }
      
    //   scoresByCategory[categoryName].total += score.value;
    //   scoresByCategory[categoryName].count++;
    //   scoresByCategory[categoryName].scores.push(score.value);
    // });

    // // Calculate averages per category
    // const categoryAverages = Object.entries(scoresByCategory).map(([category, data]) => {
    //   return {
    //     category,
    //     average: data.total / data.count,
    //     count: data.count,
    //     scores: data.scores,
    //   };
    // });

    // // Sort categories by average score (descending)
    // categoryAverages.sort((a, b) => b.average - a.average);

    // // Prepare the top strengths (highest scoring categories)
    // const topStrengths = categoryAverages
    //   .slice(0, 3)
    //   .filter(cat => cat.average >= 4); // Only include categories with high scores

    // // Prepare areas for improvement (lowest scoring categories)
    // const areasForImprovement = categoryAverages
    //   .slice(-3)
    //   .filter(cat => cat.average < 4) // Only include categories with lower scores
    //   .reverse(); // Show lowest first

    // // Extract strengths and areas for improvement from feedback
    // const allStrengths = feedback.flatMap(f => f.strengths);
    // const allImprovements = feedback.flatMap(f => f.improvements);
    // const allGoals = feedback.flatMap(f => f.goals);

    // // Prepare data for OpenAI
    // const memberData = {
    //   name: teamMember.user.name || teamMember.user.email,
    //   jobTitle: teamMember.title || "Team Member",
    //   jobGrade: teamMember.jobGrade?.grade || null,
    //   team: teamMember.team.name,
    //   averageScore,
    //   totalRatings: scores.length,
    //   categoryScores: categoryAverages,
    //   topStrengths,
    //   areasForImprovement,
    //   feedbackStrengths: allStrengths,
    //   feedbackImprovements: allImprovements,
    //   feedbackGoals: allGoals,
    //   comments: comments.map(c => c.content),
    //   quarter,
    //   year
    // };

    // console.log('memberData---------------------------', memberData);

    // // Generate performance review using OpenAI
    // // Generate performance review using DeepSeek API
    // const systemPrompt = `You are an expert HR performance reviewer. 
    // Your task is to write a comprehensive, fair, and constructive quarterly performance review for a team member 
    // based on objective data and feedback. The review should be professional, balanced, and actionable.
    
    // Include these sections:
    // 1. Executive Summary - Brief overview of overall performance
    // 2. Key Strengths - Areas where the team member excels, based on available ratings and data
    // 3. Development Areas - Areas for improvement with actionable steps
    // 4. Goals for Next Quarter - 3-5 specific, measurable goals
    // 5. Overall Rating - A summary assessment
    
    // Keep the tone positive, even when discussing development areas. Focus on growth and improvement.
    
    // If limited feedback or data is available, use what you have to make reasonable assessments and provide constructive guidance.
    // Generate appropriate goals and recommendations based on the performance patterns in the ratings.`;

    // const prompt = `Generate a quarterly performance review (Q${quarter} ${year}) for ${memberData.name}, a ${memberData.jobTitle} on the ${memberData.team} team.
    
    // Performance Data:
    // - Overall Rating: ${memberData.averageScore.toFixed(2)}/5 (from ${memberData.totalRatings} ratings)
    // ${topStrengths.length > 0 ? `- Top Performing Areas: ${topStrengths.map(s => `${s.category} (${s.average.toFixed(2)})`).join(', ')}` : '- No specific top-performing areas identified yet'}
    // ${areasForImprovement.length > 0 ? `- Areas for Development: ${areasForImprovement.map(s => `${s.category} (${s.average.toFixed(2)})`).join(', ')}` : '- No specific development areas identified yet'}
    
    // ${(allStrengths.length > 0 || allImprovements.length > 0 || allGoals.length > 0) ? `Feedback Highlights:
    // ${allStrengths.length > 0 ? `- Strengths: ${memberData.feedbackStrengths.slice(0, 5).join('; ')}` : '- Strengths: No documented strengths yet'}
    // ${allImprovements.length > 0 ? `- Improvement Areas: ${memberData.feedbackImprovements.slice(0, 5).join('; ')}` : '- Improvement Areas: No documented improvement areas yet'}
    // ${allGoals.length > 0 ? `- Suggested Goals: ${memberData.feedbackGoals.slice(0, 5).join('; ')}` : '- Suggested Goals: No documented goals yet'}` : ''}
    
    // Format the review professionally with clear sections. Provide specific examples where possible and actionable recommendations. Use the provided ratings data to make informed assessments, and if feedback is missing, generate reasonable suggestions based on the performance scores.`;


    // const completions = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    //   method: "POST",
    //   headers: {
    //     "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    //     // "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
    //     // "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     "model": "deepseek/deepseek-r1-zero:free",
    //     "messages": [
    //       {
    //         "role": "system",
    //         "content": systemPrompt
    //       },
    //       {
    //         "role": "user",
    //         "content": prompt
    //       }
    //     ]
    //   })
    // });

    // const completion = await openai.chat.completions.create({
    //     model: "deepseek/deepseek-r1-zero:free",
    //   messages: [
    //     { role: "system", content: systemPrompt },
    //     { role: "user", content: prompt }
    //   ],
    //   temperature: 0.7,
    //   max_tokens: 5000,
    // });

    // const reviewContent = completion.choices[0].message.content;

    // console.log('completions---------------', completion.choices[0].message.content);

    // Check if a review for this period already exists
    // const existingReview = await prisma.performanceReview.findFirst({
    //   where: {
    //     teamMemberId: params.memberId,
    //     quarter: Number(quarter),
    //     year: Number(year),
    //   },
    // });

    //let review;

    // if (existingReview) {
    //   // Update existing review
    //   review = await prisma.performanceReview.update({
    //     where: { id: existingReview.id },
    //     data: {
    //         content: reviewContent ?? '', // Add a default value if reviewContent is null
    //       status: ReviewStatus.DRAFT,
    //       version: existingReview.version + 1,
    //     },
    //   });
    // } else {
    //   // Create new review
    //   review = await prisma.performanceReview.create({
    //     data: {
    //       teamMemberId: params.memberId,
    //       quarter: Number(quarter),
    //       year: Number(year),
    //       content: reviewContent ?? '', // Add a default value if reviewContent is null
    //       status: ReviewStatus.DRAFT,
    //     },
    //   });
    // }

    // // Add an audit log entry
    // await prisma.auditLog.create({
    //   data: {
    //     action: existingReview ? "UPDATE" : "CREATE",
    //     entityType: "PERFORMANCE_REVIEW",
    //     entityId: review.id,
    //     performedBy: userId,
    //     changes: JSON.stringify({
    //       teamMemberId: params.memberId,
    //       quarter,
    //       year,
    //       isAiGenerated: true,
    //     }),
    //   },
    // });

    // return NextResponse.json({
    //   success: true,
    //   data: {
    //     id: review.id,
    //     content: reviewContent,
    //     quarter,
    //     year,
    //     status: review.status,
    //   },
    // });
  } catch (error) {
    console.error("Error generating review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate review" },
      { status: 500 }
    );
  }
}


// Helper function to calculate date range based on the period
function calculateDateRange(data: ReviewRequest): { startDate: Date, endDate: Date } {
  const now = new Date();
  let endDate = new Date();
  let startDate = new Date();

  if (data.period === 'custom' && data.customStartDate && data.customEndDate) {
    startDate = new Date(data.customStartDate);
    endDate = new Date(data.customEndDate);
  } else if (data.period === 'quarter') {
    const quarterNumber = data.quarterNumber || getCurrentQuarter();
    const year = data.year || now.getFullYear();
    
    startDate = new Date(year, (quarterNumber - 1) * 3, 1);
    endDate = new Date(year, quarterNumber * 3, 0);
  } else if (data.period === 'year') {
    const year = data.year || now.getFullYear();
    startDate = new Date(year, 0, 1);
    endDate = new Date(year, 11, 31);
  }

  return { startDate, endDate };
}

// Get current quarter (1-4)
function getCurrentQuarter(): number {
  const month = new Date().getMonth();
  return Math.floor(month / 3) + 1;
}

// Check if there's enough data to generate a meaningful review
function checkDataSufficiency(
  ratings: any[], 
  feedback: any[], 
  comments: any[]
): { 
  sufficient: boolean; 
  message: string;
  recommendations: string[];
  minRequired: { ratings: number, categories: number }
} {
  const MIN_RATINGS = 5;
  const MIN_CATEGORIES = 2;
  
  // Get unique categories from ratings
  const categorySet = new Set();
  for (const rating of ratings) {
    if (rating.action?.action?.category) {
      categorySet.add(rating.action.action.category.id);
    }
  }
  
  const uniqueCategoriesCount = categorySet.size;
  
  if (ratings.length < MIN_RATINGS) {
    return {
      sufficient: false,
      message: `Insufficient ratings data. Currently have ${ratings.length} ratings, but need at least ${MIN_RATINGS}.`,
      recommendations: [
        "Score more activities for this team member",
        "Ensure scores cover different categories of activities",
        "Ask other team members or managers to provide ratings"
      ],
      minRequired: { ratings: MIN_RATINGS, categories: MIN_CATEGORIES }
    };
  }
  
  if (uniqueCategoriesCount < MIN_CATEGORIES) {
    return {
      sufficient: false,
      message: `Ratings only cover ${uniqueCategoriesCount} categories, but at least ${MIN_CATEGORIES} are needed for a balanced review.`,
      recommendations: [
        "Score activities across different categories",
        "Include both technical skills and behavioral competencies",
        "Focus on areas that haven't been rated yet"
      ],
      minRequired: { ratings: MIN_RATINGS, categories: MIN_CATEGORIES }
    };
  }
  
  return {
    sufficient: true,
    message: "Sufficient data available for generating a review.",
    recommendations: [],
    minRequired: { ratings: MIN_RATINGS, categories: MIN_CATEGORIES }
  };
}

// Organize ratings into categories for better analysis
function categorizeMemberRatings(ratings: any[]): Record<string, CategoryRatings> {
  const categorizedRatings: Record<string, CategoryRatings> = {};
  
  // Group by category
  for (const rating of ratings) {
    if (rating.action?.action?.category) {
      const category = rating.action.action.category;
      
      if (!categorizedRatings[category.id]) {
        categorizedRatings[category.id] = {
          categoryId: category.id,
          categoryName: category.name,
          scores: [], // Initialize scores property
          averageScore: 0
        };
      }
      
      categorizedRatings[category.id].scores.push(rating); // Push rating to scores array
    }
  }
  
  // Calculate average scores for each category
  for (const categoryId in categorizedRatings) {
    const category = categorizedRatings[categoryId];
    const sum = category.scores.reduce((acc, rating) => acc + rating.value, 0);
    category.averageScore = sum / category.scores.length;
  }
  
  return categorizedRatings;
}