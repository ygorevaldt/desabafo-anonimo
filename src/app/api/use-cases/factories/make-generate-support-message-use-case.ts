import { Gemini } from "@/app/api/infra/gemini";
import { GenerateSupportMessageUseCase } from "../generate-support-message.usecase";

export function makeGenerateSupportMessageUseCase() {
  const gemini = new Gemini();
  const usecase = new GenerateSupportMessageUseCase(gemini);

  return usecase;
}
