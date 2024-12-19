import { makeFetchUniqueUnburdenService } from "@/app/api/services/factories/make-fetch-unique-unburden-service";
import { handleRequestError } from "@/app/api/utils/handle-request-error.util";
import { NextRequest, NextResponse } from "next/server";
import { UnburdenResponseDto } from "../../dtos/unburden-response.dto";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  const fetchUniqueUnburdenService = makeFetchUniqueUnburdenService();

  try {
    const { id } = await params;
    const sessionId = request.cookies.get("session_id")?.value ?? "";

    const { unburden } = await fetchUniqueUnburdenService.execute({
      id,
      sessionId,
    });

    const unburdenDto = new UnburdenResponseDto(unburden);
    return NextResponse.json({ unburden: unburdenDto });
  } catch (error) {
    return handleRequestError(error);
  }
}
