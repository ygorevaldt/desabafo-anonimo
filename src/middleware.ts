import { NextRequest } from "next/server";
import { sessionIdMiddleware } from "./app/api/v1/middlewares/session-id.middleware";

export function middleware(request: NextRequest) {
  const apiRoute = request.url.includes("api");
  if (apiRoute) {
    return sessionIdMiddleware(request);
  }
}

export const config = {
  matcher: "/api/:path*",
};
