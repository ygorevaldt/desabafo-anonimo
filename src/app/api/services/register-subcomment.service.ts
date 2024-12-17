import { Comment } from "@prisma/client";
import { IService } from "./service.interface";
import { ICommentRepository } from "../repositories/comment/comment-repository.interface";
import { RegisterNotFoundException } from "./exceptions";

type Input = {
  commentId: string;
  content: string;
};

type Output = {
  subcomment: Comment;
};

export class RegisterSubcommentService implements IService<Input, Output> {
  constructor(private commentRepository: ICommentRepository) {}

  async execute({ commentId, content }: Input): Promise<Output> {
    const registredComment = await this.commentRepository.findUnique(commentId);
    if (registredComment === null) throw new RegisterNotFoundException();

    const subcomment = await this.commentRepository.create({
      subcommentId: commentId,
      content,
    });
    return { subcomment };
  }
}
