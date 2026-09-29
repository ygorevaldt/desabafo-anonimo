import { Comment } from "@prisma/client";
import { IService } from "./service.interface";
import { ICommentRepository } from "../repositories/comment/comment-repository.interface";
import { RegisterNotFoundException } from "./exceptions";
import { AiModerationService } from "./ai-moderation.service";
import { UnauthorizedContentException } from "./exceptions/unauthorized-content.exception";

type Input = {
  commentId: string;
  content: string;
};

type Output = {
  subcomment: Comment;
};

export class RegisterSubcommentService implements IService<Input, Output> {
  private moderationService: AiModerationService;

  constructor(
    private commentRepository: ICommentRepository,
    moderationService?: AiModerationService,
  ) {
    this.moderationService = moderationService ?? new AiModerationService();
  }

  async execute({ commentId, content }: Input): Promise<Output> {
    const moderation = await this.moderationService.moderate(content);

    if (moderation.status === "BLOCKED") {
      throw new UnauthorizedContentException();
    }

    const registredComment = await this.commentRepository.findUnique(commentId);
    if (registredComment === null) throw new RegisterNotFoundException();

    const subcomment = await this.commentRepository.create({
      subcommentId: commentId,
      content,
      sensitiveContent: moderation.isSensitive,
    });

    return { subcomment };
  }
}
