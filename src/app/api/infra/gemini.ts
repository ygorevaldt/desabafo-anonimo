import { GoogleGenerativeAI } from "@google/generative-ai";

import { IaProvider } from "./ia-provider.interface";

export class Gemini implements IaProvider {
  private generativeAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  private generativeModel = this.generativeAi.getGenerativeModel({
    model: process.env.GEMINI_LANGUAGE_MODEL!,
  });

  async generateResponse(prompt: string): Promise<string> {
    const { response } = await this.generativeModel.generateContent(prompt);
    return response.text();
  }
}
