import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { NextRequest, NextResponse } from "next/server";
import { handleRequestError } from "@/app/api/utils/handle-request-error.util";
import { makeGenerateIaSupportMessageService } from "@/app/api/services/factories/make-generate-ia-support-message-service";
import { generateIaSupportMessageBodySchema } from "../schemas/generate-ia-support-message-body.schema";
import { IaSupportMessageResponseDto } from "../dtos/ia-support-response.dto";

export async function POST(request: NextRequest) {
  const generateIaSupportMessage = makeGenerateIaSupportMessageService();

  try {
    const requestBodyJson = await request.json();
    const body = generateIaSupportMessageBodySchema.parse(requestBodyJson);

    const { iaSupportMessage } = await generateIaSupportMessage.execute({
      userMessage: body.content,
    });

    const response = new IaSupportMessageResponseDto(iaSupportMessage);
    return NextResponse.json(response, {
      status: HttpStatusCode.OK,
    });
  } catch (error) {
    return handleRequestError(error);
  }
}
