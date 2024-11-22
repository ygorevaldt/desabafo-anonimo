import { makeRegisterSupportUseCase } from "@/app/api/use-cases/factories/make-register-support-use-case";
import { SupportResponseDto } from "../dtos/support-response.dto";
import { HttpStatusCode } from "../../constants/http-status-code";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const registerUnburdenUseCase = makeRegisterSupportUseCase();

  try {
    const { unburdenId } = await request.json();
    const { support } = await registerUnburdenUseCase.execute({ unburdenId });

    return NextResponse.json(new SupportResponseDto(support), {
      status: HttpStatusCode.CREATED,
    });
  } catch (error) {
    return NextResponse.json({ status: HttpStatusCode.INTERNAL_SERVER_ERROR });
  }
}
