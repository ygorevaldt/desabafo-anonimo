import { Prisma, Comment } from "@prisma/client";

export interface ICommentRepository {
  create(data: Prisma.CommentUncheckedCreateInput): Promise<Comment>;
  findMany(unburdenId: string, subcomments?: boolean): Promise<Comment[]>;
  findUnique(commentId: string, subcomments?: boolean): Promise<Comment | null>;
}
