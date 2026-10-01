import {
  MODERATION_CACHE_TTL_MS,
  MAX_MODERATION_CACHE_ENTRIES,
} from "../../constants/report-constants";

export type CachedModerationEntry<T> = {
  verdict: T;
  expiresAt: number;
};

export class ModerationCacheService<T = any> {
  private cache = new Map<string, CachedModerationEntry<T>>();
  private ttlMs: number;
  private maxEntries: number;

  constructor(
    ttlMs: number = MODERATION_CACHE_TTL_MS,
    maxEntries: number = MAX_MODERATION_CACHE_ENTRIES,
  ) {
    this.ttlMs = ttlMs;
    this.maxEntries = maxEntries;
  }

  get(hash: string): T | null {
    const entry = this.cache.get(hash);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(hash);
      return null;
    }

    return entry.verdict;
  }

  set(hash: string, verdict: T): void {
    if (this.cache.size >= this.maxEntries) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(hash, {
      verdict,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  has(hash: string): boolean {
    return this.get(hash) !== null;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const moderationCache = new ModerationCacheService();
