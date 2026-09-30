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

    let unburdenId = registredComment.unburdenId;
    let current = registredComment;
    while (!unburdenId && current.subcommentId) {
      const parent = await this.commentRepository.findUnique(current.subcommentId);
      if (!parent) break;
      if (parent.unburdenId) {
        unburdenId = parent.unburdenId;
        break;
      }
      current = parent;
    }

    const subcomment = await this.commentRepository.create({
      unburdenId: unburdenId ?? undefined,
      subcommentId: commentId,
      content,
      sensitiveContent: moderation.isSensitive,
    });

    return { subcomment };
  }
}
