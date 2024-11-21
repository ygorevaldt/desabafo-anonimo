import { NextRequest, NextResponse } from "next/server";
import { makeRegisterUnburdenUseCase } from "../../use-cases/factories/make-register-unburden-use-case";
import { HttpStatusCode } from "../../constants/http-status-code";
import { makeListUnburdensUseCase } from "../../use-cases/factories/make-list-unburdens-use-case";

export async function POST(request: NextRequest) {
  const registerUnburdenUseCase = makeRegisterUnburdenUseCase();

  try {
    const { title, content } = await request.json();
    const { unburden } = await registerUnburdenUseCase.execute({
      title,
      description: content,
    });

    return NextResponse.json(unburden, { status: HttpStatusCode.CREATED });
  } catch (error) {
    return NextResponse.json({ status: HttpStatusCode.INTERNAL_SERVER_ERROR });
  }
}

export async function GET() {
  const listUnburdensUseCase = makeListUnburdensUseCase();

  try {
    const response = await listUnburdensUseCase.execute();
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ status: HttpStatusCode.INTERNAL_SERVER_ERROR });
  }
}
