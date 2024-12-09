import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

export function sessionIdMiddleware(request: NextRequest) {
  let sessionId = request.cookies.get("session_id")?.value;
  if (sessionId) {
    return NextResponse.next();
  }

  sessionId = nanoid();

  const response = NextResponse.next();

  response.cookies.set("session_id", sessionId, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  request.cookies.set({
    name: "session_id",
    value: sessionId,
  });

  sessionId = request.cookies.get("session_id")?.value;

  return response;
}
