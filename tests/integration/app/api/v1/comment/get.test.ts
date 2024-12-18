import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import axios from "axios";
import { beforeEach, describe, expect, it } from "vitest";
import { cleanDatabase } from "../../utils/clean-database.util";

describe("comment", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  it.only("GET to /api/v1/comment should return http status code 200", async () => {
    const createUnburdenResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/unburden`,
      {
        title: "Desabafo",
        content: "Este é apenas um desabado sincero",
      },
    );
    const createdUnburden = createUnburdenResponse.data;

    const bodyToCreateComment = {
      unburden_id: createdUnburden.id,
      content: "Any content with 2500 caracteres in max",
    };

    await Promise.all([
      axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/comment`,
        bodyToCreateComment,
      ),
      axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/comment`,
        bodyToCreateComment,
      ),
      axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/comment`,
        bodyToCreateComment,
      ),
    ]);

    const { status, data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/comment?unburden_id=${createdUnburden.id}`,
    );

    expect(status).toEqual(HttpStatusCode.OK);
    expect(data.comments.length).toEqual(3);
  });
});
