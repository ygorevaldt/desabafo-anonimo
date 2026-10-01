import { HttpStatusCode } from "@/app/api/constants/http-status-code";
import { beforeEach, describe, expect, it } from "vitest";
import * as gatewayRoute from "@/app/api/gateway/[...path]/route";
import { testClient } from "../../utils/test-client";
import { cleanDatabase } from "../../utils/clean-database.util";
import { database } from "@/app/api/infra/database";

describe("Async AI Audit and Soft Deletion on Reports", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  async function createDirectUnburden(title: string, content: string) {
    const unburden = await database.unburden.create({
      data: {
        title,
        content,
        sensitiveContent: false,
      },
    });
    return unburden.id;
  }

  it("should soft delete a toxic post after accumulating 3 reports and hide it from public routes", async () => {
    const unburdenId = await createDirectUnburden(
      "Ameaça grave",
      "Texto com estupro massacre e assassinato proibido",
    );

    for (let i = 1; i <= 3; i++) {
      const response = await testClient(gatewayRoute, {
        path: ["v1", "unburden", unburdenId, "report"] as any,
      })
        .post(`/api/gateway/v1/unburden/${unburdenId}/report`)
        .set("x-session-id", `session-auditor-${i}`)
        .send({
          reason: `Denúncia número ${i}`,
        });

      expect(response.status).toBe(HttpStatusCode.CREATED);
      expect(response.body.reportCount).toBe(i);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const dbUnburden = await database.unburden.findUnique({
      where: { id: unburdenId },
    });
    expect(dbUnburden?.deletedAt).not.toBeNull();

    const listResponse = await testClient(gatewayRoute, {
      path: ["v1", "unburden"] as any,
    }).get("/api/gateway/v1/unburden");

    expect(listResponse.status).toBe(HttpStatusCode.OK);
    const itemInList = listResponse.body.unburdens.find(
      (u: any) => u.id === unburdenId,
    );
    expect(itemInList).toBeUndefined();

    const detailResponse = await testClient(gatewayRoute, {
      path: ["v1", "unburden", unburdenId] as any,
    }).get(`/api/gateway/v1/unburden/${unburdenId}`);

    expect(detailResponse.status).toBe(HttpStatusCode.NOT_FOUND);
  });

  it("should keep a safe post published after 3 reports if AI audit concludes safe", async () => {
    const unburdenId = await createDirectUnburden(
      "Post respeitoso",
      "Este é um texto completamente seguro apenas expressando cansaço normal.",
    );

    for (let i = 1; i <= 3; i++) {
      const response = await testClient(gatewayRoute, {
        path: ["v1", "unburden", unburdenId, "report"] as any,
      })
        .post(`/api/gateway/v1/unburden/${unburdenId}/report`)
        .set("x-session-id", `session-safe-${i}`)
        .send({
          reason: "Denúncia indevida",
        });

      expect(response.status).toBe(HttpStatusCode.CREATED);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const dbUnburden = await database.unburden.findUnique({
      where: { id: unburdenId },
    });
    expect(dbUnburden?.deletedAt).toBeNull();

    const detailResponse = await testClient(gatewayRoute, {
      path: ["v1", "unburden", unburdenId] as any,
    }).get(`/api/gateway/v1/unburden/${unburdenId}`);

    expect(detailResponse.status).toBe(HttpStatusCode.OK);
    expect(detailResponse.body.unburden.id).toBe(unburdenId);
  });
});
