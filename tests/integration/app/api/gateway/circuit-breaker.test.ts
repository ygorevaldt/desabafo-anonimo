import { beforeEach, describe, expect, it, vi } from "vitest";
import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { testClient } from "../utils/test-client";
import * as gatewayRoute from "@/app/api/gateway/[...path]/route";
import { circuitBreakerRegistry } from "@/app/api/gateway/circuit-breaker/circuit-breaker-registry";
import { database } from "@/app/api/infra/database";

describe("API Gateway Circuit Breaker", () => {
  beforeEach(() => {
    circuitBreakerRegistry.clear();
  });

  it("should operate normally with circuit CLOSED when downstream succeeds", async () => {
    const response = await testClient(gatewayRoute, {
      path: ["v1", "status"] as any,
    }).get("/api/gateway/v1/status");

    expect(response.status).toBe(HttpStatusCode.OK);
    const breaker = circuitBreakerRegistry.get("status");
    expect(breaker.opened).toBe(false);
  });

  it("should automatically trip circuit to OPEN on repeated 500 downstream responses and fail-fast with status 503", async () => {
    const breaker = circuitBreakerRegistry.get("unburden", {
      errorThresholdPercentage: 50,
      resetTimeout: 200,
      volumeThreshold: 2,
    });

    const originalFindMany = database.unburden.findMany;
    database.unburden.findMany = vi
      .fn()
      .mockRejectedValue(new Error("Database connection lost"));

    const firstResponse = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    }).get("/api/gateway/v1/unburden");
    expect(firstResponse.status).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);

    const secondResponse = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    }).get("/api/gateway/v1/unburden");
    expect(secondResponse.status).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);

    expect(breaker.opened).toBe(true);

    const startTime = Date.now();
    const thirdResponse = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    }).get("/api/gateway/v1/unburden");
    const duration = Date.now() - startTime;

    expect(thirdResponse.status).toBe(HttpStatusCode.SERVICE_UNAVAILABLE);
    expect(thirdResponse.body).toEqual({
      message:
        "O serviço está temporariamente indisponível para estabilização. Por favor, tente novamente em alguns instantes.",
      code: "CIRCUIT_BREAKER_OPEN",
    });
    expect(thirdResponse.headers).toHaveProperty("retry-after", "10");
    expect(duration).toBeLessThan(100);

    database.unburden.findMany = originalFindMany;
  });

  it("should keep circuit CLOSED when downstream returns 4xx client errors", async () => {
    const breaker = circuitBreakerRegistry.get("unburden", {
      errorThresholdPercentage: 50,
      resetTimeout: 200,
      volumeThreshold: 2,
    });

    for (let i = 0; i < 4; i++) {
      const response = await testClient(gatewayRoute, {
        path: ["v1", "unburden"] as any,
      })
        .post("/api/gateway/v1/unburden")
        .send({});

      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
    }

    expect(breaker.opened).toBe(false);
  });

  it("should isolate circuits between different domains", async () => {
    const unburdenBreaker = circuitBreakerRegistry.get("unburden");
    unburdenBreaker.open();

    const unburdenResponse = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    }).get("/api/gateway/v1/unburden");
    expect(unburdenResponse.status).toBe(HttpStatusCode.SERVICE_UNAVAILABLE);

    const statusResponse = await testClient(gatewayRoute, {
      path: ["v1", "status"] as any,
    }).get("/api/gateway/v1/status");
    expect(statusResponse.status).toBe(HttpStatusCode.OK);
  });

  it("should recover when circuit transitions to half-open and canary succeeds", async () => {
    const breaker = circuitBreakerRegistry.get("status", {
      resetTimeout: 50,
      volumeThreshold: 1,
    });

    breaker.open();
    expect(breaker.opened).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 80));

    const response = await testClient(gatewayRoute, {
      path: ["v1", "status"] as any,
    }).get("/api/gateway/v1/status");

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(breaker.opened).toBe(false);
  });

  it("should automatically recover to CLOSED after resetTimeout and a successful canary request following 500 errors", async () => {
    const breaker = circuitBreakerRegistry.get("unburden", {
      errorThresholdPercentage: 50,
      resetTimeout: 100,
      volumeThreshold: 2,
    });

    const originalFindMany = database.unburden.findMany;
    database.unburden.findMany = vi
      .fn()
      .mockRejectedValue(new Error("Transient database failure"));

    await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    }).get("/api/gateway/v1/unburden");

    await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    }).get("/api/gateway/v1/unburden");

    expect(breaker.opened).toBe(true);
    database.unburden.findMany = originalFindMany;

    await new Promise((resolve) => setTimeout(resolve, 150));

    const canaryResponse = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    }).get("/api/gateway/v1/unburden");

    expect(canaryResponse.status).toBe(HttpStatusCode.OK);
    expect(breaker.opened).toBe(false);
  });
});
