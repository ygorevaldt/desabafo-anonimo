import { PrismaUnburdenRepository } from "@/app/api/repositories/unburden/prisma-unburden.repository";
import { RegisterUnburdenUseCase } from "../register-unburden.usecase";

export function makeRegisterUnburdenUseCase() {
  const unburdenRepository = new PrismaUnburdenRepository();
  const usecase = new RegisterUnburdenUseCase(unburdenRepository);

  return usecase;
}
