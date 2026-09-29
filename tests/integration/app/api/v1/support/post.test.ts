import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { database } from "@/app/api/infra/database";
import { beforeEach, describe, expect, it } from "vitest";
import * as unburdenRoute from "@/app/api/v1/unburden/route";
import * as supportRoute from "@/app/api/v1/support/route";
import { testClient } from "../../utils/test-client";

describe("support", () => {
  beforeEach(async () => {
    await database.support.deleteMany();
    await database.unburden.deleteMany();
  });

  it("POST to /api/v1/support should return http status code 201", async () => {
    const unburdenResponse = await testClient(unburdenRoute)
      .post("/api/v1/unburden")
      .send({
        title: "Desabafo",
        content: "Este é apenas um desabado sincero",
      });

    const unburden = unburdenResponse.body;
    const sessionId = "valid-test-session-id";

    const createSupportResponse = await testClient(supportRoute)
      .post("/api/v1/support")
      .set("Cookie", `session_id=${sessionId}`)
      .send({
        unburden_id: unburden.id,
      });

    expect(createSupportResponse.status).toEqual(HttpStatusCode.CREATED);
    expect(createSupportResponse.body).toHaveProperty("id");
  });

  it("POST to /api/v1/support should throw error with http status code 401", async () => {
    const unburdenResponse = await testClient(unburdenRoute)
      .post("/api/v1/unburden")
      .send({
        title: "Desabafo",
        content: "Este é apenas um desabado sincero",
      });

    const unburden = unburdenResponse.body;

    const response = await testClient(supportRoute)
      .post("/api/v1/support")
      .send({
        unburden_id: unburden.id,
      });

    expect(response.status).toEqual(401);
  });

  it("POST to /api/v1/support should throw error with http status code 400", async () => {
    const sessionId = "generic_session_id";
    const invalidRequestsBody = [
      {},
      { unburden_id: "" },
      { unburden_id: null },
    ];

    for (const body of invalidRequestsBody) {
      const response = await testClient(supportRoute)
        .post("/api/v1/support")
        .set("Cookie", `session_id=${sessionId}`)
        .send(body);

      expect(response.status).toEqual(400);
    }
  });
});
