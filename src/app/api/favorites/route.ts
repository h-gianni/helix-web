import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/lib/types/api";


interface AddFavoriteBody {
    actionId: string;
    categoryId: string;
    isFavorite: boolean;
  }

  // GET handler to retrieve user's favorites
export async function GET(request: Request) {
    try {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json<ApiResponse<never>>(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        );
      }
  
      // Find the user by clerk ID
      const user = await prisma.appUser.findUnique({
        where: { clerkId: userId },
      });
  
      if (!user) {
        return NextResponse.json<ApiResponse<never>>(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }
  
      // Get favorites from customFields or initialize empty object
      const customFields = user.customFields || {};
      const favorites = (customFields as any).favorites || {};

      console.log(favorites, "favorites---------------")
  
      return NextResponse.json<ApiResponse<Record<string, string[]>>>({
        success: true,
        data: favorites,
      });
    } catch (error) {
      console.error("Error fetching favorites:", error);
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  }


  // POST handler to add/remove favorites
export async function POST(request: Request) {
    try {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json<ApiResponse<never>>(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        );
      }
  
      const body: AddFavoriteBody = await request.json();
      const { actionId, categoryId, isFavorite } = body;
  
      if (!actionId || !categoryId) {
        return NextResponse.json<ApiResponse<never>>(
          { success: false, error: "Action ID and Category ID are required" },
          { status: 400 }
        );
      }
  
      // Find the user by clerk ID
      const user = await prisma.appUser.findUnique({
        where: { clerkId: userId },
      });
  
      if (!user) {
        return NextResponse.json<ApiResponse<never>>(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }
  
      // Get existing customFields or initialize new object
      const customFields = (user.customFields as Record<string, any>) || {};
      
      // Get favorites from customFields or initialize new object
      const favorites = customFields.favorites || {};
      
      // Get category favorites or initialize empty array
      const categoryFavorites = favorites[categoryId] || [];
      
      // Add or remove action from favorites
      let updatedCategoryFavorites: string[];
      if (isFavorite) {
        // Add to favorites if not already present
        if (!categoryFavorites.includes(actionId)) {
          updatedCategoryFavorites = [...categoryFavorites, actionId];
        } else {
          updatedCategoryFavorites = categoryFavorites;
        }
      } else {
        // Remove from favorites
        updatedCategoryFavorites = categoryFavorites.filter((id: string) => id !== actionId);
      }
      
      // Update favorites
      const updatedFavorites = {
        ...favorites,
        [categoryId]: updatedCategoryFavorites
      };
      
      // Update customFields
      const updatedCustomFields = {
        ...customFields,
        favorites: updatedFavorites
      };
      
      // Update user
      await prisma.appUser.update({
        where: { id: user.id },
        data: {
          customFields: updatedCustomFields
        }
      });
  
      return NextResponse.json<ApiResponse<Record<string, string[]>>>({
        success: true,
        data: updatedFavorites
      });
    } catch (error) {
      console.error("Error updating favorites:", error);
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  }