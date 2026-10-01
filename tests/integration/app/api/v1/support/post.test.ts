import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { beforeEach, describe, expect, it } from "vitest";
import * as gatewayRoute from "@/app/api/gateway/[...path]/route";
import { testClient } from "../../utils/test-client";
import { cleanDatabase } from "../../utils/clean-database.util";

describe("support", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  it("POST to /api/gateway/v1/support should return http status code 201", async () => {
    const unburdenResponse = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    })
      .post("/api/gateway/v1/unburden")
      .send({
        title: "Desabafo",
        content: "Este é apenas um desabado sincero",
      });

    const unburden = unburdenResponse.body;
    const sessionId = "valid-test-session-id";

    const createSupportResponse = await testClient(gatewayRoute, {
      path: ["v1", "support"] as any,
    })
      .post("/api/gateway/v1/support")
      .set("Cookie", `session_id=${sessionId}`)
      .send({
        unburden_id: unburden.id,
      });

    expect(createSupportResponse.status).toEqual(HttpStatusCode.CREATED);
    expect(createSupportResponse.body).toHaveProperty("id");
  });

  it("POST to /api/gateway/v1/support should throw error with http status code 401", async () => {
    const unburdenResponse = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    })
      .post("/api/gateway/v1/unburden")
      .send({
        title: "Desabafo",
        content: "Este é apenas um desabado sincero",
      });

    const unburden = unburdenResponse.body;

    const response = await testClient(gatewayRoute, {
      path: ["v1", "support"] as any,
    })
      .post("/api/gateway/v1/support")
      .send({
        unburden_id: unburden.id,
      });

    expect(response.status).toEqual(401);
  });

  it("POST to /api/gateway/v1/support should throw error with http status code 400", async () => {
    const sessionId = "generic_session_id";
    const invalidRequestsBody = [
      {},
      { unburden_id: "" },
      { unburden_id: null },
    ];

    for (const body of invalidRequestsBody) {
      const response = await testClient(gatewayRoute, {
        path: ["v1", "support"] as any,
      })
        .post("/api/gateway/v1/support")
        .set("Cookie", `session_id=${sessionId}`)
        .send(body);

      expect(response.status).toEqual(400);
    }
  });
});
