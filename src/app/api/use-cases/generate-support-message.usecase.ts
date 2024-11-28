import { IaProvider } from "../infra/ia-provider.interface";
import { IUseCase } from "./use-case.interface";

type Input = {
  userMessage: string;
};

type Output = {
  supportMessage: string;
};

export class GenerateSupportMessageUseCase implements IUseCase<Input, Output> {
  constructor(private iaProvider: IaProvider) {}

  async execute({ userMessage }: Input): Promise<Output> {
    const supportMessage = await this.iaProvider.generateResponse(userMessage);
    return { supportMessage };
  }
}
