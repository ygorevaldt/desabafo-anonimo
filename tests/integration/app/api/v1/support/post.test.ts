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
        unburden_id: unburden.id,
      },
      {
        headers: {
          Cookie: `session_id=${sessionId}`,
        },
      },
    );

    const { status, data } = createSupportResponse;

    expect(status).toEqual(HttpStatusCode.CREATED);
    expect(data).toHaveProperty("id");
  });

  it("POST to /api/v1/support should throw error with http status code 401", async () => {
    const createUnburdenResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/unburden`,
      {
        title: "Desabafo",
        content: "Este é apenas um desabado sincero",
      },
    );

    const unburden = createUnburdenResponse.data;

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/support`, {
        unburden_id: unburden.id,
      });
    } catch (error: any) {
      expect(error.status).toEqual(401);
    }
  });

  it("POST to /api/v1/support should throw error with http status code 400", async () => {
    const sessionId = "generic_session_id";
    const invalidRequestsBody = [
      {},
      { unburden_id: "" },
      { unburden_id: null },
    ];

    const headers = {
      Cookie: `session_id=${sessionId}`,
    };

    for (const body of invalidRequestsBody) {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/support`,
          body,
          { headers },
        );
      } catch (error: any) {
        expect(error.status).toEqual(400);
      }
    }
  });
});
