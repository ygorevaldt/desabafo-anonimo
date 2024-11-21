import { NextRequest, NextResponse } from "next/server";
import { FetchApiStatus } from "../../use-cases/fetch-api-status.usecase";
import { StatusResponseDto } from "../dtos/status-response.dto";

export async function GET(request: NextRequest) {
  const fetchApiStatusUseCase = new FetchApiStatus();
  const response = await fetchApiStatusUseCase.execute();

  return NextResponse.json(new StatusResponseDto(response));
}
