import { Prisma, Unburden } from "@prisma/client";
import {
  FindManyParams,
  IUnburdenRepository,
  UnburdenWithSupports,
} from "./unburden-repository.interface";

import { database } from "@/app/api/infra/database";

export class PrismaUnburdenRepository implements IUnburdenRepository {
  async create(
    data: Prisma.UnburdenCreateInput,
  ): Promise<UnburdenWithSupports> {
    const unburden = await database.unburden.create({ data });
    return { ...unburden, suportsAmount: 0, supported: false };
  }

  async findMany({
    page,
    take,
    sessionId,
  }: FindManyParams): Promise<UnburdenWithSupports[]> {
    const skip = page === 0 ? page * take : (page - 1) * take;

    const unburdens = await database.unburden.findMany({
      skip,
      take,
      include: {
        supports: {
          where: {
            sessionId,
          },
        },
        _count: {
          select: { supports: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return unburdens.map((unburden) => {
      return {
        ...unburden,
        suportsAmount: unburden._count.supports,
        supported: unburden.supports.length > 0,
      };
    });
  }

  async findUnique(id: string): Promise<Unburden | null> {
    const unburden = await database.unburden.findUnique({
      where: { id },
    });

    return unburden;
  }

  async total(): Promise<number> {
    const total = await database.unburden.count();
    return total;
  }
}
