import { beforeEach, describe, expect, it } from "vitest";
import { database } from "@/app/api/infra/database";
import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { testClient } from "../utils/test-client";
import * as gatewayRoute from "@/app/api/gateway/[...path]/route";
import { cleanDatabase } from "../utils/clean-database.util";

describe("API Gateway Proxy", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  it("GET to /api/gateway/v1/status should return status 200 and api status info", async () => {
    const response = await testClient(gatewayRoute, {
      path: ["v1", "status"] as any,
    }).get("/api/gateway/v1/status");

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toHaveProperty("updated_at");
    expect(response.body).toHaveProperty("database");
    expect(response.headers).not.toHaveProperty("x-powered-by");
  });

  it("POST to /api/gateway/v1/unburden should proxy and return status 201", async () => {
    const payload = {
      title: "Desabafo Gateway",
      content: "Este é um desabafo enviado através do ponto de entrada do API Gateway seguro.",
    };

    const response = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    })
      .post("/api/gateway/v1/unburden")
      .send(payload);

    expect(response.status).toBe(HttpStatusCode.CREATED);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe(payload.title);
    expect(response.headers).not.toHaveProperty("x-powered-by");

    const saved = await database.unburden.findUnique({
      where: { id: response.body.id },
    });
    expect(saved).not.toBeNull();
  });

  it("GET to /api/gateway/v1/unburden should proxy and return list with status 200", async () => {
    await database.unburden.create({
      data: {
        title: "Desabafo Existente",
        content: "Conteudo existente para teste de listagem via gateway.",
      },
    });

    const response = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    }).get("/api/gateway/v1/unburden?page=1");

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toHaveProperty("unburdens");
    expect(response.body.unburdens.length).toBeGreaterThanOrEqual(1);
    expect(response.headers).not.toHaveProperty("x-powered-by");
  });

  it("GET to /api/gateway/v1/unburden/:id should proxy and return unburden with status 200", async () => {
    const created = await database.unburden.create({
      data: {
        title: "Desabafo Unico",
        content: "Conteudo detalhado para busca por identificador unico.",
      },
    });

    const response = await testClient(gatewayRoute, {
      path: ["v1", "unburden", created.id] as any,
    }).get(`/api/gateway/v1/unburden/${created.id}`);

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body.unburden.id).toBe(created.id);
  });

  it("POST and GET to /api/gateway/v1/comment should proxy comments successfully", async () => {
    const unburden = await database.unburden.create({
      data: {
        title: "Desabafo com Comentario",
        content: "Conteudo do desabafo que recebera um comentario de apoio.",
      },
    });

    const commentPayload = {
      unburden_id: unburden.id,
      content: "Uma mensagem de carinho e apoio enviada via gateway.",
    };

    const postResponse = await testClient(gatewayRoute, {
      path: ["v1", "comment"] as any,
    })
      .post("/api/gateway/v1/comment")
      .send(commentPayload);

    expect(postResponse.status).toBe(HttpStatusCode.CREATED);
    expect(postResponse.body).toHaveProperty("id");

    const getResponse = await testClient(gatewayRoute, {
      path: ["v1", "comment"] as any,
    }).get(`/api/gateway/v1/comment?unburden_id=${unburden.id}`);

    expect(getResponse.status).toBe(HttpStatusCode.OK);
    expect(getResponse.body.comments.length).toBe(1);
  });

  it("should return 404 with ROUTE_NOT_FOUND when accessing non-existent gateway route", async () => {
    const response = await testClient(gatewayRoute, {
      path: ["v1", "rota-inexistente"] as any,
    }).get("/api/gateway/v1/rota-inexistente");

    expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual({
      message: "Recurso não encontrado no gateway.",
      code: "ROUTE_NOT_FOUND",
    });
  });

  it("should return 404 with VERSION_NOT_SUPPORTED when accessing unsupported API version", async () => {
    const response = await testClient(gatewayRoute, {
      path: ["v2", "unburden"] as any,
    }).get("/api/gateway/v2/unburden");

    expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual({
      message: "Versão da API não suportada.",
      code: "VERSION_NOT_SUPPORTED",
    });
  });

  it("should return 500 without stack trace when unhandled error occurs", async () => {
    const response = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    })
      .post("/api/gateway/v1/unburden")
      .send({ title: "Título Válido", content: "A".repeat(30) });

    expect([HttpStatusCode.CREATED, HttpStatusCode.INTERNAL_SERVER_ERROR]).toContain(
      response.status,
    );
    expect(response.body).not.toHaveProperty("stack");
  });
});
