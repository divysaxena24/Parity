import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/signup(.*)",
  "/charities(.*)",
  "/how-it-works",
  "/pricing",
  "/admin(.*)",
  "/api/webhooks(.*)"
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();

  // 1. Public route handling
  if (isPublicRoute(request)) {
     return NextResponse.next();
  }

  // 2. Authentication check
  if (!userId) {
     return await auth.protect();
  }

  // 3. Onboarding Redirect Guard (PRD Section 08/10)
  // Check if onboarding is complete via publicMetadata (sessionClaims is fast but can be stale)
  let onboardingComplete = sessionClaims?.metadata?.onboardingComplete;
  const isTargetingOnboarding = request.nextUrl.pathname.startsWith("/onboarding");
  
  // REAL-TIME FALLBACK: If the JWT claim is missing, check the DB directly 
  // before forcing a redirect (handles immediate transition after onboarding)
  if (!onboardingComplete && userId && !isTargetingOnboarding) {
    try {
      const [userRecord] = await sql`SELECT active_charity_id FROM users WHERE id = ${userId}`;
      if (userRecord?.active_charity_id) {
        onboardingComplete = true;
      }
    } catch (e) {
      console.error("[MIDDLEWARE_DB_ERROR]:", e);
    }
  }

  if (!onboardingComplete && !isTargetingOnboarding) {
    const onboardingUrl = new URL("/onboarding", request.url);
    return NextResponse.redirect(onboardingUrl);
  }

  // 4. Already completed onboarding, don't allow returning to onboarding page
  if (onboardingComplete && isTargetingOnboarding) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
