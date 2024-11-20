import { Prisma, Unburden } from "@prisma/client";
import { IUnburdenRepository } from "./unburden-repository.interface";

import { database } from "@/app/api/infra/database";

export class PrismaUnburdenRepository implements IUnburdenRepository {
  async create(data: Prisma.UnburdenCreateInput): Promise<Unburden> {
    const unburden = await database.unburden.create({ data });
    return unburden;
  }

  async findMany(): Promise<Unburden[]> {
    const unburdens = await database.unburden.findMany();
    return unburdens;
  }
}
