// src/lib/ai/review-generator.ts
import { TeamMember } from "@prisma/client";

interface ReviewPeriod {
  type: 'quarter' | 'year' | 'custom';
  startDate: Date;
  endDate: Date;
}

interface CategoryAssessment {
    categoryName: string;
    score: number;
    scoreDescription: string;
    observations: string[];
  }


interface ReviewInput {
  teamMember: any; // TeamMember with relations
  scores: any[]; // MemberScore[] with relations
  categorizedRatings: Record<string, CategoryRatings>;
  feedback: any[]; // StructuredFeedback[]
  comments: any[]; // MemberComment[]
  period: ReviewPeriod;
}

export interface CategoryRatings {
  categoryId: string;
  categoryName: string;
  scores: any[];
  averageScore: number;
}

interface CategoryAssessment {
  categoryId: string;
  categoryName: string;
  score: number;
  scoreDescription: string;
  strength: boolean;
  concernArea: boolean;
  improvementNeeded: boolean;
  observations: string[];
  recommendations: string[];
}

interface ReviewOutput {
  content: string;
  analysisData: {
    overallAssessment: {
      score: number;
      description: string;
      summary: string;
    };
    categoryAssessments: CategoryAssessment[];
    strengths: string[];
    developmentAreas: string[];
    recommendations: string[];
    dataQuality: {
      ratingCount: number;
      uniqueCategories: number;
      feedbackCount: number;
      commentsCount: number;
      dataCompleteness: 'insufficient' | 'minimal' | 'adequate' | 'comprehensive';
    }
  };
}

/**
 * Generates a comprehensive performance review for a team member
 */
export async function generateReview(input: ReviewInput): Promise<ReviewOutput> {
  const { teamMember, scores, categorizedRatings, feedback, comments, period } = input;
  
  // Step 1: Analyze data quality
  const dataQuality = analyzeDataQuality(scores, feedback, comments);
  
  // Step 2: Analyze categorical performance
  const categoryAssessments = analyzeCategoryPerformance(categorizedRatings);
  
  // Step 3: Identify strengths and development areas
  const strengths = categoryAssessments
    .filter(category => category.strength)
    .map(category => `${category.categoryName}: ${category.scoreDescription}`);
  
  const developmentAreas = categoryAssessments
    .filter(category => category.improvementNeeded || category.concernArea)
    .map(category => `${category.categoryName}: ${category.scoreDescription}`);
  
  // Step 4: Calculate overall performance score
  const overallAssessment = calculateOverallPerformance(categoryAssessments);
  
  // Step 5: Generate recommendations
  const recommendations = generateRecommendations(categoryAssessments, teamMember);
  
  // Step 6: Format the review content
  const content = formatReviewContent({
    teamMember,
    period,
    overallAssessment,
    categoryAssessments,
    strengths,
    developmentAreas,
    recommendations,
    dataQuality
  });
  
  // Step 7: Return the complete review
  return {
    content,
    analysisData: {
      overallAssessment,
      categoryAssessments,
      strengths,
      developmentAreas,
      recommendations,
      dataQuality
    }
  };
}

/**
 * Analyzes the quality of available data for review generation
 */
function analyzeDataQuality(ratings: any[], feedback: any[], comments: any[]) {
  const uniqueCategories = new Set(
    ratings.map(r => r.action?.action?.category?.id).filter(Boolean)
  ).size;
  
  let dataCompleteness: 'insufficient' | 'minimal' | 'adequate' | 'comprehensive';
  
  if (ratings.length < 5) {
    dataCompleteness = 'insufficient';
  } else if (ratings.length < 10 || uniqueCategories < 2) {
    dataCompleteness = 'minimal';
  } else if (ratings.length < 20 || uniqueCategories < 3) {
    dataCompleteness = 'adequate';
  } else {
    dataCompleteness = 'comprehensive';
  }
  
  return {
    ratingCount: ratings.length,
    uniqueCategories,
    feedbackCount: feedback.length,
    commentsCount: comments.length,
    dataCompleteness
  };
}

/**
 * Analyzes performance across different categories
 */
function analyzeCategoryPerformance(categorizedRatings: Record<string, CategoryRatings>): CategoryAssessment[] {
  const assessments: CategoryAssessment[] = [];
  
  for (const categoryId in categorizedRatings) {
    const category = categorizedRatings[categoryId];
    const { score, scoreDescription } = interpretScore(category.averageScore);
    
    // Determine if this is a strength or concern area
    const strength = score >= 4.0;
    const concernArea = score <= 2.0;
    const improvementNeeded = score > 2.0 && score < 3.5;
    
    // Generate specific observations for this category
    const observations = generateObservations(category);
    
    // Generate recommendations specific to this category
    const recommendations = generateCategoryRecommendations(category);
    
    assessments.push({
      categoryId,
      categoryName: category.categoryName,
      score,
      scoreDescription,
      strength,
      concernArea,
      improvementNeeded,
      observations,
      recommendations
    });
  }
  
  return assessments;
}

/**
 * Maps numerical scores to descriptive text
 */
