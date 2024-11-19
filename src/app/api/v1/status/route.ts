import { NextRequest, NextResponse } from "next/server";
import { FetchApiStatus } from "../../use-cases/fetch-api-status.usecase";

export async function GET(request: NextRequest) {
  const fetchApiStatusUseCase = new FetchApiStatus();
  const { updatedAt, database } = await fetchApiStatusUseCase.execute();

  return NextResponse.json({
    updated_at: updatedAt,
    database: {
      version: database.version,
      max_connections: database.maxConnections,
      opened_connections: database.openedConnections,
    },
  });
}
