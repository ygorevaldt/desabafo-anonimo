import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { HttpStatusCode } from "../constants/http-status-code";
import {
  InvalidSessionIdException,
  RegisterNotFoundException,
} from "../services/exceptions";
import { UnauthorizedContentException } from "../services/exceptions/unauthorized-content.exception";

export function handleRequestError(error: any) {
  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }

  if (error instanceof ZodError) {
    const errors = error.errors.map((err) => {
      return {
        path: err.path.join("."),
        message: err.message,
      };
    });

    const firstMessage = errors[0]?.message || "Requisição ruim";

    return NextResponse.json(
      { message: firstMessage, issues: errors },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  if (
    error instanceof InvalidSessionIdException ||
    error instanceof UnauthorizedContentException
  ) {
    return NextResponse.json(
      { message: error.message },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  if (error instanceof RegisterNotFoundException) {
    return NextResponse.json(
      { message: error.message },
      { status: HttpStatusCode.NOT_FOUND },
    );
  }

  return NextResponse.json(
    { message: "Serviço indisponível" },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
  );
}