function interpretScore(score: number): { score: number; scoreDescription: string } {
  const roundedScore = Math.round(score * 10) / 10; // Round to nearest 0.1
  
  if (roundedScore >= 4.5) {
    return { score: roundedScore, scoreDescription: "Outstanding performance" };
  } else if (roundedScore >= 4.0) {
    return { score: roundedScore, scoreDescription: "Exceeds expectations" };
  } else if (roundedScore >= 3.5) {
    return { score: roundedScore, scoreDescription: "Meets expectations well" };
  } else if (roundedScore >= 3.0) {
    return { score: roundedScore, scoreDescription: "Meets expectations" };
  } else if (roundedScore >= 2.5) {
    return { score: roundedScore, scoreDescription: "Partially meets expectations" };
  } else if (roundedScore >= 2.0) {
    return { score: roundedScore, scoreDescription: "Below expectations" };
  } else {
    return { score: roundedScore, scoreDescription: "Significant improvement needed" };
  }
}

/**
 * Generate observations for a specific category
 */
function generateObservations(category: CategoryRatings): string[] {
  // In a real implementation, this would analyze the ratings in more detail
  // For this example, we'll return placeholder observations
  const observations: string[] = [];
  
  if (category.averageScore >= 4.0) {
    observations.push(`Consistently demonstrates strong skills in ${category.categoryName.toLowerCase()}`);
    observations.push(`A role model for others in the area of ${category.categoryName.toLowerCase()}`);
  } else if (category.averageScore >= 3.0) {
    observations.push(`Shows competence in ${category.categoryName.toLowerCase()}`);
    observations.push(`Reliably performs expectations for ${category.categoryName.toLowerCase()}`);
  } else {
    observations.push(`Still developing skills in ${category.categoryName.toLowerCase()}`);
    observations.push(`May need additional support with ${category.categoryName.toLowerCase()}`);
  }
  
  return observations;
}

/**
 * Generate recommendations for a specific category
 */
function generateCategoryRecommendations(category: CategoryRatings): string[] {
  // In a real implementation, this would generate tailored recommendations
  // For this example, we'll return placeholder recommendations
  const recommendations: string[] = [];
  
  if (category.averageScore < 3.0) {
    recommendations.push(`Consider additional training in ${category.categoryName.toLowerCase()}`);
    recommendations.push(`Schedule regular check-ins focused on ${category.categoryName.toLowerCase()}`);
  } else if (category.averageScore < 4.0) {
    recommendations.push(`Look for stretch assignments related to ${category.categoryName.toLowerCase()}`);
    recommendations.push(`Set specific goals to advance skills in ${category.categoryName.toLowerCase()}`);
  } else {
    recommendations.push(`Consider mentoring others in ${category.categoryName.toLowerCase()}`);
    recommendations.push(`Share best practices for ${category.categoryName.toLowerCase()} with the team`);
  }
  
  return recommendations;
}

/**
 * Calculate overall performance based on category assessments
 */
function calculateOverallPerformance(categoryAssessments: CategoryAssessment[]) {
  // In a real implementation, this would use a more sophisticated approach
  // that weights categories differently and considers other factors
  
  // Behavioral categories should have higher weight
  const behavioralCategories = ['Teamwork', 'Cultural Behaviors & Values', 'Customer Centricity', 'Leadership'];
  
  let totalWeightedScore = 0;
  let totalWeight = 0;
  
  for (const assessment of categoryAssessments) {
    // Apply higher weight to behavioral categories
    const weight = behavioralCategories.includes(assessment.categoryName) ? 1.5 : 1.0;
    totalWeightedScore += assessment.score * weight;
    totalWeight += weight;
  }
  
  const overallScore = totalWeightedScore / totalWeight;
  const { scoreDescription } = interpretScore(overallScore);
  
  // Generate an overall summary
  let summary = "";
  const hasMixedPerformance = categoryAssessments.some(c => c.strength) && 
                             categoryAssessments.some(c => c.concernArea || c.improvementNeeded);
  
  const strongCategories = categoryAssessments.filter(c => c.strength)
    .map(c => c.categoryName.toLowerCase()).join(", ");
  
  const weakCategories = categoryAssessments.filter(c => c.concernArea)
    .map(c => c.categoryName.toLowerCase()).join(", ");
  
  if (hasMixedPerformance) {
    summary = `Shows strong performance in ${strongCategories}, but needs improvement in ${weakCategories}.`;
  } else if (categoryAssessments.every(c => c.strength)) {
    summary = `Consistently strong performer across all categories.`;
  } else if (categoryAssessments.every(c => c.concernArea)) {
    summary = `Significant improvement needed across all areas.`;
  } else {
    summary = `Generally meets expectations with some areas for development.`;
  }
  
  return {
    score: Math.round(overallScore * 10) / 10,
    description: scoreDescription,
    summary
  };
}

/**
 * Generate overall recommendations based on assessments
 */
