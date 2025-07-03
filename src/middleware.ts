import { clerkMiddleware , createRouteMatcher} from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(["/",'/sign-in(.*)','/sign-up(.*)',"/forgot-password","/sso-callback"])

export default clerkMiddleware(async (auth, req) => {
  const user = auth();
  const userId = (await user).userId;
  const url = new URL(req.url);

  // If user is authenticated and on a public route, redirect to dashboard
  if(userId && isPublicRoute(req)){
    return NextResponse.redirect(new URL("/dashboard",req.url))
  }
  
  // If user is not authenticated and trying to access protected route, protect it
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}