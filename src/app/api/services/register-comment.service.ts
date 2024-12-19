import { Comment } from "@prisma/client";
import { IService } from "./service.interface";
import { ICommentRepository } from "../repositories/comment/comment-repository.interface";

type Input = {
  unburdenId: string;
  content: string;
};

type Output = {
  comment: Comment;
};

export class RegisterCommentService implements IService<Input, Output> {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(data: Input): Promise<Output> {
    const comment = await this.commentRepository.create(data);
    console.log("comment", comment);
    return { comment };
  }
}
