import { Prisma } from "@prisma/client";
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

  private async healOrphanSubcomments(): Promise<void> {
    try {
      await database.$executeRaw`
        WITH RECURSIVE CommentHierarchy AS (
          SELECT id, "id_desabafo"
          FROM "comentario"
          WHERE "id_desabafo" IS NOT NULL
          UNION ALL
          SELECT c.id, ch."id_desabafo"
          FROM "comentario" c
          JOIN CommentHierarchy ch ON c."id_subcomentario" = ch.id
          WHERE c."id_desabafo" IS NULL
        )
        UPDATE "comentario"
        SET "id_desabafo" = ch."id_desabafo"
        FROM CommentHierarchy ch
        WHERE "comentario".id = ch.id
          AND "comentario"."id_desabafo" IS NULL;
      `;
    } catch {}
  }

  async findMany({
    page,
    take,
    sessionId,
  }: FindManyParams): Promise<UnburdenOutput[]> {
    await this.healOrphanSubcomments();
    const skip = page === 0 ? page * take : (page - 1) * take;

    const unburdens = await database.unburden.findMany({
      skip,
      take,
      where: {
        deletedAt: null,
      },
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
    await this.healOrphanSubcomments();
    const unburden = await database.unburden.findUnique({
      where: {
        id,
        deletedAt: null,
      },
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
    const total = await database.unburden.count({
      where: {
        deletedAt: null,
      },
    });
    return total;
  }

  async softDelete(id: string): Promise<void> {
    await database.unburden.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
