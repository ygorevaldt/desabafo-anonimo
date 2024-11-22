import { PrismaUnburdenRepository } from "@/app/api/repositories/unburden/prisma-unburden.repository";
import { ListUnburdensUseCase } from "../list-unburdens.usecase";

export function makeListUnburdensUseCase() {
  const unburdenRepository = new PrismaUnburdenRepository();
  const usecase = new ListUnburdensUseCase(unburdenRepository);

  return usecase;
}
