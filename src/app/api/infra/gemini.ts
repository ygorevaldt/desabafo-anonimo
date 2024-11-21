import { GoogleGenerativeAI } from "@google/generative-ai";

const googleGenerativeAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const googleGenerativeModel = googleGenerativeAi.getGenerativeModel({
  model: process.env.GEMINI_LANGUAGE_MODEL!,
});

export const gemini = {
  async generateResponse(prompt: string) {
    const { response } = await googleGenerativeModel.generateContent(prompt);
    return response.text();
  },
};
