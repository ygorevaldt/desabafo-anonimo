import { NextResponse } from "next/server";

export function GET(request: Request) {
  return NextResponse.json({ mensagem: "Serviço online" });
}
