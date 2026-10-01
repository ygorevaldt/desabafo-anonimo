import {
  RateLimitBucket,
  RateLimitConfig,
  RateLimitPolicy,
  RateLimitResult,
} from "./rate-limit.types";

export const DEFAULT_RATE_LIMIT_POLICIES: Record<
  RateLimitPolicy,
  RateLimitConfig
> = {
  [RateLimitPolicy.READ]: {
    windowMs: 60_000,
    maxRequests: 60,
  },
  [RateLimitPolicy.MUTATION]: {
    windowMs: 60_000,
    maxRequests: 15,
  },
};

export class RateLimiter {
  private readonly buckets = new Map<string, RateLimitBucket>();
  private readonly policies: Record<RateLimitPolicy, RateLimitConfig>;

  constructor(
    policies: Record<RateLimitPolicy, RateLimitConfig> = DEFAULT_RATE_LIMIT_POLICIES,
  ) {
    this.policies = policies;
  }

  public check(clientIp: string, isMutative: boolean): RateLimitResult {
    const policyKey = isMutative
      ? RateLimitPolicy.MUTATION
      : RateLimitPolicy.READ;
    const policy = this.policies[policyKey];
    const key = `${clientIp}:${policyKey}`;
    const now = Date.now();

    const existingBucket = this.buckets.get(key);
    const isExpired = !existingBucket || now >= existingBucket.expiresAt;

    if (isExpired) {
      const expiresAt = now + policy.windowMs;
      this.buckets.set(key, {
        count: 1,
        expiresAt,
      });

      return {
        allowed: true,
        limit: policy.maxRequests,
        remaining: policy.maxRequests - 1,
        resetSeconds: Math.ceil(expiresAt / 1000),
        retryAfterSeconds: 0,
      };
    }

    if (existingBucket.count < policy.maxRequests) {
      existingBucket.count += 1;
      return {
        allowed: true,
        limit: policy.maxRequests,
        remaining: policy.maxRequests - existingBucket.count,
        resetSeconds: Math.ceil(existingBucket.expiresAt / 1000),
        retryAfterSeconds: 0,
      };
    }

    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((existingBucket.expiresAt - now) / 1000),
    );

    return {
      allowed: false,
      limit: policy.maxRequests,
      remaining: 0,
      resetSeconds: Math.ceil(existingBucket.expiresAt / 1000),
      retryAfterSeconds,
    };
  }

  public reset(): void {
    this.buckets.clear();
  }

  public cleanup(): void {
    const now = Date.now();
    for (const [key, bucket] of this.buckets.entries()) {
      if (now >= bucket.expiresAt) {
        this.buckets.delete(key);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

