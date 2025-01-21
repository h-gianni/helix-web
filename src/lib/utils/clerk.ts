// lib/utils/clerk.ts
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function syncUser(request: NextRequest) {
  const auth = getAuth(request);
  const userId = auth.userId;
  if (!userId) return null;

  try {
    // Check if user exists in our database
    let user = await prisma.appUser.findUnique({
      where: { clerkId: userId },
    });

    // If user doesn't exist, create them
    if (!user) {
      const email = auth.sessionClaims?.email as string;
      const firstName = auth.sessionClaims?.firstName as string;
      const lastName = auth.sessionClaims?.lastName as string;

      user = await prisma.appUser.create({
        data: {
          clerkId: userId,
          email: email || '',
          name: firstName ? `${firstName} ${lastName || ''}`.trim() : null,
        },
      });
    }

    return user;
  } catch (error) {
    console.error('Error syncing user:', error);
    return null;
  }
}