import { NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/types/api";
import payload from "./payload.json";

export async function GET() {
  try {
    // Make actual POST request to the global-actions endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/org/global-actions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    const usage = {
      endpoint: "/api/org/global-actions",
      method: "POST",
      contentType: "application/json",
      exampleCurl: `curl -X POST ${process.env.NEXT_PUBLIC_APP_URL}/api/org/global-actions \
        -H "Content-Type: application/json" \
        -d '${JSON.stringify(payload, null, 2)}'`,
    };

    return NextResponse.json<ApiResponse<any>>({
      success: true,
      data: {
        payload,
        usage,
        apiResponse: result
      }
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<never>>({
      success: false,
      error: "Error executing debug request"
    }, { status: 500 });
  }
}
