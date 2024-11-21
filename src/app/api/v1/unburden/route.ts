import { NextRequest, NextResponse } from "next/server";
import { makeRegisterUnburdenUseCase } from "../../use-cases/factories/make-register-unburden-use-case";
import { HttpStatusCode } from "../../constants/http-status-code";
import { makeListUnburdensUseCase } from "../../use-cases/factories/make-list-unburdens-use-case";
import { UnburdenResponseDto } from "../dtos/unburden-response.dto";

export async function POST(request: NextRequest) {
  const registerUnburdenUseCase = makeRegisterUnburdenUseCase();

  try {
    const { title, content } = await request.json();
    const { unburden } = await registerUnburdenUseCase.execute({
      title,
      content,
    });

    return NextResponse.json(new UnburdenResponseDto(unburden), {
      status: HttpStatusCode.CREATED,
    });
  } catch (error) {
    return NextResponse.json({ status: HttpStatusCode.INTERNAL_SERVER_ERROR });
  }
}

export async function GET() {
  const listUnburdensUseCase = makeListUnburdensUseCase();

  try {
    const response = await listUnburdensUseCase.execute();
    return NextResponse.json({
      unburdens: response.unburdens.map((item) => {
        return new UnburdenResponseDto(item);
      }),
    });
  } catch (error) {
    return NextResponse.json({ status: HttpStatusCode.INTERNAL_SERVER_ERROR });
  }
}
