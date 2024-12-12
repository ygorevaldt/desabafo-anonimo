import { makeRegisterSupportService } from "@/app/api/services/factories/make-register-support-service";
import { SupportResponseDto } from "../dtos/support-response.dto";
import { HttpStatusCode } from "../../constants/http-status-code";
import { NextRequest, NextResponse } from "next/server";
import { handleRequestError } from "../../utils/handle-request-error.util";

export async function POST(request: NextRequest) {
  const registerSupportService = makeRegisterSupportService();

  try {
    const sessionId = request.cookies.get("session_id")?.value;
    const { unburdenId } = await request.json();

    const { support } = await registerSupportService.execute({
      unburdenId,
      sessionId,
    });

    return NextResponse.json(new SupportResponseDto(support), {
      status: HttpStatusCode.CREATED,
    });
  } catch (error) {
    return handleRequestError(error);
  }
}
