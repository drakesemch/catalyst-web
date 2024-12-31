import { env } from "@/env";
import { NextResponse } from "next/server";

export function middleware(req: Request) {
  const { pathname } = new URL(req.url);
  const response = NextResponse.next();
  response.headers.set("x-url", pathname);

  // Check if the request is for /api/cron/ and if the condition is true
  if (pathname.startsWith("/api/cron/")) {
    if (req.headers.get("Authorization") !== `Bearer ${env.CRON_SECRET}`) {
      return NextResponse.json({ message: "Access Denied" }, { status: 403 });
    }
  }

  // Continue with the request
  return response;
}

// Apply the middleware to the API routes
export const config = {
  matcher: ["/app","/app/:path*","/api/:path*"],
};
