import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/lib/types/api";

// Configure route segment
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes

// GET - Redirect to appropriate endpoint based on action type
export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type") || "global";
  
  // Redirect to appropriate endpoint
  if (type === "global") {
    return NextResponse.redirect(new URL(url.pathname.replace("/actions", "/globalactions") + url.search, url.origin));
  } else {
    return NextResponse.redirect(new URL(url.pathname.replace("/actions", "/functionactions") + url.search, url.origin));
  }
}

// POST - Redirect to appropriate endpoint based on action type
export async function POST(request: Request) {
  const { type = "global" } = await request.json();
  const url = new URL(request.url);
  
  // Redirect to appropriate endpoint
  if (type === "global") {
    return NextResponse.redirect(new URL(url.pathname.replace("/actions", "/globalactions"), url.origin));
  } else {
    return NextResponse.redirect(new URL(url.pathname.replace("/actions", "/functionactions"), url.origin));
  }
}

// DELETE - Redirect to appropriate endpoint based on action type
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type") || "global";
  
  // Redirect to appropriate endpoint
  if (type === "global") {
    return NextResponse.redirect(new URL(url.pathname.replace("/actions", "/globalactions") + url.search, url.origin));
  } else {
    return NextResponse.redirect(new URL(url.pathname.replace("/actions", "/functionactions") + url.search, url.origin));
  }
}