import { Gemini } from "@/app/api/infra/gemini";
import { GenerateSupportMessageUseCase } from "../generate-support-message.usecase";
import { OpenIa } from "../../infra/open-ai";

export function makeGenerateSupportMessageUseCase() {
  // const openIa = new OpenIa();
  const gemini = new Gemini();
  const usecase = new GenerateSupportMessageUseCase(gemini);

  return usecase;
}
