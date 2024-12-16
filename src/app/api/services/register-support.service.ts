import { Support } from "@prisma/client";
import { ISupportRepository } from "../repositories/support/support-repository.interface";
import { IService } from "./service.interface";
import { IUnburdenRepository } from "../repositories/unburden/unburden-repository.interface";
import {
  RegisterNotFoundException,
  InvalidSessionIdException,
} from "./exceptions";

type Input = {
  unburdenId: string | undefined;
  commentId: string | undefined;
  sessionId?: string;
};

type Output = {
  support: Support;
};

export class RegisterSupportService implements IService<Input, Output> {
  constructor(
    private unburdenRepository: IUnburdenRepository,
    private supportRepository: ISupportRepository,
  ) {}

  async execute({ unburdenId, commentId, sessionId }: Input): Promise<Output> {
    if (!sessionId) throw new InvalidSessionIdException();

    if (unburdenId) {
      const registredUnburden =
        await this.unburdenRepository.findUnique(unburdenId);
      if (registredUnburden === null) throw new RegisterNotFoundException();
    }

    if (commentId) {
      //confirma existencia do comentário
      // caso comentário não exista, lançar exception de registro não encontrado
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
