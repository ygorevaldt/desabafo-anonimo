import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { beforeEach, describe, expect, it } from "vitest";
import * as gatewayRoute from "@/app/api/gateway/[...path]/route";
import { testClient } from "../../utils/test-client";
import { cleanDatabase } from "../../utils/clean-database.util";
import { AiModerationService } from "@/app/api/services/ai-moderation.service";

describe("Structured Outputs AI Moderation", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  it("POST /api/gateway/v1/unburden with safe content should approve and return 201 with sensitiveContent false", async () => {
    const response = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    })
      .post("/api/gateway/v1/unburden")
      .send({
        title: "Dia cansativo no trabalho",
        content:
          "Hoje tive um dia muito cansativo no trabalho, mas estou buscando descansar e me recuperar.",
      });

    expect(response.status).toBe(HttpStatusCode.CREATED);
    expect(response.body).toHaveProperty("id");
    expect(response.body.sensitive_content).toBe(false);
  });

  it("POST /api/gateway/v1/unburden with sensitive distress content should return 201 with sensitiveContent true", async () => {
    const response = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    })
      .post("/api/gateway/v1/unburden")
      .send({
        title: "Muita tristeza e dor",
        content:
          "Estou passando por um luto muito pesado e uma depressão profunda, precisando de acolhimento e desabafo.",
      });

    expect(response.status).toBe(HttpStatusCode.CREATED);
    expect(response.body).toHaveProperty("id");
    expect(response.body.sensitive_content).toBe(true);
  });

  it("POST /api/gateway/v1/unburden with toxic/illegal content should return 401 Unauthorized", async () => {
    const response = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    })
      .post("/api/gateway/v1/unburden")
      .send({
        title: "Ameaça e apologia",
        content:
          "Vamos matar e espancar todos na rua cometer crimes e massacre",
      });

    expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED);
  });

  it("AiModerationService returns valid structured output object", async () => {
    const service = new AiModerationService();
    const result = await service.moderate("Texto simples de teste");

    expect(result).toHaveProperty("status");
    expect(["APPROVED", "SENSITIVE", "BLOCKED"]).toContain(result.status);
    expect(result).toHaveProperty("category");
    expect(result).toHaveProperty("isSensitive");
    expect(typeof result.isSensitive).toBe("boolean");
  });
});
