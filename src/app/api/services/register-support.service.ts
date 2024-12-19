import { Support } from "@prisma/client";
import { ISupportRepository } from "../repositories/support/support-repository.interface";
import { IService } from "./service.interface";
import { IUnburdenRepository } from "../repositories/unburden/unburden-repository.interface";
import {
  RegisterNotFoundException,
  InvalidSessionIdException,
} from "./exceptions";
import { ICommentRepository } from "../repositories/comment/comment-repository.interface";

type Input = {
  unburdenId?: string;
  commentId?: string;
  sessionId?: string;
};

type Output = {
  support: Support;
};

export class RegisterSupportService implements IService<Input, Output> {
  constructor(
    private unburdenRepository: IUnburdenRepository,
    private supportRepository: ISupportRepository,
    private commentRepository: ICommentRepository,
  ) {}

  async execute({ unburdenId, commentId, sessionId }: Input): Promise<Output> {
    if (!sessionId) throw new InvalidSessionIdException();
    if (!unburdenId && !commentId) throw new Error("Requisição não permitida");

    if (unburdenId) {
      const registredUnburden = await this.unburdenRepository.findUnique({
        id: unburdenId,
        sessionId,
      });

      if (registredUnburden === null) throw new RegisterNotFoundException();
    }

    if (commentId) {
      const registredComment =
        await this.commentRepository.findUnique(commentId);

      if (registredComment === null) throw new RegisterNotFoundException();
    }

    const data = {
      unburdenId: unburdenId ?? null,
      commentId: commentId ?? null,
      sessionId,
    };
    const support = await this.supportRepository.create(data);
    return { support };
  }
}
