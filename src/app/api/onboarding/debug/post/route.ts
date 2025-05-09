import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { readFileSync } from "fs";
import path from "path";
import type { ApiResponse } from "@/lib/types/api";
import { CompleteOnboardingInput } from "../../route";

/**
 * Debug endpoint to automatically post onboarding data
 * This is intended for development/testing purposes only
 */
export async function GET(request: Request) {
  try {
    // Only allow in development environment
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Debug endpoints are not available in production",
        },
        { status: 403 }
      );
    }

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Read sample data from the JSON file
    try {
      const filePath = path.join(
        process.cwd(),
        "src/app/api/onboarding/debug/post/payload.json"
      );
      const rawData = readFileSync(filePath, "utf8");
      const sampleData = JSON.parse(rawData) as CompleteOnboardingInput;

      // Forward the request to the onboarding API
      const headers = new Headers();
      headers.set("Content-Type", "application/json");

      // Forward authentication - Get the auth cookie from the incoming request
      const authCookies = request.headers.get("cookie");
      if (authCookies) {
        headers.set("cookie", authCookies);
      }

      const url = new URL("/api/onboarding", request.url).toString();
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(sampleData),
      });

      const result = await response.json();

      return NextResponse.json(
        {
          success: response.ok,
          sample_data_used: sampleData,
          api_response: result,
        },
        { status: response.ok ? 200 : response.status }
      );
    } catch (fileError) {
      console.error("Error reading or processing sample data:", fileError);
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error:
            "Failed to read sample data. Make sure sample-data.json exists in the correct location.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in debug post endpoint:", error);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
