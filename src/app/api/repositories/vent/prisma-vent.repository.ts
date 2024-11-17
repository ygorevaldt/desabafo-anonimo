import { Prisma, Vent } from "@prisma/client";
import { IVentRepository } from "./vent-repository.interface";

import { database } from "@/app/api/infra/database";

export class PrismaVentRepository implements IVentRepository {
  async create(data: Prisma.VentCreateInput): Promise<Vent> {
    const vent = await database.vent.create({ data });
    return vent;
  }
}
