import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { beforeEach, describe, expect, it } from "vitest";
import { cleanDatabase } from "../../utils/clean-database.util";
import * as unburdenRoute from "@/app/api/v1/unburden/route";
import * as commentRoute from "@/app/api/v1/comment/route";
import { testClient } from "../../utils/test-client";

describe("comment", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  it("POST to /api/v1/comment should return http status code 201", async () => {
    const unburdenResponse = await testClient(unburdenRoute)
      .post("/api/v1/unburden")
      .send({
        title: "Desabafo",
        content: "Este é apenas um desabado sincero",
      });

    const createdUnburden = unburdenResponse.body;

    const createCommentResponse = await testClient(commentRoute)
      .post("/api/v1/comment")
      .send({
        unburden_id: createdUnburden.id,
        content: "Any content with 2500 caracteres in max",
      });

    expect(createCommentResponse.status).toEqual(HttpStatusCode.CREATED);
    expect(createCommentResponse.body).toHaveProperty("id");
  });

  it("POST to /api/v1/comment should throw error with http status code 400", async () => {
    const invalidRequestsBody = [
      {},
      { unburden_id: "" },
      { unburden_id: null },
      { unburden_id: "any_uuid", content: null },
      { unburden_id: "any_uuid", content: "" },
    ];

    for (const body of invalidRequestsBody) {
      const response = await testClient(commentRoute)
        .post("/api/v1/comment")
        .send(body);

      expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    }
  });

  it("POST to /api/v1/comment should return http status code 401", async () => {
    const unburdenResponse = await testClient(unburdenRoute)
      .post("/api/v1/unburden")
      .send({
        title: "Desabafo",
        content: "Este é apenas um desabado sincero",
      });

    const createdUnburden = unburdenResponse.body;

    const response = await testClient(commentRoute)
      .post("/api/v1/comment")
      .send({
        unburden_id: createdUnburden.id,
        content:
          "Este é apenas um comentário com muitos termos sensívels: matar, roubar, se cortar, suicídio, morte, me queimar",
      });

    expect(response.status).toEqual(HttpStatusCode.UNAUTHORIZED);
  });
});
