import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { describe, expect, it, beforeEach } from "vitest";
import * as gatewayRoute from "@/app/api/gateway/[...path]/route";
import { testClient } from "../../utils/test-client";
import { cleanDatabase } from "../../utils/clean-database.util";

describe("unburden", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  it("GET to /api/gateway/v1/unburden should return http status code 200 and a list of unburdens", async () => {
    const client = testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    });

    await client.post("/api/gateway/v1/unburden").send({
      title: "Desabafo 1",
      content: "Este é apenas um desabafo sincero 1",
    });

    await client.post("/api/gateway/v1/unburden").send({
      title: "Desabafo 2",
      content: "Este é apenas um desabafo sincero 2",
    });

    const response = await client.get("/api/gateway/v1/unburden?page=1");

    expect(response.status).toEqual(HttpStatusCode.OK);
    expect(response.body).toHaveProperty("unburdens");
    expect(response.body.unburdens.length).toEqual(2);
    expect(response.body.page).toEqual(1);
    expect(response.body.total).toEqual(2);
  });

  it("GET to /api/gateway/v1/unburden should return http status code 200 and an empty list of unburdens", async () => {
    const client = testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    });
    const response = await client.get("/api/gateway/v1/unburden?page=1");

    expect(response.status).toEqual(HttpStatusCode.OK);
    expect(response.body).toHaveProperty("unburdens");
    expect(response.body.unburdens.length).toEqual(0);
    expect(response.body.page).toEqual(1);
    expect(response.body.total).toEqual(0);
  });

  it("GET to /api/gateway/v1/unburden should accurately count both root comments and replies in comments_amount", async () => {
    const unburdenClient = testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    });
    const commentClient = testClient(gatewayRoute, {
      path: ["v1", "comment"] as any,
    });

    const postResponse = await unburdenClient
      .post("/api/gateway/v1/unburden")
      .send({
        title: "Desabafo com Respostas",
        content: "Verificando se a contagem inclui comentários e subcomentários",
      });

    const unburdenId = postResponse.body.id;

    const rootCommentResponse = await commentClient
      .post("/api/gateway/v1/comment")
      .send({
        unburden_id: unburdenId,
        content: "Primeiro comentário raiz",
      });

    await commentClient.post("/api/gateway/v1/comment").send({
      comment_id: rootCommentResponse.body.id,
      content: "Uma resposta ao comentário raiz",
    });

    const listResponse = await unburdenClient.get(
      "/api/gateway/v1/unburden?page=1",
    );

    expect(listResponse.status).toEqual(HttpStatusCode.OK);
    const target = listResponse.body.unburdens.find(
      (u: { id: string }) => u.id === unburdenId,
    );
    expect(target).toBeDefined();
    expect(target.comments_amount).toEqual(2);
  });
});
