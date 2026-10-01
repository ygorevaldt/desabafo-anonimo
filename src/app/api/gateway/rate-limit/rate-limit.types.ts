export enum RateLimitPolicy {
  READ = "read",
  MUTATION = "mutation",
}

export type RateLimitPolicyType = `${RateLimitPolicy}`;

export type RateLimitConfig = {
  windowMs: number;
  maxRequests: number;
};

export type RateLimitBucket = {
  count: number;
  expiresAt: number;
};

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
  retryAfterSeconds: number;
};

