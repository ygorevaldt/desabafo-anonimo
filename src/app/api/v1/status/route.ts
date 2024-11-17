import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "@/app/api/constants/http-status-code";

export function GET(request: NextRequest) {
  return NextResponse.json({
    status: HttpStatusCode.OK,
    mensagem: "Serviço online",
  });
}
