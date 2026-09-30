import { Comment, Prisma } from "@prisma/client";

import { database } from "@/app/api/infra/database";
import {
  CommentWithSubcomments,
  ICommentRepository,
} from "./comment-repository.interface";

import { pinAiCommentFirst } from "@/constants/ai-comfort.constant";

export class PrismaCommentRepository implements ICommentRepository {
  async create(data: Prisma.CommentUncheckedCreateInput): Promise<Comment> {
    const comment = await database.comment.create({ data });
    return comment;
  }

  async findMany(
    unburdenId: string,
    subcomments: boolean = true,
  ): Promise<CommentWithSubcomments[]> {
    const comments = await database.comment.findMany({
      where: {
        subcommentId: null,
        unburdenId,
        sensitiveContent: false,
      },
      include: {
        subcomments: subcomments
          ? {
              where: {
                sensitiveContent: false,
              },
              orderBy: {
                createdAt: "desc",
              },
            }
          : false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return pinAiCommentFirst(comments) as CommentWithSubcomments[];
  }

  async findUnique(
    commentId: string,
    subcomments?: boolean,
  ): Promise<CommentWithSubcomments | null> {
    const comment = await database.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        subcomments: subcomments
          ? {
              where: {
                sensitiveContent: false,
              },
              orderBy: {
                createdAt: "desc",
              },
            }
          : false,
      },
    });

    return comment as CommentWithSubcomments | null;
  }
}
