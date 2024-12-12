import { PrismaUnburdenRepository } from "@/app/api/repositories/unburden/prisma-unburden.repository";
import { RegisterUnburdenService } from "../register-unburden.service";

export function makeRegisterUnburdenService() {
  const unburdenRepository = new PrismaUnburdenRepository();
  const usecase = new RegisterUnburdenService(unburdenRepository);

  return usecase;
}
