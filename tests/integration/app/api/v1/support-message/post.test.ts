import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { database } from "@/app/api/infra/database";
import axios from "axios";
import { beforeEach, describe, expect, it } from "vitest";

describe("support", () => {
  it("POST to /api/v1/support-message should return http status code 200", async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/support-message`,
      {
        user_message: "Este é apenas um desabado sincero",
      },
    );

    const { status, data } = response;

    console.log("data", data);

    expect(status).toEqual(HttpStatusCode.OK);
    expect(data.support_message).toBeDefined();
  });
});
