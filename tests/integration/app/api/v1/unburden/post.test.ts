import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { database } from "@/app/api/infra/database";
import axios from "axios";
import { beforeEach, describe, expect, it } from "vitest";

describe("unburden", () => {
  const unburden = {
    title: "Desabafo",
    content: "Este é apenas um desabado sincero",
  };

  beforeEach(async () => {
    await database.support.deleteMany();
    await database.unburden.deleteMany();
  });

  it("POST to /api/v1/unburden should return http status code 201", async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/unburden`,
      unburden,
    );

    expect(response.status).toBe(HttpStatusCode.CREATED);
  });

  it("POST to /api/v1/unburden should return http status code 400", async () => {
    const someInvalidRequestsBody = [
      {},
      { title: null },
      { title: "" },
      { content: null },
      { content: "" },
      { title: null, content: null },
      { title: "", content: "" },
    ];

    for (const body of someInvalidRequestsBody) {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/unburden`,
          body,
        );
      } catch (error: any) {
        expect(error.status).toEqual(400);
      }
    }
  });
});
