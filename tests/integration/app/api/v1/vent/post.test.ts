import axios from "axios";
import { headers } from "next/headers";
import { describe, expect, it } from "vitest";

describe("vent", () => {
  it.skip("should register a new vent", async () => {
    const vent = {
      title: "Teste",
      description: "Desabafo de teste",
    };

    const response = await axios.post(
      "http://localhost:3000/api/v1/vent",
      vent,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    expect(response.status).toBe(201);
  });
});
