import { makeRegisterSupportService } from "@/app/api/services/factories/make-register-support-service";
import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { NextRequest, NextResponse } from "next/server";
import { handleRequestError } from "@/app/api/utils/handle-request-error.util";
import { SupportResponseDto } from "../dtos/support-response.dto";
import { registerSupportBodySchema } from "../schemas/register-support-body.schemas";

export async function POST(request: NextRequest) {
  const registerSupportService = makeRegisterSupportService();

  try {
    const sessionId = request.cookies.get("session_id")?.value;
    const requestBodyJson = await request.json();
    const body = registerSupportBodySchema.parse(requestBodyJson);

    const { support } = await registerSupportService.execute({
      unburdenId: body.unburden_id,
      commentId: body.comment_id,
      sessionId,
    });

    return NextResponse.json(new SupportResponseDto(support), {
      status: HttpStatusCode.CREATED,
    });
  } catch (error) {
    return handleRequestError(error);
  }
}
