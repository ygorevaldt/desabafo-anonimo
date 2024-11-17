import { PrismaVentRepository } from "@/app/api/repositories/vent/prisma-vent.repository";
import { RegisterVentUseCase } from "../register-vent.usecase";

export function makeRegisterVentUseCase() {
  const ventRepository = new PrismaVentRepository();
  const usecase = new RegisterVentUseCase(ventRepository);

  return usecase;
}
