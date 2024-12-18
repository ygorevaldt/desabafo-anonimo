import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import axios from "axios";
import { beforeEach, describe, expect, it } from "vitest";
import { cleanDatabase } from "../../utils/clean-database.util";

describe("comment", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  it("POST to /api/v1/comment should return http status code 201", async () => {
    const createUnburdenResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/unburden`,
      {
        title: "Desabafo",
        content: "Este é apenas um desabado sincero",
      },
    );

    const createdUnburden = createUnburdenResponse.data;

    const createCommentResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/comment`,
      {
        unburden_id: createdUnburden.id,
        content: "Any content with 2500 caracteres in max",
      },
    );

    const { status, data } = createCommentResponse;

    expect(status).toEqual(HttpStatusCode.CREATED);
    expect(data).toHaveProperty("id");
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
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/comment`,
          body,
        );
      } catch (error: any) {
        expect(error.status).toEqual(HttpStatusCode.BAD_REQUEST);
      }
    }
  });
});
