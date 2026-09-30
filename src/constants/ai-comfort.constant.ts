export const AI_COMFORT_TAG = "[Acolhimento Inicial - IA]";
export const AI_COMFORT_PREFIX = `🤖 ${AI_COMFORT_TAG}\n`;

export function isAiComfortComment(content: string): boolean {
  return content.includes(AI_COMFORT_TAG);
}

export function cleanAiComfortContent(content: string): string {
  return content.replace(/🤖\s*\[Acolhimento Inicial - IA\]\s*/g, "").trim();
}

export function pinAiCommentFirst<T extends { content: string }>(
  items: T[],
): T[] {
  const result = [...items];
  const aiIndex = result.findIndex((item) => isAiComfortComment(item.content));
  if (aiIndex > 0) {
    const [aiComment] = result.splice(aiIndex, 1);
    result.unshift(aiComment);
  }
  return result;
}
