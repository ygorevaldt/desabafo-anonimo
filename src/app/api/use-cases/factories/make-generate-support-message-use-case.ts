import { Gemini } from "@/app/api/infra/gemini";
import { GenerateSupportMessageUseCase } from "../generate-support-message.usecase";
import { OpenIa } from "../../infra/open-ai";

export function makeGenerateSupportMessageUseCase() {
  // const gemini = new Gemini();
  const openIa = new OpenIa();
  const usecase = new GenerateSupportMessageUseCase(openIa);

  return usecase;
}
