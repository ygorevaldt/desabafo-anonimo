import { database } from "@/app/api/infra/database";
import axios, { HttpStatusCode } from "axios";
import { describe, expect, it, beforeEach } from "vitest";

describe("unburden", () => {
  beforeEach(async () => {
    await database.support.deleteMany();
    await database.unburden.deleteMany();
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  it("GET to /api/v1/unburden should return http status code 200 and a list of unburdens", async () => {
    await Promise.all([
      axios.post(`${baseUrl}/api/v1/unburden`, {
        title: "Desabafo 1",
        content: "Este é apenas um desabafo sincero 1",
      }),
      axios.post(`${baseUrl}/api/v1/unburden`, {
        title: "Desabafo 2",
        content: "Este é apenas um desabafo sincero 2",
      }),
    ]);

    const { status, data } = await axios.get(
      `${baseUrl}/api/v1/unburden?page=1`,
    );

    expect(status).toEqual(HttpStatusCode.Ok);
    expect(data).toHaveProperty("unburdens");
    expect(data.unburdens.length).toEqual(2);
    expect(data.page).toEqual(1);
    expect(data.total).toEqual(2);
  });

  it("GET to /api/v1/unburden should return http status code 200 and an empty list of unburdens", async () => {
    const { status, data } = await axios.get(
      `${baseUrl}/api/v1/unburden?page=1`,
    );

    expect(status).toEqual(HttpStatusCode.Ok);
    expect(data).toHaveProperty("unburdens");
    expect(data.unburdens.length).toEqual(0);
    expect(data.page).toEqual(1);
    expect(data.total).toEqual(0);
  });
});
