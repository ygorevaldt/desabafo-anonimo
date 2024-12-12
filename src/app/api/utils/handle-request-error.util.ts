import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { HttpStatusCode } from "../constants/http-status-code";
import { InvalidSessionIdException } from "../services/exceptions";

export function handleRequestError(error: any) {
  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // send error to an external tool like DataDog, NewRelic, Sentry, etc..
  }

  if (error instanceof ZodError) {
    const errors = error.errors.map((error) => {
      return {
        path: error.path.join("."),
        message: error.message,
      };
    });

    return NextResponse.json(
      { message: "Requisição ruim", issues: errors },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  if (error instanceof InvalidSessionIdException) {
    return NextResponse.json(
      { message: error.message },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  return NextResponse.json(
    { message: "Serviço indisponível" },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
  );
}
