import { describe, expect, it } from "vitest";

describe("status", () => {
  it("should return http status code 200", async () => {
    const response = await fetch("http://localhost:3000/api/v1/status");
    expect(response.status).toBe(200);
  });
});
