import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { handleRequestError } from "@/app/api/utils/handle-request-error.util";
import { makeRegisterReportService } from "@/app/api/services/factories/make-register-report-service";
import { registerReportBodySchema } from "../../../schemas/register-report-body.schema";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const sessionId =
      request.headers.get("x-session-id") ||
      request.cookies.get("session_id")?.value ||
      "anonymous-session";

    let bodyJson = {};
    try {
      bodyJson = await request.json();
    } catch {}

    const body = registerReportBodySchema.parse(bodyJson);
    const registerReportService = makeRegisterReportService();

    const result = await registerReportService.execute({
      unburdenId: id,
      sessionId,
      reason: body.reason,
    });

    const statusCode = result.alreadyReported
      ? HttpStatusCode.OK
      : HttpStatusCode.CREATED;

    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    return handleRequestError(error);
  }
}
