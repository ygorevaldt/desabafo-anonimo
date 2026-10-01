import { database } from "@/app/api/infra/database";
import { rateLimiter } from "@/app/api/gateway/rate-limit/rate-limiter";
import { circuitBreakerRegistry } from "@/app/api/gateway/circuit-breaker/circuit-breaker-registry";

export async function cleanDatabase() {
  await database.support.deleteMany();
  await database.comment.deleteMany();
  await database.unburden.deleteMany();
  rateLimiter.reset();
  circuitBreakerRegistry.clear();
}
