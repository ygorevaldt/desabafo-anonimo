import { database } from "@/app/api/infra/database";
import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { describe, expect, it, beforeEach } from "vitest";
import * as unburdenRoute from "@/app/api/v1/unburden/route";
import { testClient } from "../../utils/test-client";

describe("unburden", () => {
  beforeEach(async () => {
    await database.support.deleteMany();
    await database.unburden.deleteMany();
  });

  it("GET to /api/v1/unburden should return http status code 200 and a list of unburdens", async () => {
    const client = testClient(unburdenRoute);

    await client.post("/api/v1/unburden").send({
      title: "Desabafo 1",
      content: "Este é apenas um desabafo sincero 1",
    });

    await client.post("/api/v1/unburden").send({
      title: "Desabafo 2",
      content: "Este é apenas um desabafo sincero 2",
    });

    const response = await client.get("/api/v1/unburden?page=1");

    expect(response.status).toEqual(HttpStatusCode.OK);
    expect(response.body).toHaveProperty("unburdens");
    expect(response.body.unburdens.length).toEqual(2);
    expect(response.body.page).toEqual(1);
    expect(response.body.total).toEqual(2);
  });

  it("GET to /api/v1/unburden should return http status code 200 and an empty list of unburdens", async () => {
    const client = testClient(unburdenRoute);
    const response = await client.get("/api/v1/unburden?page=1");

    expect(response.status).toEqual(HttpStatusCode.OK);
    expect(response.body).toHaveProperty("unburdens");
    expect(response.body.unburdens.length).toEqual(0);
    expect(response.body.page).toEqual(1);
    expect(response.body.total).toEqual(0);
  });
});
