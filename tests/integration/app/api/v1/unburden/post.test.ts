import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { database } from "@/app/api/infra/database";
import axios from "axios";
import { headers } from "next/headers";
import { title } from "process";
import { beforeEach, describe, expect, it } from "vitest";

describe("unburden", () => {
  beforeEach(async () => {
    await database.support.deleteMany();
    await database.unburden.deleteMany();
  });

  it("POST to /api/v1/unburden should return http status code 201", async () => {
    const unburden = {
      title: "Desabafo",
      content: "Este é apenas um desabado sincero",
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/unburden`,
      unburden,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    expect(response.status).toBe(HttpStatusCode.CREATED);
  });
});
