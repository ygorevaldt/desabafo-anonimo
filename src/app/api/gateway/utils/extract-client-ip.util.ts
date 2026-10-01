import { NextRequest } from "next/server";

const IP_HEADERS: readonly string[] = [
  "x-forwarded-for",
  "x-real-ip",
  "cf-connecting-ip",
];

const DEFAULT_CLIENT_IP = "127.0.0.1";

export function extractClientIp(request: NextRequest): string {
  for (const header of IP_HEADERS) {
    const value = request.headers.get(header);
    if (!value) {
      continue;
    }

    const [firstIp] = value.split(",");
    const trimmed = firstIp?.trim();
    if (trimmed) {
      return trimmed;
    }
  }

  return DEFAULT_CLIENT_IP;
}

