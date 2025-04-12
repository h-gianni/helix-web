// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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
    !pathname.startsWith('/dashboard') || 
    pathname.includes('.') || 
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Get the setup state from cookies
  const setupState = request.cookies.get('setup-state')?.value;
  let setupData = {
    organizationName: '',
    hasActivities: false,
    hasTeams: false
  };
  
  try {
    if (setupState) {
      const parsedData = JSON.parse(setupState);
      setupData = {
        ...setupData,
        ...parsedData
      };
    }
  } catch (e) {
    console.error('Failed to parse setup state', e);
  }
  
  const { 
    organizationName,
    hasActivities,
    hasTeams
  } = setupData;

  // Check if user has completed onboarding
  const hasCompletedOnboarding = Boolean(organizationName && hasActivities && hasTeams);

  // ROUTING LOGIC:
  
  // Handle direct access to dashboard root
  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    // If user hasn't completed onboarding, redirect to onboarding intro
    if (!hasCompletedOnboarding) {
      return NextResponse.redirect(new URL('/dashboard/onboarding/intro', request.url));
    }
    // Otherwise, allow access to dashboard
    return NextResponse.next();
  }
  
  // Handle direct access to onboarding root or intro page after onboarding is complete
  if (
    (pathname === '/dashboard/onboarding' || pathname === '/dashboard/onboarding/intro') && 
    hasCompletedOnboarding
  ) {
    // If onboarding is complete, redirect to main dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // For all other onboarding paths, handle the special case of onboarding root
  if (pathname === '/dashboard/onboarding') {
    // Always redirect root onboarding path to intro
    return NextResponse.redirect(new URL('/dashboard/onboarding/intro', request.url));
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