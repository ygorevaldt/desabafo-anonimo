import { database } from "@/app/api/infra/database";
import axios, { HttpStatusCode } from "axios";
import { describe, expect, it, beforeEach } from "vitest";

describe("unburden", () => {
  beforeEach(async () => {
    await database.unburden.deleteMany();
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  it("should fetch a list of unburdens", async () => {
    const [res1, res2] = await Promise.all([
      axios.post(`${baseUrl}/api/v1/unburden`, {
        title: "Desabafo 1",
        content: "Este é apenas um desabafo sincero 1",
      }),
      axios.post(`${baseUrl}/api/v1/unburden`, {
        title: "Desabafo 2",
        content: "Este é apenas um desabafo sincero 2",
      }),
    ]);

    const { status, data } = await axios.get(`${baseUrl}/api/v1/unburden`);
    console.log("data", data.unburdens[0]._count);

    expect(status).toEqual(HttpStatusCode.Ok);
    expect(data).toHaveProperty("unburdens");
    expect(data.unburdens.length).toEqual(2);
  });
});
