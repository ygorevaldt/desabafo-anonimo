import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { beforeEach, describe, expect, it } from "vitest";
import * as gatewayRoute from "@/app/api/gateway/[...path]/route";
import { testClient } from "../../utils/test-client";
import { cleanDatabase } from "../../utils/clean-database.util";

describe("unburden", () => {
  const unburden = {
    title: "Desabafo",
    content: "Este é apenas um desabado sincero",
  };

  beforeEach(async () => {
    await cleanDatabase();
  });

  it("POST to /api/gateway/v1/unburden should return http status code 201", async () => {
    const response = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    })
      .post("/api/gateway/v1/unburden")
      .send(unburden);

    expect(response.status).toBe(HttpStatusCode.CREATED);
  });

  it("POST to /api/gateway/v1/unburden should return http status code 400", async () => {
    const someInvalidRequestsBody = [
      {},
      { title: null },
      { title: "" },
      { content: null },
      { content: "" },
      { title: null, content: null },
      { title: "", content: "" },
    ];

    for (const body of someInvalidRequestsBody) {
      const response = await testClient(gatewayRoute, {
        path: ["v1", "unburden"] as any,
      })
        .post("/api/gateway/v1/unburden")
        .send(body);

      expect(response.status).toEqual(400);
    }
  });

  it("POST to /api/gateway/v1/unburden should return http status code 401", async () => {
    const response = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    })
      .post("/api/gateway/v1/unburden")
      .send({
        title: "Desabafo",
        content:
          "Este é apenas um desabado com muitos termos sensívels: matar, roubar, se cortar, suicídio, morte, me queimar",
      });

    expect(response.status).toEqual(HttpStatusCode.UNAUTHORIZED);
  });

  it("POST to /api/gateway/v1/unburden with wantsAiComfort should return 201 immediately without blocking", async () => {
    const startTime = Date.now();
    const response = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    })
      .post("/api/gateway/v1/unburden")
      .send({
        ...unburden,
        wantsAiComfort: true,
      });
    const elapsedTime = Date.now() - startTime;

    expect(response.status).toBe(HttpStatusCode.CREATED);
    expect(response.body).toHaveProperty("id");
    expect(elapsedTime).toBeLessThan(2000);
  });
});
