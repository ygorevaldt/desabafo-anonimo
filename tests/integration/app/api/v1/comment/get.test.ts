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

  it("GET to /api/v1/comment should return http status code 200", async () => {
    const unburdenResponse = await testClient(unburdenRoute)
      .post("/api/v1/unburden")
      .send({
        title: "Desabafo",
        content: "Este é apenas um desabado sincero",
      });

    const createdUnburden = unburdenResponse.body;

    const bodyToCreateComment = {
      unburden_id: createdUnburden.id,
      content: "Any content with 2500 caracteres in max",
    };

    const commentClient = testClient(commentRoute);

    await commentClient.post("/api/v1/comment").send(bodyToCreateComment);
    await commentClient.post("/api/v1/comment").send(bodyToCreateComment);
    await commentClient.post("/api/v1/comment").send(bodyToCreateComment);

    const response = await commentClient.get(
      `/api/v1/comment?unburden_id=${createdUnburden.id}`,
    );

    expect(response.status).toEqual(HttpStatusCode.OK);
    expect(response.body.comments.length).toEqual(3);
  });
});
