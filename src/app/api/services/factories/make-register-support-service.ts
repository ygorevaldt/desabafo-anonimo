import { PrismaSupportRepository } from "@/app/api/repositories/support/prisma-support.repository";
import { RegisterSupportService } from "../register-support.service";

export function makeRegisterSupportService() {
  const supportRepository = new PrismaSupportRepository();
  const service = new RegisterSupportService(supportRepository);

  return service;
}
