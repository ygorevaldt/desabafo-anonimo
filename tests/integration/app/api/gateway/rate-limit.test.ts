import { beforeEach, describe, expect, it } from "vitest";
import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { testClient } from "../utils/test-client";
import * as gatewayRoute from "@/app/api/gateway/[...path]/route";
import { rateLimiter } from "@/app/api/gateway/rate-limit/rate-limiter";

describe("API Gateway Rate Limiter", () => {
  beforeEach(() => {
    rateLimiter.reset();
  });

  it("should return rate limit headers on allowed requests", async () => {
    const response = await testClient(gatewayRoute, {
      path: ["v1", "status"] as any,
    })
      .get("/api/gateway/v1/status")
      .set("x-forwarded-for", "192.168.1.10");

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.headers).toHaveProperty("x-ratelimit-limit");
    expect(response.headers).toHaveProperty("x-ratelimit-remaining");
    expect(response.headers).toHaveProperty("x-ratelimit-reset");
    expect(Number(response.headers["x-ratelimit-remaining"])).toBeLessThan(60);
  });

  it("should block requests when rate limit is exceeded returning 429 and Retry-After", async () => {
    const clientIp = "192.168.1.50";

    for (let i = 0; i < 15; i++) {
      const okResponse = await testClient(gatewayRoute, {
        path: ["v1", "unburden"] as any,
      })
        .post("/api/gateway/v1/unburden")
        .set("x-forwarded-for", clientIp)
        .send({
          title: "Título de Teste Válido",
          content: "Conteúdo de teste suficientemente longo para passar na validação.",
        });

      if (i < 15) {
        expect([HttpStatusCode.CREATED, HttpStatusCode.BAD_REQUEST]).toContain(
          okResponse.status,
        );
      }
    }

    const blockedResponse = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    })
      .post("/api/gateway/v1/unburden")
      .set("x-forwarded-for", clientIp)
      .send({
        title: "Título de Teste Válido",
        content: "Conteúdo de teste suficientemente longo para passar na validação.",
      });

    expect(blockedResponse.status).toBe(HttpStatusCode.TOO_MANY_REQUESTS);
    expect(blockedResponse.headers).toHaveProperty("retry-after");
    expect(blockedResponse.headers["x-ratelimit-remaining"]).toBe("0");
    expect(blockedResponse.body).toHaveProperty("code", "TOO_MANY_REQUESTS");
    expect(blockedResponse.body).toHaveProperty("retryAfterSeconds");
  });

  it("should isolate limits per client IP", async () => {
    const ipOne = "10.0.0.1";
    const ipTwo = "10.0.0.2";

    for (let i = 0; i < 15; i++) {
      await testClient(gatewayRoute, {
        path: ["v1", "unburden"] as any,
      })
        .post("/api/gateway/v1/unburden")
        .set("x-forwarded-for", ipOne)
        .send({
          title: "Título de Teste Válido",
          content: "Conteúdo de teste suficientemente longo para passar na validação.",
        });
    }

    const blockedResponseOne = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    })
      .post("/api/gateway/v1/unburden")
      .set("x-forwarded-for", ipOne)
      .send({
        title: "Título de Teste Válido",
        content: "Conteúdo de teste suficientemente longo para passar na validação.",
      });
    expect(blockedResponseOne.status).toBe(HttpStatusCode.TOO_MANY_REQUESTS);

    const allowedResponseTwo = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    })
      .post("/api/gateway/v1/unburden")
      .set("x-forwarded-for", ipTwo)
      .send({
        title: "Título de Teste Válido",
        content: "Conteúdo de teste suficientemente longo para passar na validação.",
      });
    expect(allowedResponseTwo.status).not.toBe(HttpStatusCode.TOO_MANY_REQUESTS);
  });
});
