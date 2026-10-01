import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { beforeEach, describe, expect, it } from "vitest";
import { cleanDatabase } from "../../utils/clean-database.util";
import * as gatewayRoute from "@/app/api/gateway/[...path]/route";
import { testClient } from "../../utils/test-client";

describe("comment", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  it("GET to /api/gateway/v1/comment should return http status code 200", async () => {
    const unburdenResponse = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    })
      .post("/api/gateway/v1/unburden")
      .send({
        title: "Desabafo",
        content: "Este é apenas um desabado sincero",
      });

    const createdUnburden = unburdenResponse.body;

    const bodyToCreateComment = {
      unburden_id: createdUnburden.id,
      content: "Any content with 2500 caracteres in max",
    };

    const commentClient = testClient(gatewayRoute, {
      path: ["v1", "comment"] as any,
    });

    await commentClient
      .post("/api/gateway/v1/comment")
      .send(bodyToCreateComment);
    await commentClient
      .post("/api/gateway/v1/comment")
      .send(bodyToCreateComment);
    await commentClient
      .post("/api/gateway/v1/comment")
      .send(bodyToCreateComment);

    const response = await commentClient.get(
      `/api/gateway/v1/comment?unburden_id=${createdUnburden.id}`,
    );

    expect(response.status).toEqual(HttpStatusCode.OK);
    expect(response.body.comments.length).toEqual(3);
  });

  it("GET to /api/gateway/v1/comment should return comments with their nested subcomments", async () => {
    const unburdenResponse = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    })
      .post("/api/gateway/v1/unburden")
      .send({
        title: "Desabafo",
        content: "Este é apenas um desabado sincero",
      });

    const createdUnburden = unburdenResponse.body;
    const commentClient = testClient(gatewayRoute, {
      path: ["v1", "comment"] as any,
    });

    const parentCommentResponse = await commentClient
      .post("/api/gateway/v1/comment")
      .send({
        unburden_id: createdUnburden.id,
        content: "Comentário principal",
      });

    await commentClient.post("/api/gateway/v1/comment").send({
      comment_id: parentCommentResponse.body.id,
      content: "Primeira resposta acolhedora",
    });

    await commentClient.post("/api/gateway/v1/comment").send({
      comment_id: parentCommentResponse.body.id,
      content: "Segunda resposta mais recente",
    });

    const response = await commentClient.get(
      `/api/gateway/v1/comment?unburden_id=${createdUnburden.id}`,
    );

    expect(response.status).toEqual(HttpStatusCode.OK);
    expect(response.body.comments.length).toEqual(1);
    expect(response.body.comments[0].subcomments.length).toEqual(2);
    expect(response.body.comments[0].subcomments[0].content).toEqual(
      "Segunda resposta mais recente",
    );
    expect(response.body.comments[0].subcomments[1].content).toEqual(
      "Primeira resposta acolhedora",
    );
  });

  it("GET to /api/gateway/v1/comment should pin AI comfort comment at index 0", async () => {
    const unburdenResponse = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    })
      .post("/api/gateway/v1/unburden")
      .send({
        title: "Desabafo com IA",
        content: "Este é um desabafo para testar fixação do acolhimento",
      });

    const createdUnburden = unburdenResponse.body;
    const commentClient = testClient(gatewayRoute, {
      path: ["v1", "comment"] as any,
    });

    await commentClient.post("/api/gateway/v1/comment").send({
      unburden_id: createdUnburden.id,
      content: "🤖 [Acolhimento Inicial - IA]\nOlá! Você não está sozinho(a).",
    });

    await commentClient.post("/api/gateway/v1/comment").send({
      unburden_id: createdUnburden.id,
      content: "Comentário de um usuário humano mais recente",
    });

    const response = await commentClient.get(
      `/api/gateway/v1/comment?unburden_id=${createdUnburden.id}`,
    );

    expect(response.status).toEqual(HttpStatusCode.OK);
    expect(response.body.comments.length).toEqual(2);
    expect(response.body.comments[0].content).toContain(
      "[Acolhimento Inicial - IA]",
    );
    expect(response.body.comments[1].content).toEqual(
      "Comentário de um usuário humano mais recente",
    );
  });
});
