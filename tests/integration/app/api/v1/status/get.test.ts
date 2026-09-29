import { describe, expect, it } from "vitest";
import * as statusRoute from "@/app/api/v1/status/route";
import { testClient } from "../../utils/test-client";

describe("status", () => {
  it("GET to /api/v1/status should return http status code 200 and the api status info", async () => {
    const response = await testClient(statusRoute).get("/api/v1/status");

    expect(response.status).toEqual(200);

    const responseBody = response.body;
    const updatedAtParser = new Date(responseBody.updated_at).toISOString();

    expect(responseBody.updated_at).toEqual(updatedAtParser);
    expect(responseBody.database.max_connections).toBeGreaterThan(0);
    expect(responseBody.database.opened_connections).toBeLessThanOrEqual(10);
  });
});
