import { Comment } from "@prisma/client";
import { IService } from "./service.interface";
import { ICommentRepository } from "../repositories/comment/comment-repository.interface";
import { checkContentTemperature, checkSensitiveContent } from "../utils/";
import { UnauthorizedContentException } from "./exceptions/unauthorized-content.exception";

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
    const contentTemperature = checkContentTemperature(data.content);
    console.log("TEMPERATURE", contentTemperature);
    if (contentTemperature === "red") throw new UnauthorizedContentException();

    const comment = await this.commentRepository.create({
      ...data,
      sensitiveContent: checkSensitiveContent(data.content),
    });
    return { comment };
  }
}
