import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/lib/types/api";

interface OrganizationNameInput {
  name: string;
  siteDomain: string;
}

interface OrganizationNameResponse {
  id: string;
  name: string;
  siteDomain: string;
}

// Create new organization
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.appUser.findUnique({
      where: {
        clerkId: userId,
        deletedAt: null,
      },
    });

    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Please complete registration first" },
        { status: 404 }
      );
    }

    const body: OrganizationNameInput = await request.json();
    const { name, siteDomain } = body;

    if (!name?.trim() || !siteDomain?.trim()) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Organization name and site domain are required" },
        { status: 400 }
      );
    }

    // Check if user already has an organization
    const existingOrg = await prisma.orgName.findFirst({
      where: { userId: user.id }
    });

      console.log("existingOrg--------------------", existingOrg);

    if (existingOrg) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Organization already exists for this user" },
        { status: 400 }
      );
    }

    // Create new organization
    const orgName = await prisma.orgName.create({
      data: {
        name: name.trim(),
        siteDomain: siteDomain.trim(),
        userId: user.id
      }
    });

    const response: OrganizationNameResponse = {
      id: orgName.id,
      name: orgName.name,
      siteDomain: orgName.siteDomain || "",
    };

    return NextResponse.json<ApiResponse<OrganizationNameResponse>>(
      { success: true, data: response },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Update existing organization
export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.appUser.findUnique({
      where: {
        clerkId: userId,
        deletedAt: null,
      },
    });

    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Please complete registration first" },
        { status: 404 }
      );
    }

    const body: OrganizationNameInput = await request.json();
    const { name, siteDomain } = body;

    if (!name?.trim() || !siteDomain?.trim()) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Organization name and site domain are required" },
        { status: 400 }
      );
    }

    // Find existing organization
    const existingOrg = await prisma.orgName.findFirst({
      where: { userId: user.id }
    });

    if (!existingOrg) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "No organization found for this user" },
        { status: 404 }
      );
    }

    // Update organization
    const orgName = await prisma.orgName.update({
      where: { id: existingOrg.id },
      data: {
        name: name.trim(),
        siteDomain: siteDomain.trim()
      }
    });

    const response: OrganizationNameResponse = {
      id: orgName.id,
      name: orgName.name,
      siteDomain: orgName.siteDomain || "",
    };

    return NextResponse.json<ApiResponse<OrganizationNameResponse>>(
      { success: true, data: response },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating organization:", error);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Get organization for current user
export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.appUser.findUnique({
      where: {
        clerkId: userId,
        deletedAt: null,
      },
    });

    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Please complete registration first" },
        { status: 404 }
      );
    }

    // Find existing organization
    const existingOrg = await prisma.orgName.findFirst({
      where: { userId: user.id }
    });

    if (!existingOrg) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "No organization found" },
        { status: 404 }
      );
    }

    const response: OrganizationNameResponse = {
      id: existingOrg.id,
      name: existingOrg.name,
      siteDomain: existingOrg.siteDomain || "",
    };

    return NextResponse.json<ApiResponse<OrganizationNameResponse>>(
      { success: true, data: response },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching organization:", error);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
} 