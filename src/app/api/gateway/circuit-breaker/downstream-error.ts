import { NextResponse } from "next/server";

export class DownstreamError extends Error {
  public readonly response: NextResponse;

  constructor(response: NextResponse) {
    super(`Downstream service returned status ${response.status}`);
    this.name = "DownstreamError";
    this.response = response;
  }
}
