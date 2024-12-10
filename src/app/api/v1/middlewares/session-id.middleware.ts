import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

export function sessionIdMiddleware(request: NextRequest) {
  const sessionId = request.cookies.get("session_id")?.value ?? nanoid();

  const response = NextResponse.next();

  const oneYearsInSeconds = 1 * 365 * 24 * 60 * 60;
  response.cookies.set("session_id", sessionId, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: oneYearsInSeconds,
  });

  return response;
}
