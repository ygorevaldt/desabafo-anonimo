import { Comment, Prisma, Support } from "@prisma/client";

import { database } from "@/app/api/infra/database";
import { ICommentRepository } from "./comment-repository.interface";

export class PrismaCommentRepository implements ICommentRepository {
  async create(data: Prisma.CommentUncheckedCreateInput): Promise<Comment> {
    const comment = await database.comment.create({ data });
    return comment;
  }

  async findMany(
    unburdenId: string,
    subcomments?: boolean,
  ): Promise<Comment[]> {
    const comments = await database.comment.findMany({
      where: {
        subcommentId: null,
        unburdenId,
      },
      include: {
        subcomments,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return comments;
  }

  async findUnique(
    commentId: string,
    subcomments?: boolean,
  ): Promise<Comment | null> {
    const comment = await database.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        subcomments,
      },
    });

    return comment;
  }
}
