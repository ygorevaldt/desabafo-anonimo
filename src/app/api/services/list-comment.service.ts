import { IService } from "./service.interface";
import {
  CommentWithSubcomments,
  ICommentRepository,
} from "../repositories/comment/comment-repository.interface";

type Input = {
  unburdenId: string;
};

type Output = {
  comments: CommentWithSubcomments[];
};

export class ListCommentService implements IService<Input, Output> {
  constructor(private commentRepository: ICommentRepository) {}

  async execute({ unburdenId }: Input): Promise<Output> {
    const comments = await this.commentRepository.findMany(unburdenId, true);
    return { comments };
  }
}
