// app/api/user/profile/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { prisma } from '@/lib/prisma'


// GET method to fetch user profile and related data
export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    console.log(userId, 'GET /api/user/profile - Started----------------');
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get only essential user data
    const appUser = await prisma.appUser.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        email: true,
        name: true,
        subscriptionTier: true,
        subscriptionStart: true,
        subscriptionEnd: true,
        createdAt: true,
        updatedAt: true,
        customFields: true,
        orgName: {
          select: {
            id: true,
            name: true
          }
        },
        teams: {
          where: { deletedAt: null },
          select: {
            id: true,
            name: true,
            description: true,
            
          }
        },
        createdActions: {
          where: { deletedAt: null },
          select: {
            id: true,
            priority: true,
            status: true,
            dueDate: true,
            action: {
              select: {
                id: true,
                name: true,
                category: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            teams: true,
            teamMembers: true,
            createdActions: true
          }
        }
      }
    });

    if (!appUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get Clerk user profile data
    const clerkUserData = await clerkClient.users.getUser(userId);

    // // Transform createdActions into category-based structure
    // const groupedActions = appUser.createdActions.reduce((acc, curr) => {
    //   const categoryId = curr.action.category.id;
    //   if (!acc[categoryId]) {
    //     acc[categoryId] = [];
    //   }
    //   acc[categoryId].push(curr.action.id);
    //   return acc;
    // }, {} as Record<string, string[]>);
    // Transform createdActions into category-based structure
const groupedActions = appUser.createdActions.reduce((acc, curr) => {
  if (curr.action && curr.action.category) {
    const categoryId = curr.action.category.id;
    const actionId = curr.action.id;
    
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    
    // Only add if not already in the array (prevent duplicates)
    if (!acc[categoryId].includes(actionId)) {
      acc[categoryId].push(actionId);
    }
  }
  return acc;
}, {} as Record<string, string[]>);

    // Construct a clean profile response
    const profileData = {
      id: appUser.id,
      email: appUser.email,
      name: appUser.name,
      subscription: {
        tier: appUser.subscriptionTier,
        startDate: appUser.subscriptionStart,
        endDate: appUser.subscriptionEnd,
      },
      organization: appUser.orgName?.[0] || null,
      stats: {
        teamsOwned: appUser._count.teams,
        teamsMember: appUser._count.teamMembers,
        activitiesCreated: appUser._count.createdActions
      },
      teams: appUser.teams,
      createdActions: groupedActions,
      clerkProfile: {
        firstName: clerkUserData.firstName,
        lastName: clerkUserData.lastName,
        imageUrl: clerkUserData.imageUrl,
        primaryEmail: clerkUserData.emailAddresses[0]?.emailAddress
      },
      createdAt: appUser.createdAt,
      updatedAt: appUser.updatedAt
    };

     return NextResponse.json({
          success: true,
          data: profileData,
        });

   
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

// Existing PATCH method
export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { firstName, lastName } = await req.json();

    // Validate inputs
    if (!firstName?.trim() || !lastName?.trim()) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 }
      );
    }

    await clerkClient.users.updateUser(userId, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}