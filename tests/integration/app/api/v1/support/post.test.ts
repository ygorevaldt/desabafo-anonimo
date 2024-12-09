import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { database } from "@/app/api/infra/database";
import axios from "axios";
import { beforeEach, describe, expect, it } from "vitest";

describe("support", () => {
  beforeEach(async () => {
    await database.support.deleteMany();
    await database.unburden.deleteMany();
  });

  it("POST to /api/v1/support should return http status code 201", async () => {
    const createUnburdenResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/unburden`,
      {
        title: "Desabafo",
        content: "Este é apenas um desabado sincero",
      },
    );

    const cookies = createUnburdenResponse.headers["set-cookie"];
    const sessionId = cookies![0]
      .split(";")
      .find((item) => item.includes("session_id"))
      ?.split("=")[1];

    const unburden = createUnburdenResponse.data;

    const createSupportResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/support`,
      {
        unburdenId: unburden.id,
      },
      {
        headers: {
          Cookie: `session_id=${sessionId}`,
        },
      },
    );

    const { status, data } = createSupportResponse;
    console.log("data", data);

    expect(status).toEqual(HttpStatusCode.CREATED);
  });
});
