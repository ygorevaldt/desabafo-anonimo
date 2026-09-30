import { database } from "@/app/api/infra/database";
import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { describe, expect, it, beforeEach } from "vitest";
import * as unburdenRoute from "@/app/api/v1/unburden/route";
import * as commentRoute from "@/app/api/v1/comment/route";
import { testClient } from "../../utils/test-client";

describe("unburden", () => {
  beforeEach(async () => {
    await database.support.deleteMany();
    await database.comment.deleteMany();
    await database.unburden.deleteMany();
  });

  it("GET to /api/v1/unburden should return http status code 200 and a list of unburdens", async () => {
    const client = testClient(unburdenRoute);

    await client.post("/api/v1/unburden").send({
      title: "Desabafo 1",
      content: "Este é apenas um desabafo sincero 1",
    });

    await client.post("/api/v1/unburden").send({
      title: "Desabafo 2",
      content: "Este é apenas um desabafo sincero 2",
    });

    const response = await client.get("/api/v1/unburden?page=1");

    expect(response.status).toEqual(HttpStatusCode.OK);
    expect(response.body).toHaveProperty("unburdens");
    expect(response.body.unburdens.length).toEqual(2);
    expect(response.body.page).toEqual(1);
    expect(response.body.total).toEqual(2);
  });

  it("GET to /api/v1/unburden should return http status code 200 and an empty list of unburdens", async () => {
    const client = testClient(unburdenRoute);
    const response = await client.get("/api/v1/unburden?page=1");

    expect(response.status).toEqual(HttpStatusCode.OK);
    expect(response.body).toHaveProperty("unburdens");
    expect(response.body.unburdens.length).toEqual(0);
    expect(response.body.page).toEqual(1);
    expect(response.body.total).toEqual(0);
  });

  it("GET to /api/v1/unburden should accurately count both root comments and replies in comments_amount", async () => {
    const unburdenClient = testClient(unburdenRoute);
    const commentClient = testClient(commentRoute);

    const postResponse = await unburdenClient.post("/api/v1/unburden").send({
      title: "Desabafo com Respostas",
      content: "Verificando se a contagem inclui comentários e subcomentários",
    });

    const unburdenId = postResponse.body.id;

    const rootCommentResponse = await commentClient
      .post("/api/v1/comment")
      .send({
        unburden_id: unburdenId,
        content: "Primeiro comentário raiz",
      });

    await commentClient.post("/api/v1/comment").send({
      comment_id: rootCommentResponse.body.id,
      content: "Uma resposta ao comentário raiz",
    });

    const listResponse = await unburdenClient.get("/api/v1/unburden?page=1");

    expect(listResponse.status).toEqual(HttpStatusCode.OK);
    const target = listResponse.body.unburdens.find(
      (u: { id: string }) => u.id === unburdenId,
    );
    expect(target).toBeDefined();
    expect(target.comments_amount).toEqual(2);
  });
});
