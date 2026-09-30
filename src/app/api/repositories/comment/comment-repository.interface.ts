import { Prisma, Comment } from "@prisma/client";

export type CommentWithSubcomments = Comment & {
  subcomments?: Comment[];
};

export interface ICommentRepository {
  create(data: Prisma.CommentUncheckedCreateInput): Promise<Comment>;
  findMany(
    unburdenId: string,
    subcomments?: boolean,
  ): Promise<CommentWithSubcomments[]>;
  findUnique(
    commentId: string,
    subcomments?: boolean,
  ): Promise<CommentWithSubcomments | null>;
}
