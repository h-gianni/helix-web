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
  console.log("Middleware is running!");
  
  // First check if it's a public route
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // Protect all non-public routes
  const authObject = await auth.protect();
  
  // Now handle onboarding flow redirects for authenticated users
  const pathname = request.nextUrl.pathname;
  
  // Skip onboarding checks for non-dashboard routes or static assets
  if (
    !pathname.startsWith('/dashboard') || 
    pathname.includes('.') || 
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Get the setup state from cookies
  const setupState = request.cookies.get('setup-state')?.value;
  let setupData = {};
  
  try {
    setupData = setupState ? JSON.parse(setupState) : {};
  } catch (e) {
    console.error('Failed to parse setup state', e);
  }
  
  const { 
    organizationName,
    hasActivities,
    hasTeams
  } = setupData as {
    organizationName?: string,
    hasActivities?: boolean,
    hasTeams?: boolean
  };

  // If trying to access dashboard directly but setup is not complete,
  // redirect to onboarding intro page to show progress
  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    const setupComplete = organizationName && hasActivities && hasTeams;
    
    if (!setupComplete) {
      return NextResponse.redirect(new URL('/dashboard/onboarding/intro', request.url));
    }
  }
  
  // Special case to handle direct access to onboarding root
  if (pathname === '/dashboard/onboarding') {
    // Always redirect to intro for onboarding overview
    return NextResponse.redirect(new URL('/dashboard/onboarding/intro', request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};