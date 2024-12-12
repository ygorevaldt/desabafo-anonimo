import { Support } from "@prisma/client";
import { ISupportRepository } from "../repositories/support/support-repository.interface";
import { IService } from "./service.interface";

type Input = {
  unburdenId: string;
  sessionId: string;
};

type Output = {
  support: Support;
};

export class RegisterSupportService implements IService<Input, Output> {
  constructor(private supportRepository: ISupportRepository) {}

  async execute(data: Input): Promise<Output> {
    const support = await this.supportRepository.create(data);
    return { support };
  }
}
