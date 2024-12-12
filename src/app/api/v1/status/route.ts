import { NextResponse } from "next/server";
import { FetchApiStatusService } from "../../services/fetch-api-status.service";
import { StatusResponseDto } from "../dtos/status-response.dto";

export async function GET() {
  const fetchApiStatusService = new FetchApiStatusService();
  const response = await fetchApiStatusService.execute();

  return NextResponse.json(new StatusResponseDto(response));
}
