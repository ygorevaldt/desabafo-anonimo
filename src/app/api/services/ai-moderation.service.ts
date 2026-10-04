import { GoogleGenAI } from "@google/genai";
import { checkContentTemperature } from "../utils/check-content-temperature.util";
import { generateContentHash } from "../utils/generate-content-hash.util";
import {
  moderationCache,
  ModerationCacheService,
} from "./cache/moderation-cache.service";
import {
  moderationVerdictSchema,
  ModerationVerdictOutput,
} from "./schemas/moderation-verdict.schema";

export type ModerationResult = ModerationVerdictOutput;

export class AiModerationService {
  private ai: GoogleGenAI | null = null;
  private modelName: string;
  private cache: ModerationCacheService<ModerationResult>;

  constructor(cache?: ModerationCacheService<ModerationResult>) {
    const apiKey =
      process.env.NODE_ENV === "test" ? undefined : process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    }
    this.modelName = process.env.GEMINI_MODEL || "gemini-3.8-flash";
    this.cache = cache ?? moderationCache;
  }

  async moderate(text: string, title?: string): Promise<ModerationResult> {
    const hash = generateContentHash(text, title);
    const cached = this.cache.get(hash);
    if (cached) {
      return cached;
    }

    let verdict: ModerationResult;

    if (!this.ai) {
      verdict = this.fallbackModeration(text, title);
      this.cache.set(hash, verdict);
      return verdict;
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
   - Desabafos comuns, angústias cotidianas, término de relacionamento, tristeza, solidão, problemas no trabalho, estresse.`;

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
          responseSchema: {
            type: "OBJECT",
            properties: {
              status: {
                type: "STRING",
                enum: ["APPROVED", "SENSITIVE", "BLOCKED"],
              },
              category: {
                type: "STRING",
                enum: [
                  "safe",
                  "self_harm_distress",
                  "apology_violence",
                  "sexual_violence",
                  "hate_speech",
                  "illegal",
                ],
              },
              isSensitive: {
                type: "BOOLEAN",
              },
              reason: {
                type: "STRING",
              },
            },
            required: ["status", "category", "isSensitive"],
          },
          temperature: 0.1,
        },
      });

      const responseText = response.text?.trim() || "{}";
      const parsedJson = JSON.parse(responseText);
      const validated = moderationVerdictSchema.parse(parsedJson);

      verdict = {
        status: validated.status,
        category: validated.category,
        isSensitive: validated.status === "SENSITIVE" || validated.isSensitive,
        reason: validated.reason,
      };
    } catch {
      verdict = this.fallbackModeration(text, title);
    }

    this.cache.set(hash, verdict);
    return verdict;
  }

  private fallbackModeration(text: string, title?: string): ModerationResult {
    const fullText = title ? `${title} ${text}` : text;
    const lowerText = fullText.toLowerCase();
    const temperature = checkContentTemperature(fullText);

    const severeTerms = [
      "estupro",
      "estuprar",
      "massacre",
      "pedofilia",
      "assassinato",
      "tortura",
      "nazismo",
      "espancar",
    ];

    const hasSevereTerm = severeTerms.some((term) => lowerText.includes(term));
    const isRed = temperature === "red" || hasSevereTerm;

    if (isRed) {
      return {
        status: "BLOCKED",
        category: "apology_violence",
        isSensitive: true,
        reason:
          "Conteúdo contém termos proibidos pelas regras da comunidade.",
      };
    }

    const isSensitiveTopic =
      temperature === "yellow" ||
      lowerText.includes("luto") ||
      lowerText.includes("depressão") ||
      lowerText.includes("depressao") ||
      lowerText.includes("suicídio") ||
      lowerText.includes("suicidio") ||
      lowerText.includes("automutilação") ||
      lowerText.includes("automutilacao") ||
      lowerText.includes("trauma") ||
      lowerText.includes("abuso");

    if (isSensitiveTopic) {
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
