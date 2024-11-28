import OpenAI from "openai";
import { IaProvider } from "./ia-provider.interface";

export class OpenIa implements IaProvider {
  private openIa = new OpenAI({
    apiKey: process.env.OPENIA_API_KEY,
    organization: process.env.OPENIA_ORGANIZATION_ID,
    project: process.env.OPENIA_PROJECT_ID,
  });

  async generateResponse(prompt: string): Promise<string> {
    const completion = await this.openIa.chat.completions.create({
      model: process.env.OPENIA_LANGUAGE_MODEL!,
      messages: [
        { role: "system", content: "Você é um assistente amigável." },
        { role: "user", content: prompt },
      ],
      max_tokens: 150,
    });

    return completion.choices[0].message.content ?? "";
  }
}
