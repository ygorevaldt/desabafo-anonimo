import { PrismaUnburdenRepository } from "@/app/api/repositories/unburden/prisma-unburden.repository";
import { ListUnburdensService } from "../list-unburdens.service";

export function makeListUnburdensService() {
  const unburdenRepository = new PrismaUnburdenRepository();
  const service = new ListUnburdensService(unburdenRepository);

  return service;
}
