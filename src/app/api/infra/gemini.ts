import { GoogleGenerativeAI } from "@google/generative-ai";

import { IaProvider } from "./ia-provider.interface";

const googleGenerativeAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const googleGenerativeModel = googleGenerativeAi.getGenerativeModel({
  model: process.env.GEMINI_LANGUAGE_MODEL!,
});

export class Gemini implements IaProvider {
  private generativeAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  private generativeModel = this.generativeAi.getGenerativeModel({
    model: process.env.GEMINI_LANGUAGE_MODEL!,
  });

  public async generateResponse(prompt: string): Promise<string> {
    const { response } = await this.generativeModel.generateContent(prompt);
    return response.text();
  }
}
