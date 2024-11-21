import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { database } from "@/app/api/infra/database";
import axios from "axios";
import { beforeEach, describe, expect, it } from "vitest";

describe("support", () => {
  beforeEach(async () => {
    await database.support.deleteMany();
    await database.unburden.deleteMany();
  });

  it.only("should register a new support to existing unburden", async () => {
    const createUnburdenResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/unburden`,
      {
        title: "Desabafo",
        content: "Este é apenas um desabado sincero",
      },
    );
    const unburden = createUnburdenResponse.data;

    const createSupportResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/support`,
      {
        unburdenId: unburden.id,
      },
    );

    const { status, data } = createSupportResponse;

    expect(status).toEqual(HttpStatusCode.CREATED);
  });
});
