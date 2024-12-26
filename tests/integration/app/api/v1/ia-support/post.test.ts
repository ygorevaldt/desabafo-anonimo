import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { database } from "@/app/api/infra/database";
import axios from "axios";
import { beforeEach, describe, expect, it } from "vitest";

describe("ia support", () => {
  beforeEach(async () => {
    await database.support.deleteMany();
    await database.unburden.deleteMany();
  });

  it("POST to /api/v1/ia-support should return http status code 200", async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/ia-support`,
      {
        content: "Este é apenas um desabado sincero",
      },
    );

    const { status, data } = response;

    expect(status).toEqual(HttpStatusCode.OK);
    expect(data).toHaveProperty("support_message");
    expect(data.support_message.length).toBeGreaterThan(0);
  });
});
