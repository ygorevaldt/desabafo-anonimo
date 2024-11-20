import axios from "axios";
import { headers } from "next/headers";
import { describe, expect, it } from "vitest";

describe("unburden", () => {
  it.skip("should register a new unburden", async () => {
    const unburden = {
      title: "Teste",
      description: "Desabafo de teste",
    };

    const response = await axios.post(
      "http://localhost:3000/api/v1/unburden",
      unburden,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    expect(response.status).toBe(201);
  });
});
