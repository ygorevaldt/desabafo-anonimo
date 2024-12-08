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

  async findMany(page: number, take: number): Promise<UnburdenWithSupports[]> {
    const skip = page === 0 ? page * take : (page - 1) * take;

    const unburdens = await database.unburden.findMany({
      skip,
      take,
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

  async total(): Promise<number> {
    const total = await database.unburden.count();
    return total;
  }
}
