import { beforeEach, describe, expect, it } from "vitest";
import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { testClient } from "../utils/test-client";
import * as gatewayRoute from "@/app/api/gateway/[...path]/route";
import { circuitBreakerRegistry } from "@/app/api/gateway/circuit-breaker/circuit-breaker-registry";

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

  it("should trip circuit to OPEN on repeated failures and fail-fast with status 503", async () => {
    const breaker = circuitBreakerRegistry.get("unburden", {
      errorThresholdPercentage: 50,
      resetTimeout: 200,
      volumeThreshold: 2,
    });

    breaker.open();
    expect(breaker.opened).toBe(true);

    const startTime = Date.now();
    const response = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    }).get("/api/gateway/v1/unburden");
    const duration = Date.now() - startTime;

    expect(response.status).toBe(HttpStatusCode.SERVICE_UNAVAILABLE);
    expect(response.body).toEqual({
      message:
        "O serviço está temporariamente indisponível para estabilização. Por favor, tente novamente em alguns instantes.",
      code: "CIRCUIT_BREAKER_OPEN",
    });
    expect(response.headers).toHaveProperty("retry-after", "10");
    expect(duration).toBeLessThan(100);
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
});
