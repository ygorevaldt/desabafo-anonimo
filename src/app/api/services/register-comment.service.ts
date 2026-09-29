import { Comment } from "@prisma/client";
import { IService } from "./service.interface";
import { ICommentRepository } from "../repositories/comment/comment-repository.interface";
import { AiModerationService } from "./ai-moderation.service";
import { UnauthorizedContentException } from "./exceptions/unauthorized-content.exception";

type Input = {
  unburdenId: string;
  content: string;
};

type Output = {
  comment: Comment;
};

export class RegisterCommentService implements IService<Input, Output> {
  private moderationService: AiModerationService;

  constructor(
    private commentRepository: ICommentRepository,
    moderationService?: AiModerationService
  ) {
    this.moderationService = moderationService ?? new AiModerationService();
  }

  async execute(data: Input): Promise<Output> {
    const moderation = await this.moderationService.moderate(data.content);

    if (moderation.status === "BLOCKED") {
      throw new UnauthorizedContentException();
    }

    const comment = await this.commentRepository.create({
      ...data,
      sensitiveContent: moderation.isSensitive,
    });

    return { comment };
  }
}
