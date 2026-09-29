import { GoogleGenAI } from "@google/genai";
import { checkContentTemperature } from "../utils/check-content-temperature.util";

export type ModerationResult = {
  status: "APPROVED" | "SENSITIVE" | "BLOCKED";
  category:
    | "safe"
    | "self_harm_distress"
    | "apology_violence"
    | "sexual_violence"
    | "hate_speech"
    | "illegal";
  isSensitive: boolean;
  reason?: string;
};

export class AiModerationService {
  private ai: GoogleGenAI | null = null;
  private modelName: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    }
    this.modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  }

  async moderate(text: string, title?: string): Promise<ModerationResult> {
    if (!this.ai) {
      return this.fallbackModeration(text);
    }

    try {
      const fullText = title ? `Título: ${title}\nConteúdo: ${text}` : text;

      const systemPrompt = `Você é o sistema de moderação de uma plataforma anônima de apoio emocional e desabafos ("Desabafo Anônimo").
Sua missão é manter o espaço seguro, acolhedor e livre de abusos graves, respeitando o espaço de desabafo de pessoas sofrendo.

DIRETRIZES DE MODERAÇÃO:
1. "BLOCKED" (Bloqueio total / Crime / Apologia / Ameaça):
   - Apologia ou incentivo a estupro, assédio sexual ou pedofilia.
   - Apologia ao crime organizado, assassinatos, homicídios, massacres, ou tortura.
   - Ameaças reais e direcionadas contra pessoas ou grupos.
   - Discurso de ódio, racismo, homofobia, transfobia, intolerância explícita.
   - Incentivo direto a outros usuários se matarem ou se machucarem ("vá se matar").

2. "SENSITIVE" (Permitido, mas com aviso de conteúdo sensível / gatilho):
   - Desabafos de sofrimento pessoal profundo, automutilação em primeira pessoa, ideação suicida em primeira pessoa (a pessoa desabafando sua própria dor e angústia).
   - Relatos de traumas passados, abuso sofrido (vítima contando sua história em busca de apoio).
   - Temas delicados como luto severo, depressão profunda, crises existenciais.
   * IMPORTANTE: A plataforma existe para acolher essas pessoas; portanto, NÃO bloqueie a pessoa que sofre, apenas marque como sensível para exibirmos avisos e canais de ajuda (como o CVV 188).

3. "APPROVED" (Livre para publicação):
   - Desabafos comuns, angústias cotidianas, término de relacionamento, tristeza, solidão, problemas no trabalho, estresse.

Responda OBRIGATORIAMENTE em formato JSON com o seguinte formato:
{
  "status": "APPROVED" | "SENSITIVE" | "BLOCKED",
  "category": "safe" | "self_harm_distress" | "apology_violence" | "sexual_violence" | "hate_speech" | "illegal",
  "isSensitive": boolean,
  "reason": "breve explicação em português"
}`;

      const response = await this.ai.models.generateContent({
        model: this.modelName,
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${systemPrompt}\n\nTexto a analisar:\n"""\n${fullText}\n"""`,
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      });

      const responseText = response.text?.trim() || "";
      const parsed = JSON.parse(responseText);

      return {
        status: parsed.status || "APPROVED",
        category: parsed.category || "safe",
        isSensitive:
          parsed.status === "SENSITIVE" || Boolean(parsed.isSensitive),
        reason: parsed.reason,
      };
    } catch (error) {
      console.warn(
        "Erro na moderação por IA, aplicando fallback heurístico:",
        error,
      );
      return this.fallbackModeration(text);
    }
  }

  private fallbackModeration(text: string): ModerationResult {
    const temperature = checkContentTemperature(text);

    if (temperature === "red") {
      return {
        status: "BLOCKED",
        category: "apology_violence",
        isSensitive: true,
        reason:
          "Conteúdo contém múltiplos termos proibidos pelas regras da comunidade.",
      };
    }

    if (temperature === "yellow") {
      return {
        status: "SENSITIVE",
        category: "self_harm_distress",
        isSensitive: true,
        reason: "Conteúdo identificado com temas sensíveis.",
      };
    }

    return {
      status: "APPROVED",
      category: "safe",
      isSensitive: false,
    };
  }
}
