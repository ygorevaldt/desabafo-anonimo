import { Unburden } from "@prisma/client";
import { IUseCase } from "./use-case.interface";
import { IUnburdenRepository } from "../repositories/unburden/unburden-repository.interface";

import { gemini } from "@/app/api/infra/gemini";

type Input = {
  description: string;
};

type Output = {
  unburden: Unburden;
};

export class RegisterUnburdenUseCase implements IUseCase<Input, Output> {
  constructor(private unburdenRepository: IUnburdenRepository) {}

  async execute(data: Input): Promise<Output> {
    const promptStartToGenerateUnburdenTitle =
      "Por favor, responda com apenas um único título para este desabafo: ";

    const unburdenTitle = await gemini.generateResponse(
      `${promptStartToGenerateUnburdenTitle} ${data.description}`,
    );

    const unburden = await this.unburdenRepository.create({
      ...data,
      title: unburdenTitle,
    });

    return { unburden };
  }
}
