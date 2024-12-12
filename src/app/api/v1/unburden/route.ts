import { NextRequest, NextResponse } from "next/server";
import { makeRegisterUnburdenService } from "../../services/factories/make-register-unburden-service";
import { HttpStatusCode } from "../../constants/http-status-code";
import { makeListUnburdensService } from "../../services/factories/make-list-unburdens-service";
import { UnburdenResponseDto } from "../dtos/unburden-response.dto";

export async function POST(request: NextRequest) {
  const registerUnburdenService = makeRegisterUnburdenService();

  try {
    const { title, content } = await request.json();
    const { unburden } = await registerUnburdenService.execute({
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

export async function GET(request: NextRequest) {
  const listUnburdensService = makeListUnburdensService();
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");

  const sessionId = request.cookies.get("session_id")?.value;

  try {
    const response = await listUnburdensService.execute({
      page: Number(page),
      sessionId: sessionId ?? "",
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
    return NextResponse.json({ status: HttpStatusCode.INTERNAL_SERVER_ERROR });
  }
}
