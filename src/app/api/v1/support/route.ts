import { makeRegisterSupportService } from "@/app/api/services/factories/make-register-support-service";
import { SupportResponseDto } from "../dtos/support-response.dto";
import { HttpStatusCode } from "../../constants/http-status-code";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const registerSupportService = makeRegisterSupportService();

  try {
    const sessionId = request.cookies.get("session_id")?.value;
    if (!sessionId) {
      return NextResponse.json({
        status: HttpStatusCode.UNAUTHORIZED,
        error: "session_id not valid",
      });
    }

    const { unburdenId } = await request.json();

    const { support } = await registerSupportService.execute({
      unburdenId,
      sessionId,
    });

    return NextResponse.json(new SupportResponseDto(support), {
      status: HttpStatusCode.CREATED,
    });
  } catch (error) {
    return NextResponse.json({ status: HttpStatusCode.INTERNAL_SERVER_ERROR });
  }
}
