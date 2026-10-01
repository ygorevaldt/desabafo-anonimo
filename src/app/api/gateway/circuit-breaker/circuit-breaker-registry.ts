import CircuitBreaker from "opossum";
import { CircuitBreakerConfig } from "./circuit-breaker.types";

export const DEFAULT_CIRCUIT_BREAKER_CONFIG: Required<CircuitBreakerConfig> = {
  timeout: 5000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000,
  volumeThreshold: 5,
  rollingCountTimeout: 10000,
};

async function executeAction<T>(action: () => Promise<T>): Promise<T> {
  return await action();
}

export class CircuitBreakerRegistry {
  private readonly breakers = new Map<
    string,
    CircuitBreaker<[() => Promise<unknown>], unknown>
  >();

  public get(
    domain: string,
    customOptions?: CircuitBreakerConfig,
  ): CircuitBreaker<[() => Promise<unknown>], unknown> {
    const existing = this.breakers.get(domain);
    if (existing && !customOptions) {
      return existing;
    }

    if (existing) {
      existing.shutdown();
      this.breakers.delete(domain);
    }

    const options: CircuitBreaker.Options = {
      ...DEFAULT_CIRCUIT_BREAKER_CONFIG,
      ...customOptions,
    };

    const breaker = new CircuitBreaker(executeAction, options);
    this.breakers.set(domain, breaker);
    return breaker;
  }

  public async execute<T>(
    domain: string,
    action: () => Promise<T>,
    customOptions?: CircuitBreakerConfig,
  ): Promise<T> {
    const breaker = this.get(domain, customOptions);
    return (await breaker.fire(action)) as T;
  }

  public clear(): void {
    for (const breaker of this.breakers.values()) {
      breaker.shutdown();
    }
    this.breakers.clear();
  }
}

export const circuitBreakerRegistry = new CircuitBreakerRegistry();

