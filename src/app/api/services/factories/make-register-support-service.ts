import { PrismaSupportRepository } from "@/app/api/repositories/support/prisma-support.repository";
import { RegisterSupportService } from "../register-support.service";
import { PrismaUnburdenRepository } from "../../repositories/unburden/prisma-unburden.repository";

export function makeRegisterSupportService() {
  const unburdenRepository = new PrismaUnburdenRepository();
  const supportRepository = new PrismaSupportRepository();
  const service = new RegisterSupportService(
    unburdenRepository,
    supportRepository,
  );

  return service;
}
