import { describe, expect, it } from "vitest";

import { CalculatorService } from "@/services";

describe("calculator", () => {
  const calculator = new CalculatorService();

  it("should return the sum from two numbers", () => {
    const result = calculator.sum(1, 1);
    expect(result).toBe(2);
  });
});
