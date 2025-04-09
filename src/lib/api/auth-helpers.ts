// src/lib/api/auth-helpers.ts
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ApiResponse } from "../types/api";

/**
 * Check if a user is athendicated
 * Access is granted if user is authendicated
 */

export async function requireAuth(): Promise<string | NextResponse> {
  const { userId } = await auth();

  console.log(userId)
  
  if (!userId) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  return userId;
}

/**
 * Check if a user has access to a specific team
 * Access is granted if user is the team owner or a team member
 */
export async function checkTeamAccess(teamId: string, clerkUserId: string): Promise<boolean> {
  try {
    // First, get the database user ID from Clerk ID
    const user = await prisma.appUser.findUnique({
      where: { clerkId: clerkUserId },
      select: { id: true }
    });
    
    if (!user) {
      return false;
    }
    
    // Check if user is the team owner
    const isOwner = await prisma.gTeam.findFirst({
      where: {
        id: teamId,
        ownerId: user.id,
        deletedAt: null
      }
    });
    
    if (isOwner) {
      return true;
    }
    
    // Check if user is a team member
    const isMember = await prisma.teamMember.findFirst({
      where: {
        teamId: teamId,
        userId: user.id,
        deletedAt: null
      }
    });
    
    return !!isMember;
  } catch (error) {
    console.error("Error checking team access:", error);
    return false;
  }
}

/**
 * Check if a user has admin access to a specific team
 * Admin access is granted if user is the team owner or a team admin
 */
export async function checkTeamAdminAccess(teamId: string, clerkUserId: string): Promise<boolean> {
  try {
    // First, get the database user ID from Clerk ID
    const user = await prisma.appUser.findUnique({
      where: { clerkId: clerkUserId },
      select: { id: true }
    });
    
    if (!user) {
      return false;
    }
    
    // Check if user is the team owner
    const isOwner = await prisma.gTeam.findFirst({
      where: {
        id: teamId,
        ownerId: user.id,
        deletedAt: null
      }
    });
    
    if (isOwner) {
      return true;
    }
    
    // Check if user is a team admin
    const isAdmin = await prisma.teamMember.findFirst({
      where: {
        teamId: teamId,
        userId: user.id,
        isAdmin: true,
        deletedAt: null
      }
    });
    
    return !!isAdmin;
  } catch (error) {
    console.error("Error checking team admin access:", error);
    return false;
  }
}

/**
 * Check if a user has access to a specific member
 */
export async function checkMemberAccess(memberId: string, clerkUserId: string): Promise<boolean> {
  try {
    // Get the member's team ID
    const member = await prisma.teamMember.findUnique({
      where: { id: memberId },
      select: { teamId: true }
    });
    
    if (!member) {
      return false;
    }
    
    // Check if user has access to this team
    return await checkTeamAccess(member.teamId, clerkUserId);
  } catch (error) {
    console.error("Error checking member access:", error);
    return false;
  }
}

export async function getAuthenticatedUser(){
  const {userId} = await auth();

  if(!userId) {
    return NextResponse.json<ApiResponse<never>>(
      {success: false, error: "Unauthorized"},
      {status: 401}
    )
  }

  return userId;
}