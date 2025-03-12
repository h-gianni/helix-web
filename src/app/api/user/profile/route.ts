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

    // First, find the app user by clerkId
    const appUser = await prisma.appUser.findUnique({
      where: { clerkId: userId },
      include: {
        // Include relations based on your schema
        teamMembers: {
          where: { deletedAt: null },
          include: {
            team: true,
            jobGrade: true,
            scores: true,
            feedback: true,
            comments: true,
            reviews: true,
          }
        },
        teams: {
          where: { deletedAt: null },
          include: {
            teamFunction: true,
            teamMembers: {
              where: { deletedAt: null }
            },
            actions: {
              where: { deletedAt: null }
            }
          }
        },
        createdActions: {
          where: { deletedAt: null },
          include: {
            action: {
              include: {
                category: true
              }
            },
            team: true
          }
        },
        orgname: true
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

    // Combine data from Prisma and Clerk
    const profileData = {
      ...appUser,
      clerkProfile: {
        firstName: clerkUserData.firstName,
        lastName: clerkUserData.lastName,
        imageUrl: clerkUserData.imageUrl,
        emailAddresses: clerkUserData.emailAddresses
      }
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