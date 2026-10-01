import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { beforeEach, describe, expect, it } from "vitest";
import * as gatewayRoute from "@/app/api/gateway/[...path]/route";
import { testClient } from "../../utils/test-client";
import { cleanDatabase } from "../../utils/clean-database.util";

describe("Unburden Report Registration", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  async function createTestUnburden() {
    const response = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    })
      .post("/api/gateway/v1/unburden")
      .send({
        title: "Desabafo para teste de denuncia",
        content: "Este e um desabafo comum que sera alvo de teste de denuncias.",
      });

    return response.body.id as string;
  }

  it("POST /api/gateway/v1/unburden/:id/report should register report and return 201", async () => {
    const unburdenId = await createTestUnburden();
    const sessionId = "session-test-user-1";

    const response = await testClient(gatewayRoute, {
      path: ["v1", "unburden", unburdenId, "report"] as any,
    })
      .post(`/api/gateway/v1/unburden/${unburdenId}/report`)
      .set("x-session-id", sessionId)
      .send({
        reason: "Conteúdo ofensivo",
      });

    expect(response.status).toBe(HttpStatusCode.CREATED);
    expect(response.body).toEqual({
      success: true,
      alreadyReported: false,
      reportCount: 1,
      message: "Denúncia registrada com sucesso para análise da moderação.",
    });
  });

  it("POST /api/gateway/v1/unburden/:id/report repeated with same session should be idempotent and return 200", async () => {
    const unburdenId = await createTestUnburden();
    const sessionId = "session-test-user-duplicate";

    const firstResponse = await testClient(gatewayRoute, {
      path: ["v1", "unburden", unburdenId, "report"] as any,
    })
      .post(`/api/gateway/v1/unburden/${unburdenId}/report`)
      .set("x-session-id", sessionId)
      .send({
        reason: "Primeira denúncia",
      });

    expect(firstResponse.status).toBe(HttpStatusCode.CREATED);
    expect(firstResponse.body.alreadyReported).toBe(false);

    const secondResponse = await testClient(gatewayRoute, {
      path: ["v1", "unburden", unburdenId, "report"] as any,
    })
      .post(`/api/gateway/v1/unburden/${unburdenId}/report`)
      .set("x-session-id", sessionId)
      .send({
        reason: "Segunda tentativa da mesma sessão",
      });

    expect(secondResponse.status).toBe(HttpStatusCode.OK);
    expect(secondResponse.body).toEqual({
      success: true,
      alreadyReported: true,
      reportCount: 1,
      message: "Você já sinalizou este desabafo para moderação.",
    });
  });

  it("POST /api/gateway/v1/unburden/:id/report with non-existent id should return 404", async () => {
    const nonExistentId = "00000000-0000-0000-0000-000000000000";

    const response = await testClient(gatewayRoute, {
      path: ["v1", "unburden", nonExistentId, "report"] as any,
    })
      .post(`/api/gateway/v1/unburden/${nonExistentId}/report`)
      .set("x-session-id", "session-123")
      .send({});

    expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
  });
});
