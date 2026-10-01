import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { beforeEach, describe, expect, it } from "vitest";
import { cleanDatabase } from "../../utils/clean-database.util";
import * as gatewayRoute from "@/app/api/gateway/[...path]/route";
import { testClient } from "../../utils/test-client";

describe("comment", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  it("POST to /api/gateway/v1/comment should return http status code 201", async () => {
    const unburdenResponse = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    })
      .post("/api/gateway/v1/unburden")
      .send({
        title: "Desabafo",
        content: "Este é apenas um desabado sincero",
      });

    const createdUnburden = unburdenResponse.body;

    const createCommentResponse = await testClient(gatewayRoute, {
      path: ["v1", "comment"] as any,
    })
      .post("/api/gateway/v1/comment")
      .send({
        unburden_id: createdUnburden.id,
        content: "Any content with 2500 caracteres in max",
      });

    expect(createCommentResponse.status).toEqual(HttpStatusCode.CREATED);
    expect(createCommentResponse.body).toHaveProperty("id");
  });

  it("POST to /api/gateway/v1/comment should throw error with http status code 400", async () => {
    const invalidRequestsBody = [
      {},
      { unburden_id: "" },
      { unburden_id: null },
      { unburden_id: "any_uuid", content: null },
      { unburden_id: "any_uuid", content: "" },
    ];

    for (const body of invalidRequestsBody) {
      const response = await testClient(gatewayRoute, {
        path: ["v1", "comment"] as any,
      })
        .post("/api/gateway/v1/comment")
        .send(body);

      expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    }
  });

  it("POST to /api/gateway/v1/comment should return http status code 401", async () => {
    const unburdenResponse = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    })
      .post("/api/gateway/v1/unburden")
      .send({
        title: "Desabafo",
        content: "Este é apenas um desabado sincero",
      });

    const createdUnburden = unburdenResponse.body;

    const response = await testClient(gatewayRoute, {
      path: ["v1", "comment"] as any,
    })
      .post("/api/gateway/v1/comment")
      .send({
        unburden_id: createdUnburden.id,
        content:
          "Este é apenas um comentário com muitos termos sensívels: matar, roubar, se cortar, suicídio, morte, me queimar",
      });

    expect(response.status).toEqual(HttpStatusCode.UNAUTHORIZED);
  });

  it("POST to /api/gateway/v1/comment with comment_id should create a reply and return 201", async () => {
    const unburdenResponse = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    })
      .post("/api/gateway/v1/unburden")
      .send({
        title: "Desabafo",
        content: "Este é apenas um desabado sincero",
      });

    const parentCommentResponse = await testClient(gatewayRoute, {
      path: ["v1", "comment"] as any,
    })
      .post("/api/gateway/v1/comment")
      .send({
        unburden_id: unburdenResponse.body.id,
        content: "Primeiro comentário de apoio",
      });

    const replyResponse = await testClient(gatewayRoute, {
      path: ["v1", "comment"] as any,
    })
      .post("/api/gateway/v1/comment")
      .send({
        comment_id: parentCommentResponse.body.id,
        content: "Muito obrigado pelas palavras de carinho!",
      });

    expect(replyResponse.status).toEqual(HttpStatusCode.CREATED);
    expect(replyResponse.body).toHaveProperty("id");
    expect(replyResponse.body.subcomment_id).toEqual(
      parentCommentResponse.body.id,
    );
  });

  it("POST to /api/gateway/v1/comment with non-existent comment_id should return 404", async () => {
    const response = await testClient(gatewayRoute, {
      path: ["v1", "comment"] as any,
    })
      .post("/api/gateway/v1/comment")
      .send({
        comment_id: "00000000-0000-0000-0000-000000000000",
        content: "Resposta para comentário inexistente",
      });

    expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
  });
});