function generateRecommendations(categoryAssessments: CategoryAssessment[], teamMember: any): string[] {
  // Gather all category-specific recommendations
  const allRecommendations = categoryAssessments.flatMap(cat => cat.recommendations);
  
  // Add overall recommendations
  const overallRecommendations: string[] = [];
  
  // Check for behavioral concerns
  const behavioralCategories = ['Teamwork', 'Cultural Behaviors & Values', 'Customer Centricity', 'Leadership'];
  const behavioralAssessments = categoryAssessments.filter(c => 
    behavioralCategories.includes(c.categoryName)
  );
  
  const hasBehavioralConcerns = behavioralAssessments.some(c => c.concernArea);
  const hasStrongTechnicalSkills = categoryAssessments.some(c => 
    !behavioralCategories.includes(c.categoryName) && c.strength
  );
  
  if (hasBehavioralConcerns && hasStrongTechnicalSkills) {
    overallRecommendations.push(
      "Consider pairing their strong technical skills with focused coaching on behavioral competencies"
    );
  }
  
  // Select the most important recommendations (up to 5)
  const priorityRecommendations = [...overallRecommendations];
  
  // Add critical category recommendations
  const concernAreas = categoryAssessments.filter(c => c.concernArea);
  for (const area of concernAreas) {
    if (area.recommendations.length > 0) {
      priorityRecommendations.push(area.recommendations[0]);
    }
  }
  
  // Add improvement recommendations if we have space
  if (priorityRecommendations.length < 5) {
    const improvementAreas = categoryAssessments.filter(c => c.improvementNeeded);
    for (const area of improvementAreas) {
      if (priorityRecommendations.length < 5 && area.recommendations.length > 0) {
        priorityRecommendations.push(area.recommendations[0]);
      }
    }
  }
  
  // Ensure we have at least some recommendations
  if (priorityRecommendations.length === 0) {
    return ["Develop a personal growth plan to continue building on current strengths.",
            "Seek opportunities to mentor others and share expertise.",
            "Consider stretch assignments that provide exposure to new skills."];
  }
  
  return priorityRecommendations;
}

/**
 * Format the final review content
 */
function formatReviewContent(data: any): string {
  const {
    teamMember,
    period,
    overallAssessment,
    categoryAssessments,
    strengths,
    developmentAreas,
    recommendations,
    dataQuality
  } = data;
  
  const memberName = teamMember.firstName && teamMember.lastName 
    ? `${teamMember.firstName} ${teamMember.lastName}`
    : teamMember.user.email;
  
  // Format period as readable text
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric',
      day: 'numeric'
    });
  };
  
  let periodText;
  if (period.type === 'quarter') {
    const quarter = Math.floor(new Date(period.startDate).getMonth() / 3) + 1;
    const year = new Date(period.startDate).getFullYear();
    periodText = `Q${quarter} ${year}`;
  } else if (period.type === 'year') {
    periodText = `Year ${new Date(period.startDate).getFullYear()}`;
  } else {
    periodText = `${formatDate(period.startDate)} to ${formatDate(period.endDate)}`;
  }
  
  // Check if we need to add data quality warning
  let dataQualityWarning = '';
  if (dataQuality.dataCompleteness === 'minimal') {
    dataQualityWarning = `\n\n> **Note:** This review is based on limited data (${dataQuality.ratingCount} ratings across ${dataQuality.uniqueCategories} categories). More comprehensive evaluations will be possible with additional performance data.\n\n`;
  }
  
  // Format category assessments
  const categoryDetails = categoryAssessments
    .map((cat:CategoryAssessment)  => {
      const observations = cat.observations.map(o => `- ${o}`).join('\n');
      
      return `### ${cat.categoryName}: ${cat.score}/5 - ${cat.scoreDescription}

${observations}
`;
    })
    .join('\n');
  
  // Format strengths
  const strengthsList = strengths.length > 0
    ? strengths.map((s:string) => `- ${s}`).join('\n')
    : '- No specific strengths identified in the current data';
  
  // Format development areas
  const developmentAreasList = developmentAreas.length > 0
    ? developmentAreas.map((d: string) => `- ${d}`).join('\n')
    : '- No specific development areas identified in the current data';
  
  // Format recommendations
  const recommendationsList = recommendations.length > 0
    ? recommendations.map((r: string) => `- ${r}`).join('\n')
    : '- Continue current performance';
  
  // Assemble the complete review
  return `# Performance Review for ${memberName}
**Period:** ${periodText}
**Overall Assessment:** ${overallAssessment.score}/5 - ${overallAssessment.description}

${dataQualityWarning}
## Executive Summary
${overallAssessment.summary}

## Strengths
${strengthsList}

## Areas for Development
${developmentAreasList}

## Recommendations
${recommendationsList}

## Detailed Performance by Category
${categoryDetails}

---
This review was automatically generated based on performance data collected during the specified period.
`;
}

// In a production environment, you would integrate with an actual AI service here
// For example, using OpenAI's API to enhance the review content
async function enhanceWithAI(review: string, analysisData: any): Promise<string> {
  // This would call an AI service to improve the review
  // For this example, we'll just return the original
  return review;
}