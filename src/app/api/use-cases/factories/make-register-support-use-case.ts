import { PrismaSupportRepository } from "@/app/api/repositories/support/prisma-support.repository";
import { RegisterSupportUseCase } from "../register-support.usecase";

export function makeRegisterSupportUseCase() {
  const supportRepository = new PrismaSupportRepository();
  const usecase = new RegisterSupportUseCase(supportRepository);

  return usecase;
}
