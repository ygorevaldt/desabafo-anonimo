import { NextRequest, NextResponse } from "next/server";
import { makeRegisterVentUseCase } from "../../use-cases/factories/make-register-vent-use-case";
import { HttpStatusCode } from "../../constants/http-status-code";

export async function POST(request: NextRequest) {
  const registerVentUseCase = makeRegisterVentUseCase();

  try {
    const { title, description } = await request.json();
    const { vent } = await registerVentUseCase.execute({ title, description });

    return NextResponse.json(vent, { status: HttpStatusCode.CREATED });
  } catch (error) {
    return NextResponse.json({ status: HttpStatusCode.INTERNAL_SERVER_ERROR });
  }
}
