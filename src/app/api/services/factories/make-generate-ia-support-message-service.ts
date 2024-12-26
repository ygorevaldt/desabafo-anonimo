import { Gemini } from "@/app/api/infra/gemini";
import { GenerateIaSupportMessageService } from "../generate-ia-support-message.service";

export function makeGenerateIaSupportMessageService() {
  const gemini = new Gemini();
  const service = new GenerateIaSupportMessageService(gemini);
  return service;
}
