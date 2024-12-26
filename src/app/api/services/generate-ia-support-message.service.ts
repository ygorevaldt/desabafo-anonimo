import { IaProvider } from "../infra/ia-provider.interface";
import { IService } from "./service.interface";

type Input = {
  userMessage: string;
};

type Output = {
  iaSupportMessage: string;
};

export class GenerateIaSupportMessageService
  implements IService<Input, Output>
{
  constructor(private iaProvider: IaProvider) {}

  async execute({ userMessage }: Input): Promise<Output> {
    const supportMessage = await this.iaProvider.generateResponse(userMessage);
    const formattedSupportMessage = supportMessage
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Negrito
      .replace(/\*(.*?)\*/g, "<li>$1</li>") // Lista
      .replace(/\n\n/g, "</p><p>") // Parágrafo
      .replace(/\n/g, "<br>") // Quebra de linha
      .replace(/^/, "<p>") // Início do parágrafo
      .replace(/$/, "</p>"); // Fim do parágrafo

    return { iaSupportMessage: formattedSupportMessage };
  }
}
