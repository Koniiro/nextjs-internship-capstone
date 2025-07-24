// TODO: Task 2.2 - Configure authentication middleware for route protection
// import { authMiddleware } from "@clerk/nextjs"

// Placeholder middleware - currently allows all routes for development
// TODO: Replace with actual Clerk authMiddleware when authentication is implemented
import { clerkMiddleware, createRouteMatcher, auth } from '@clerk/nextjs/server'

const isProtectedRoute=createRouteMatcher([
  '/analytics(.*)',
  '/calendar(.*)',
  '/dashboard(.*)',
  '/projects(.*)',
  '/team(.*)',
  '/settings(.*)',
])
export default clerkMiddleware(async (auth, req)=>{
  if(isProtectedRoute(req)){
    await auth.protect()
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

/*
TODO: Task 2.2 Implementation Notes for Interns:
- Install and configure Clerk
- Set up authMiddleware to protect routes
- Configure public routes: ["/", "/sign-in", "/sign-up"]
- Protect all dashboard routes: ["/dashboard", "/projects"]
- Add proper redirects for unauthenticated users
*/
