import { NextResponse } from "next/server";
import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { sanitizeResponseHeaders } from "./sanitize-headers.util";

export enum OpossumErrorCode {
  OPEN_BREAKER = "EOPENBREAKER",
  TIMED_OUT = "ETIMEDOUT",
}

type ErrorWithCode = {
  code?: string;
  message?: string;
};

const JSON_CONTENT_TYPE = { "Content-Type": "application/json" };

export function handleGatewayError(error: unknown): NextResponse {
  const err = error as ErrorWithCode;

  if (err?.code === OpossumErrorCode.OPEN_BREAKER) {
    const headers = sanitizeResponseHeaders(undefined, {
      "Retry-After": "10",
      ...JSON_CONTENT_TYPE,
    });

    return NextResponse.json(
      {
        message:
          "O serviço está temporariamente indisponível para estabilização. Por favor, tente novamente em alguns instantes.",
        code: "CIRCUIT_BREAKER_OPEN",
      },
      {
        status: HttpStatusCode.SERVICE_UNAVAILABLE,
        headers,
      },
    );
  }

  if (
    err?.code === OpossumErrorCode.TIMED_OUT ||
    err?.message?.toLowerCase().includes("timed out")
  ) {
    const headers = sanitizeResponseHeaders(undefined, JSON_CONTENT_TYPE);

    return NextResponse.json(
      {
        message:
          "O serviço interno demorou além do tempo limite para responder.",
        code: "GATEWAY_TIMEOUT",
      },
      {
        status: HttpStatusCode.GATEWAY_TIMEOUT,
        headers,
      },
    );
  }

  const headers = sanitizeResponseHeaders(undefined, JSON_CONTENT_TYPE);

  return NextResponse.json(
    {
      message: "Ocorreu um erro interno inesperado no servidor.",
      code: "INTERNAL_SERVER_ERROR",
    },
    {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      headers,
    },
  );
}

