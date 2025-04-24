// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  // First check if it's a public route
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // Protect all non-public routes
  const authObject = await auth.protect();

  const pathname = request.nextUrl.pathname;

  // Skip middleware handling for non-dashboard routes or static assets
  if (
    !pathname.startsWith("/dashboard") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Get the onboarding completion status from cookie
  const onboardingComplete =
    request.cookies.get("onboarding-complete")?.value === "true";

  // If user is at main dashboard but hasn't completed onboarding, redirect to onboarding
  if (pathname === "/dashboard" && !onboardingComplete) {
    return NextResponse.redirect(
      new URL("/dashboard/onboarding/intro", request.url)
    );
  }

  // Get the setup state from cookies
  const setupState = request.cookies.get("setup-state")?.value;
  let setupData = {
    organizationName: "",
    hasActivities: false,
    hasTeams: false,
  };

  try {
    if (setupState) {
      const parsedData = JSON.parse(setupState);
      setupData = {
        ...setupData,
        ...parsedData,
      };
    }
  } catch (e) {
    console.error("Failed to parse setup state", e);
  }

  // ROUTING LOGIC:

  // Handle direct access to onboarding root or intro page after onboarding is complete
  if (
    (pathname === "/dashboard/onboarding" ||
      pathname === "/dashboard/onboarding/intro") &&
    onboardingComplete
  ) {
    // If onboarding is complete, redirect to main dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // For all other onboarding paths, handle the special case of onboarding root
  if (pathname === "/dashboard/onboarding") {
    // Always redirect root onboarding path to intro
    return NextResponse.redirect(
      new URL("/dashboard/onboarding/intro", request.url)
    );
  }

  // Allow all other routes
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
