import { beforeEach, describe, expect, it } from "vitest";
import { AiModerationService } from "@/app/api/services/ai-moderation.service";
import { moderationCache } from "@/app/api/services/cache/moderation-cache.service";
import { generateContentHash } from "@/app/api/utils/generate-content-hash.util";

describe("Moderation Hash Caching and Deduplication", () => {
  beforeEach(() => {
    moderationCache.clear();
  });

  it("should generate deterministic sha256 hash for normalized content", () => {
    const hash1 = generateContentHash("  meu desabafo   aqui  ", "  Titulo ");
    const hash2 = generateContentHash("meu desabafo aqui", "Titulo");

    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64);
  });

  it("should cache moderation result on first evaluation and return from cache on subsequent calls", async () => {
    const service = new AiModerationService();
    const text = "Este é um relato para teste de cache e idempotencia";
    const title = "Titulo Teste";

    const hash = generateContentHash(text, title);
    expect(moderationCache.has(hash)).toBe(false);

    const firstResult = await service.moderate(text, title);
    expect(moderationCache.has(hash)).toBe(true);
    expect(firstResult.status).toBe("APPROVED");

    const cachedEntry = moderationCache.get(hash);
    expect(cachedEntry).toEqual(firstResult);

    const initialCacheSize = moderationCache.size();
    const secondResult = await service.moderate(`  ${text}   `, ` ${title} `);
    expect(secondResult).toEqual(firstResult);
    expect(moderationCache.size()).toBe(initialCacheSize);
  });

  it("should cache sensitive verdicts and restore them faithfully", async () => {
    const service = new AiModerationService();
    const sensitiveText = "Estou enfrentando um luto muito pesado e depressão profunda.";
    const hash = generateContentHash(sensitiveText);

    const result = await service.moderate(sensitiveText);
    expect(result.status).toBe("SENSITIVE");
    expect(result.isSensitive).toBe(true);
    expect(moderationCache.has(hash)).toBe(true);

    const secondResult = await service.moderate(sensitiveText);
    expect(secondResult.isSensitive).toBe(true);
    expect(secondResult.status).toBe("SENSITIVE");
  });
});
