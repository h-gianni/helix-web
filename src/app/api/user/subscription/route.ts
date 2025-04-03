// src/app/api/user/subscription/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get subscription details
    const user = await prisma.appUser.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        email: true,
        subscriptionTier: true,
        subscriptionStart: true,
        subscriptionEnd: true,
        customFields: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get usage statistics
    const [teamsCount, membersCount, actionsCount] = await Promise.all([
      prisma.gTeam.count({
        where: { ownerId: user.id, deletedAt: null }
      }),
      prisma.teamMember.count({
        where: { 
          team: { ownerId: user.id, deletedAt: null },
          deletedAt: null
        }
      }),
      prisma.orgAction.count({
        where: { 
          createdBy: user.id,
          deletedAt: null 
        }
      })
    ]);

    // Calculate plan limits based on subscription tier
    const tierLimits = getTierLimits(user.subscriptionTier);
    
    // Calculate days remaining in subscription
    const daysRemaining = user.subscriptionEnd 
      ? Math.max(0, Math.ceil((user.subscriptionEnd.getTime() - new Date().getTime()) / (1000 * 3600 * 24)))
      : null;

    return NextResponse.json({
      success: true,
      data: {
        subscription: {
          tier: user.subscriptionTier,
          startDate: user.subscriptionStart,
          endDate: user.subscriptionEnd,
          daysRemaining,
          isActive: isSubscriptionActive(user.subscriptionEnd),
          paymentDetails: (user.customFields as { paymentDetails: any })?.paymentDetails || null,
        },
        usage: {
          teams: {
            current: teamsCount,
            limit: tierLimits.teams,
            percentage: tierLimits.teams ? Math.round((teamsCount / tierLimits.teams) * 100) : 0
          },
          members: {
            current: membersCount,
            limit: tierLimits.members,
            percentage: tierLimits.members ? Math.round((membersCount / tierLimits.members) * 100) : 0
          },
          actions: {
            current: actionsCount,
            limit: tierLimits.actions,
            percentage: tierLimits.actions ? Math.round((actionsCount / tierLimits.actions) * 100) : 0
          }
        },
        features: getTierFeatures(user.subscriptionTier)
      }
    });
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    return NextResponse.json(
      { error: "Failed to fetch subscription details" },
      { status: 500 }
    );
  }
}

// Helper function to check if subscription is active
function isSubscriptionActive(endDate: Date | null): boolean {
  if (!endDate) return false;
  return endDate.getTime() > new Date().getTime();
}

// Helper function to get tier limits
function getTierLimits(tier: string) {
  switch (tier) {
    case 'FREE':
      return {
        teams: 1,
        members: 5,
        actions: 10
      };
    case 'PREMIUM':
      return {
        teams: 5,
        members: 20,
        actions: 50
      };
    case 'ENTERPRISE':
      return {
        teams: null, // unlimited
        members: null, // unlimited
        actions: null // unlimited
      };
    default:
      return {
        teams: 0,
        members: 0,
        actions: 0
      };
  }
}

// Helper function to get tier features
function getTierFeatures(tier: string) {
  const features = {
    FREE: [
      'Basic team management',
      'Performance tracking',
      'Simple feedback system'
    ],
    PREMIUM: [
      'Advanced team management',
      'Detailed performance analytics',
      'Comprehensive feedback system',
      'Export capabilities',
      'Priority support'
    ],
    ENTERPRISE: [
      'Custom team structure',
      'Advanced analytics and reporting',
      'Unlimited teams and members',
      'Dedicated account manager',
      'API access',
      'SSO integration'
    ]
  };
  
  return features[tier as keyof typeof features] || [];
}