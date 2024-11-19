import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import axios from "axios";
import { describe, expect, it } from "vitest";

describe("status", () => {
  it("should return data from api status", async () => {
    const { status, data } = await axios.get(
      "http://localhost:3000/api/v1/status",
    );

    const updatedAtParser = new Date(data.updated_at).toISOString();

    expect(status).toEqual(HttpStatusCode.OK);
    expect(data.updated_at).toEqual(updatedAtParser);
    expect(data.database.version).toEqual("17.1");
    expect(data.database.max_connections).toEqual(100);
    expect(data.database.opened_connections).toBeLessThanOrEqual(10);
  });
});
