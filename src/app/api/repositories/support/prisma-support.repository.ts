import { Prisma, Support } from "@prisma/client";

import { database } from "@/app/api/infra/database";
import { ISupportRepository } from "./support-repository.interface";

export class PrismaSupportRepository implements ISupportRepository {
  async create(data: Prisma.SupportUncheckedCreateInput): Promise<Support> {
    const support = await database.support.create({ data });
    return support;
  }
}
