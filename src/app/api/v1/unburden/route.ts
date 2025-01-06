import { NextRequest, NextResponse } from "next/server";

import { makeRegisterUnburdenService } from "@/app/api/services/factories/make-register-unburden-service";
import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { makeListUnburdensService } from "@/app/api/services/factories/make-list-unburdens-service";
import { handleRequestError } from "@/app/api/utils/handle-request-error.util";
import { UnburdenResponseDto } from "../dtos/unburden-response.dto";
import { registerUnburdenBodySchema } from "../schemas/register-unburden-body.schema";

export async function POST(request: NextRequest) {
  const registerUnburdenService = makeRegisterUnburdenService();

  try {
    const requestBodyJson = await request.json();
    const body = registerUnburdenBodySchema.parse(requestBodyJson);

    const { unburden } = await registerUnburdenService.execute(body);

    return NextResponse.json(new UnburdenResponseDto(unburden), {
      status: HttpStatusCode.CREATED,
    });
  } catch (error) {
    return handleRequestError(error);
  }
}

export async function GET(request: NextRequest) {
  const listUnburdensService = makeListUnburdensService();

  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");

  const sessionId = request.cookies.get("session_id")?.value ?? "";

  try {
    const response = await listUnburdensService.execute({
      page: Number(page),
      sessionId,
    });

    const unburdens = response.unburdens.map((item) => {
      return new UnburdenResponseDto(item);
    });

    return NextResponse.json({
      unburdens,
      page: response.page,
      take: response.take,
      total: response.total,
    });
  } catch (error) {
    console.error(error);
    return handleRequestError(error);
  }
}
