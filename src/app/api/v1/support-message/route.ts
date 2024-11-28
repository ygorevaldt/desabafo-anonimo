import { HttpStatusCode } from "../../constants/http-status-code";
import { NextRequest, NextResponse } from "next/server";
import { makeGenerateSupportMessageUseCase } from "../../use-cases/factories/make-generate-support-message-use-case";
import { SupportMessageResponseDto } from "../dtos/support-message-response.dto";

export async function POST(request: NextRequest) {
  const generateSupportMessageUseCase = makeGenerateSupportMessageUseCase();

  try {
    const { user_message } = await request.json();
    const { supportMessage } = await generateSupportMessageUseCase.execute({
      userMessage: user_message,
    });

    return NextResponse.json(new SupportMessageResponseDto(supportMessage), {
      status: HttpStatusCode.OK,
    });
  } catch (error) {
    return NextResponse.json({ status: HttpStatusCode.INTERNAL_SERVER_ERROR });
  }
}
