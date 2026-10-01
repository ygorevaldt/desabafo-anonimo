import { describe, expect, it } from "vitest";
import * as gatewayRoute from "@/app/api/gateway/[...path]/route";
import { testClient } from "../../utils/test-client";
import { cleanDatabase } from "../../utils/clean-database.util";

describe("status", () => {
  it("GET to /api/gateway/v1/status should return http status code 200 and the api status info", async () => {
    await cleanDatabase();
    const response = await testClient(gatewayRoute, {
      path: ["v1", "status"] as any,
    }).get("/api/gateway/v1/status");

    expect(response.status).toEqual(200);

    const responseBody = response.body;
    const updatedAtParser = new Date(responseBody.updated_at).toISOString();

    expect(responseBody.updated_at).toEqual(updatedAtParser);
    expect(responseBody.database.max_connections).toBeGreaterThan(0);
    expect(responseBody.database.opened_connections).toBeLessThanOrEqual(10);
  });
});
