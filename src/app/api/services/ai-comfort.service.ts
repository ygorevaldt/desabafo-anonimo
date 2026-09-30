import { GoogleGenAI } from "@google/genai";

export class AiComfortService {
  private ai: GoogleGenAI | null = null;
  private modelName: string;

  constructor() {
    const apiKey =
      process.env.NODE_ENV === "test" ? undefined : process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    }
    this.modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  }

  async generateComfortMessage(
    title: string,
    content: string,
  ): Promise<string | null> {
    if (!this.ai) {
      return this.fallbackComfortMessage();
    }

    try {
      const prompt = `Você é um ouvinte compassivo e acolhedor do "Desabafo Anônimo", uma plataforma que oferece apoio emocional.
Um usuário anônimo acabou de postar o seguinte desabafo:
Título: "${title}"
Conteúdo: "${content}"

Sua tarefa:
Escreva uma mensagem de conforto e acolhimento humano para essa pessoa.
Diretrizes:
- Seja extremamente gentil, empático(a), caloroso(a) e acolhedor(a).
- Valide os sentimentos da pessoa sem julgamentos e sem clichês vazios ("vai passar logo", "pense positivo").
- Deixe claro de forma carinhosa que você é uma inteligência artificial acolhedora inicial para que a pessoa não fique no vácuo enquanto outros membros da comunidade leem o desabafo dela.
- Não aja como psiquiatra nem faça diagnósticos clínicos.
- Se o desabafo demonstrar ideação suicida ou sofrimento extremo, lembre carinhosamente que o CVV (Centro de Valorização da Vida) está disponível 24h gratuitamente pelo telefone 188 ou pelo chat no site cvv.org.br.
- Mantenha o texto em tamanho equilibrado, conciso e acolhedor (1 a 2 parágrafos curtos, entre 350 e 600 caracteres).
- REQUISITO OBRIGATÓRIO: A mensagem DEVE ser gerada 100% completa, com início, meio e fim harmoniosos, terminando impreterivelmente com pontuação final (. ou !). Jamais deixe uma frase inacabada ou truncada.`;

      const response = await this.ai.models.generateContent({
        model: this.modelName,
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        config: {
          temperature: 0.7,
          maxOutputTokens: 1500,
        },
      });

      let text = response.text?.trim();
      if (!text || text.length < 50) {
        return this.fallbackComfortMessage();
      }

      const validEndings = [".", "!", "?", "”", '"'];
      const lastChar = text.slice(-1);
      if (!validEndings.includes(lastChar)) {
        const lastPunctuation = Math.max(
          text.lastIndexOf("."),
          text.lastIndexOf("!"),
          text.lastIndexOf("?"),
        );
        if (lastPunctuation > 150) {
          text = text.substring(0, lastPunctuation + 1);
        } else {
          text = `${text}.`;
        }
      }

      return text;
    } catch (error) {
      console.warn("Erro ao gerar mensagem de conforto com IA:", error);
      return this.fallbackComfortMessage();
    }
  }

  private fallbackComfortMessage(): string {
    return (
      "Olá! Quero que saiba que suas palavras foram ouvidas com muito carinho e respeito. " +
      "Às vezes, colocar para fora o que sentimos é um passo difícil, mas muito corajoso. " +
      "Você não está sozinho(a) nessa jornada. Enquanto outras pessoas da comunidade leem e se conectam com o seu desabafo, " +
      "respire fundo e lembre-se de ser gentil consigo mesmo(a). Se precisar de apoio imediato e confidencial a qualquer momento, " +
      "o CVV oferece escuta amiga 24h pelo número 188."
    );
  }
}
