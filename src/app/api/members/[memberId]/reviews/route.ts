// app/api/members/[memberId]/reviews/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, PerformanceReviewResponse } from "@/lib/types/api";

import { OpenAI } from "openai";
import { ReviewStatus } from "@prisma/client";
import axios from "axios";

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.DEEP_SEEK_API_KEY,
  defaultHeaders: {
    // "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
    // "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
  },
  timeout: 60000, // Increase timeout to 60 seconds
});

// Alternative direct API call using axios
async function generateReviewWithAxios(systemPrompt: string, userPrompt: string) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1-zero:free",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.DEEP_SEEK_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 60000 // 60 second timeout
      }
    );
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error in axios request to OpenRouter:", error);
    throw error;
  }
}

// Minimum required scores for generating a meaningful review
const MIN_REQUIRED_SCORES = 4;

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
    const { teamId, quarter, year } = await request.json();
    
    if (!teamId || !quarter || !year) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Validate the member belongs to the team
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        id: params.memberId,
        teamId: teamId,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        jobGrade: true,
      },
    });

    if (!teamMember) {
      return NextResponse.json(
        { success: false, error: "Member not found in the specified team" },
        { status: 404 }
      );
    }

    // Get ratings for this member
    const scores = await prisma.memberScore.findMany({
      where: {
        teamMemberId: params.memberId,
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

    // CHECK FOR INSUFFICIENT DATA: If scores are less than the minimum required
    if (scores.length < MIN_REQUIRED_SCORES) {
      // Create or update a review with insufficient data message
      const insufficientDataMessage = `
# Insufficient Performance Data

We currently have only ${scores.length} performance rating${scores.length === 1 ? '' : 's'} for ${teamMember.user.name || teamMember.user.email}, which is not enough to generate a comprehensive performance review.

## What's needed
To generate a meaningful performance review, we recommend having at least ${MIN_REQUIRED_SCORES} performance ratings across different activity categories. This helps provide a more balanced and accurate assessment of the team member's performance.

## Next steps
1. Rate the team member's performance across more activities
2. Collect feedback from peers and managers
3. Document specific achievements and contributions
4. Try generating the review again after adding more data

Once more performance data is available, we'll be able to generate a detailed and helpful performance review.
`;

      // Check if a review for this period already exists
      const existingReview = await prisma.performanceReview.findFirst({
        where: {
          teamMemberId: params.memberId,
          quarter: Number(quarter),
          year: Number(year),
        },
      });

      let review;

      if (existingReview) {
        // Update existing review with insufficient data message
        review = await prisma.performanceReview.update({
          where: { id: existingReview.id },
          data: {
            content: insufficientDataMessage,
            status: ReviewStatus.DRAFT,
            version: existingReview.version + 1,
          },
        });
      } else {
        // Create new review with insufficient data message
        review = await prisma.performanceReview.create({
          data: {
            teamMemberId: params.memberId,
            quarter: Number(quarter),
            year: Number(year),
            content: insufficientDataMessage,
            status: ReviewStatus.DRAFT,
          },
        });
      }

      // Add an audit log entry
      await prisma.auditLog.create({
        data: {
          action: existingReview ? "UPDATE" : "CREATE",
          entityType: "PERFORMANCE_REVIEW",
          entityId: review.id,
          performedBy: userId,
          changes: JSON.stringify({
            teamMemberId: params.memberId,
            quarter,
            year,
            isAiGenerated: true,
            insufficientData: true,
            scoresCount: scores.length,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id: review.id,
          content: insufficientDataMessage,
          quarter,
          year,
          status: review.status,
          insufficientData: true,
          scoresCount: scores.length,
        },
      });
    }

    // If we have sufficient data, proceed with the review generation
    // Get feedback for this member
    const feedback = await prisma.structuredFeedback.findMany({
      where: {
        teamMemberId: params.memberId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5, // Consider the 5 most recent pieces of feedback
    });
    
    // Get comments for this member
    const comments = await prisma.memberComment.findMany({
      where: {
        teamMemberId: params.memberId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10, // Consider the 10 most recent comments
    });

    // Calculate average score
    const totalScores = scores.reduce((sum, score) => sum + score.value, 0);
    const averageScore = scores.length > 0 ? totalScores / scores.length : 0;

    // Group scores by category for analysis
    const scoresByCategory: Record<string, { total: number; count: number; scores: number[] }> = {};
    
    scores.forEach(score => {
      const categoryName = score.action.action.category.name;
      
      if (!scoresByCategory[categoryName]) {
        scoresByCategory[categoryName] = { total: 0, count: 0, scores: [] };
      }
      
      scoresByCategory[categoryName].total += score.value;
      scoresByCategory[categoryName].count++;
      scoresByCategory[categoryName].scores.push(score.value);
    });

    // Calculate averages per category
    const categoryAverages = Object.entries(scoresByCategory).map(([category, data]) => {
      return {
        category,
        average: data.total / data.count,
        count: data.count,
        scores: data.scores,
      };
    });

    // Sort categories by average score (descending)
    categoryAverages.sort((a, b) => b.average - a.average);

    // Prepare the top strengths (highest scoring categories)
    const topStrengths = categoryAverages
      .slice(0, 3)
      .filter(cat => cat.average >= 4); // Only include categories with high scores

    // Prepare areas for improvement (lowest scoring categories)
    const areasForImprovement = categoryAverages
      .slice(-3)
      .filter(cat => cat.average < 4) // Only include categories with lower scores
      .reverse(); // Show lowest first

    // Extract strengths and areas for improvement from feedback
    const allStrengths = feedback.flatMap(f => f.strengths);
    const allImprovements = feedback.flatMap(f => f.improvements);
    const allGoals = feedback.flatMap(f => f.goals);

    // Prepare data for OpenAI
    const memberData = {
      name: teamMember.user.name || teamMember.user.email,
      jobTitle: teamMember.title || "Team Member",
      jobGrade: teamMember.jobGrade?.grade || null,
      team: teamMember.team.name,
      averageScore,
      totalRatings: scores.length,
      categoryScores: categoryAverages,
      topStrengths,
      areasForImprovement,
      feedbackStrengths: allStrengths,
      feedbackImprovements: allImprovements,
      feedbackGoals: allGoals,
      comments: comments.map(c => c.content),
      quarter,
      year
    };

    console.log('memberData---------------------------', memberData);

    // Generate performance review using DeepSeek API
    const systemPrompt = `You are an expert HR performance reviewer. 
    Your task is to write a comprehensive, fair, and constructive quarterly performance review for a team member 
    based on objective data and feedback. The review should be professional, balanced, and actionable.
    
    Include these sections:
    1. Executive Summary - Brief overview of overall performance
    2. Key Strengths - Areas where the team member excels, based on available ratings and data
    3. Development Areas - Areas for improvement with actionable steps
    4. Goals for Next Quarter - 3-5 specific, measurable goals
    5. Overall Rating - A summary assessment
    
    Keep the tone positive, even when discussing development areas. Focus on growth and improvement.
    
    If limited feedback or data is available, use what you have to make reasonable assessments and provide constructive guidance.
    Generate appropriate goals and recommendations based on the performance patterns in the ratings.`;

    const prompt = `Generate a quarterly performance review (Q${quarter} ${year}) for ${memberData.name}, a ${memberData.jobTitle} on the ${memberData.team} team.
    
    Performance Data:
    - Overall Rating: ${memberData.averageScore.toFixed(2)}/5 (from ${memberData.totalRatings} ratings)
    ${topStrengths.length > 0 ? `- Top Performing Areas: ${topStrengths.map(s => `${s.category} (${s.average.toFixed(2)})`).join(', ')}` : '- No specific top-performing areas identified yet'}
    ${areasForImprovement.length > 0 ? `- Areas for Development: ${areasForImprovement.map(s => `${s.category} (${s.average.toFixed(2)})`).join(', ')}` : '- No specific development areas identified yet'}
    
    ${(allStrengths.length > 0 || allImprovements.length > 0 || allGoals.length > 0) ? `Feedback Highlights:
    ${allStrengths.length > 0 ? `- Strengths: ${memberData.feedbackStrengths.slice(0, 5).join('; ')}` : '- Strengths: No documented strengths yet'}
    ${allImprovements.length > 0 ? `- Improvement Areas: ${memberData.feedbackImprovements.slice(0, 5).join('; ')}` : '- Improvement Areas: No documented improvement areas yet'}
    ${allGoals.length > 0 ? `- Suggested Goals: ${memberData.feedbackGoals.slice(0, 5).join('; ')}` : '- Suggested Goals: No documented goals yet'}` : ''}
    
    Format the review professionally with clear sections. Provide specific examples where possible and actionable recommendations. Use the provided ratings data to make informed assessments, and if feedback is missing, generate reasonable suggestions based on the performance scores.`;

    // Try multiple approaches to get the review content
    let reviewContent;
    let apiError = null;
    
    // Try the first method with the OpenAI SDK
    try {
      console.log('Attempting to generate review with OpenAI SDK...');
      const completion = await openai.chat.completions.create({
        model: "deepseek/deepseek-r1-zero:free",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });
      
      reviewContent = completion.choices[0].message.content;
      console.log('OpenAI SDK request successful');
    } catch (error) {
      console.error('Error with OpenAI SDK approach:', error);
      apiError = error;
      
      // If the first method fails, try the direct axios approach
      try {
        console.log('Falling back to direct axios request...');
        reviewContent = await generateReviewWithAxios(systemPrompt, prompt);
        console.log('Axios fallback request successful');
      } catch (axiosError) {
        console.error('Error with axios fallback approach:', axiosError);
        
        // Both methods failed, create a simple review as fallback
        console.log('Both API approaches failed, using fallback content');
        reviewContent = `# Performance Review for ${memberData.name} - Q${quarter} ${year}

## Executive Summary
${memberData.name} has received ${memberData.totalRatings} performance ratings with an average score of ${memberData.averageScore.toFixed(2)}/5.

## Key Strengths
${topStrengths.length > 0 
  ? topStrengths.map(s => `- ${s.category}: ${s.average.toFixed(2)}/5`).join('\n')
  : '- Based on current ratings, no specific strengths were identified yet.'}

## Development Areas
${areasForImprovement.length > 0
  ? areasForImprovement.map(s => `- ${s.category}: ${s.average.toFixed(2)}/5`).join('\n')
  : '- Based on current ratings, no specific development areas were identified yet.'}

## Goals for Next Quarter
1. Continue to improve in ${categoryAverages.length > 0 ? categoryAverages[0].category : 'key performance areas'}
2. Focus on development in ${areasForImprovement.length > 0 ? areasForImprovement[0].category : 'areas that need attention'}
3. Maintain consistent performance tracking and feedback

## Note
This is an automatically generated review based on available performance data. The AI-powered review generation service encountered technical difficulties. This simplified review is provided as a fallback.`;
      }
    }

    // We no longer need this block as reviewContent is now handled in the try/catch above
    console.log('Review content generated successfully');

    // Check if a review for this period already exists
    const existingReview = await prisma.performanceReview.findFirst({
      where: {
        teamMemberId: params.memberId,
        quarter: Number(quarter),
        year: Number(year),
      },
    });

    let review;

    if (existingReview) {
      // Update existing review
      review = await prisma.performanceReview.update({
        where: { id: existingReview.id },
        data: {
          content: reviewContent ?? '', // Add a default value if reviewContent is null
          status: ReviewStatus.DRAFT,
          version: existingReview.version + 1,
        },
      });
    } else {
      // Create new review
      review = await prisma.performanceReview.create({
        data: {
          teamMemberId: params.memberId,
          quarter: Number(quarter),
          year: Number(year),
          content: reviewContent ?? '', // Add a default value if reviewContent is null
          status: ReviewStatus.DRAFT,
        },
      });
    }

    // Add an audit log entry
    await prisma.auditLog.create({
      data: {
        action: existingReview ? "UPDATE" : "CREATE",
        entityType: "PERFORMANCE_REVIEW",
        entityId: review.id,
        performedBy: userId,
        changes: JSON.stringify({
          teamMemberId: params.memberId,
          quarter,
          year,
          isAiGenerated: true,
          scoresCount: scores.length,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: review.id,
        content: reviewContent,
        quarter,
        year,
        status: review.status,
        scoresCount: scores.length,
      },
    });
  } catch (error) {
    console.error("Error generating review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate review" },
      { status: 500 }
    );
  }
}