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
    const prompt = `Por favor, gere uma mensagem de apoio para um usuário que enviou o seguinte desabafo:\n"${userMessage}".\nA mensagem deve ser empática, encorajadora e mostrar compreensão. Use um tom amigável e acolhedor.`;

    const supportMessage = await this.iaProvider.generateResponse(userMessage);
    return { supportMessage };
  }
}
