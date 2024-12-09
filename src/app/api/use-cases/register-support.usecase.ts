import { Support } from "@prisma/client";
import { ISupportRepository } from "../repositories/support/support-repository.interface";
import { IUseCase } from "./use-case.interface";

type Input = {
  unburdenId: string;
  sessionId: string;
};

type Output = {
  support: Support;
};

export class RegisterSupportUseCase implements IUseCase<Input, Output> {
  constructor(private supportRepository: ISupportRepository) {}

  async execute(data: Input): Promise<Output> {
    const support = await this.supportRepository.create(data);
    return { support };
  }
}
