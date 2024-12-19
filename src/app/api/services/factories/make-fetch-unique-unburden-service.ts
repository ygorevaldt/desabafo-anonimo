import { PrismaUnburdenRepository } from "../../repositories/unburden/prisma-unburden.repository";
import { FetchUniqueUnburdenService } from "../fetch-unique-unburden.service";

export function makeFetchUniqueUnburdenService() {
  const unburdenRepository = new PrismaUnburdenRepository();
  const service = new FetchUniqueUnburdenService(unburdenRepository);

  return service;
}
