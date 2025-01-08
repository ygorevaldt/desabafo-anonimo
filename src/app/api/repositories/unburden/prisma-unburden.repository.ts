import { Prisma, Unburden } from "@prisma/client";
import {
  FindManyParams,
  FindUniqueParams,
  IUnburdenRepository,
  UnburdenOutput,
} from "./unburden-repository.interface";

import { database } from "@/app/api/infra/database";

export class PrismaUnburdenRepository implements IUnburdenRepository {
  async create(data: Prisma.UnburdenCreateInput): Promise<UnburdenOutput> {
    const unburden = await database.unburden.create({ data });
    return {
      ...unburden,
      suportsAmount: 0,
      supported: false,
      commentsAmount: 0,
    };
  }

  async findMany({
    page,
    take,
    sessionId,
  }: FindManyParams): Promise<UnburdenOutput[]> {
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
          select: {
            supports: true,
            comments: {
              where: {
                sensitiveContent: false,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return unburdens.map((unburden) => {
      return {
        ...unburden,
        commentsAmount: unburden._count.comments,
        suportsAmount: unburden._count.supports,
        supported: unburden.supports.length > 0,
      };
    });
  }

  async findUnique({
    id,
    sessionId,
  }: FindUniqueParams): Promise<UnburdenOutput | null> {
    const unburden = await database.unburden.findUnique({
      where: { id },
      include: {
        supports: {
          where: {
            sessionId,
          },
        },
        _count: {
          select: {
            supports: true,
            comments: {
              where: {
                sensitiveContent: false,
              },
            },
          },
        },
      },
    });

    if (unburden === null) return null;

    return {
      ...unburden,
      commentsAmount: unburden._count.comments,
      suportsAmount: unburden._count.supports,
      supported: unburden.supports.length > 0,
    };
  }

  async total(): Promise<number> {
    const total = await database.unburden.count();
    return total;
  }
}
