import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { GatewayDispatcher } from "../dispatcher/gateway-dispatcher";
import { sanitizeResponseHeaders } from "../utils/sanitize-headers.util";
import { handleGatewayError } from "../utils/handle-gateway-error.util";
import { extractClientIp } from "../utils/extract-client-ip.util";
import { rateLimiter } from "../rate-limit/rate-limiter";
import { circuitBreakerRegistry } from "../circuit-breaker/circuit-breaker-registry";
import { RateLimitResult } from "../rate-limit/rate-limit.types";

type RouteContext = {
  params?: Promise<{ path?: string | string[] }>;
};

const dispatcher = new GatewayDispatcher();

function buildRateLimitHeaders(
  result: RateLimitResult,
): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.resetSeconds),
  };
}

async function resolvePathParts(
  request: NextRequest,
  context?: RouteContext,
): Promise<string[]> {
  if (context?.params) {
    const resolved = await context.params;
    if (Array.isArray(resolved?.path)) {
      return resolved.path;
    }
    if (typeof resolved?.path === "string" && resolved.path.length > 0) {
      return [resolved.path];
    }
  }

  const pathname = request.nextUrl.pathname;
  return pathname
    .replace(/^\/api\/gateway\/?/, "")
    .split("/")
    .filter(Boolean);
}

async function handleGatewayRequest(
  request: NextRequest,
  context?: RouteContext,
): Promise<NextResponse> {
  try {
    const clientIp = extractClientIp(request);
    const isMutative = GatewayDispatcher.isMutative(request.method);
    const rateLimitResult = rateLimiter.check(clientIp, isMutative);

    if (!rateLimitResult.allowed) {
      const headers = sanitizeResponseHeaders(undefined, {
        "Retry-After": String(rateLimitResult.retryAfterSeconds),
        "Content-Type": "application/json",
        ...buildRateLimitHeaders(rateLimitResult),
      });

      return NextResponse.json(
        {
          message:
            "Você atingiu o limite de requisições permitidas. Aguarde alguns instantes antes de tentar novamente.",
          code: "TOO_MANY_REQUESTS",
          retryAfterSeconds: rateLimitResult.retryAfterSeconds,
        },
        {
          status: HttpStatusCode.TOO_MANY_REQUESTS,
          headers,
        },
      );
    }

    const pathParts = await resolvePathParts(request, context);
    const domain = GatewayDispatcher.resolveDomain(pathParts) || "default";

    const downstreamResponse = await circuitBreakerRegistry.execute(
      domain,
      () => dispatcher.dispatch(pathParts, request),
    );

    const sanitizedHeaders = sanitizeResponseHeaders(
      downstreamResponse.headers,
      buildRateLimitHeaders(rateLimitResult),
    );

    return new NextResponse(downstreamResponse.body, {
      status: downstreamResponse.status,
      statusText: downstreamResponse.statusText,
      headers: sanitizedHeaders,
    });
  } catch (error) {
    return handleGatewayError(error);
  }
}

export async function GET(request: NextRequest, context?: RouteContext) {
  return handleGatewayRequest(request, context);
}

export async function POST(request: NextRequest, context?: RouteContext) {
  return handleGatewayRequest(request, context);
}

export async function PUT(request: NextRequest, context?: RouteContext) {
  return handleGatewayRequest(request, context);
}

export async function DELETE(request: NextRequest, context?: RouteContext) {
  return handleGatewayRequest(request, context);
}

export async function PATCH(request: NextRequest, context?: RouteContext) {
  return handleGatewayRequest(request, context);
}

