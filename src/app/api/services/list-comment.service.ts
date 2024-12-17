import { Comment } from "@prisma/client";
import { IService } from "./service.interface";
import { ICommentRepository } from "../repositories/comment/comment-repository.interface";

type Input = {
  unburdenId: string;
};

type Output = {
  comments: Comment[];
};

export class ListCommentService implements IService<Input, Output> {
  constructor(private commentRepository: ICommentRepository) {}

  async execute({ unburdenId }: Input): Promise<Output> {
    const comments = await this.commentRepository.findMany(unburdenId);
    return { comments };
  }
}
