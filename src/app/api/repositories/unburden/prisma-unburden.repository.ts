import { Prisma, Unburden } from "@prisma/client";
import {
  IUnburdenRepository,
  UnburdenWithSupports,
} from "./unburden-repository.interface";

import { database } from "@/app/api/infra/database";

export class PrismaUnburdenRepository implements IUnburdenRepository {
  async create(
    data: Prisma.UnburdenCreateInput,
  ): Promise<UnburdenWithSupports> {
    const unburden = await database.unburden.create({ data });
    return { ...unburden, suportsAmount: 0 };
  }

  async findMany(): Promise<UnburdenWithSupports[]> {
    const unburdens = await database.unburden.findMany({
      include: {
        _count: {
          select: { supports: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return unburdens.map((unburden) => {
      return { ...unburden, suportsAmount: unburden._count.supports };
    });
  }
}
