import { createHash } from "node:crypto";

export function normalizeContentText(text: string): string {
  return text.trim().replace(/\s+/g, " ").toLowerCase();
}

export function generateContentHash(content: string, title?: string): string {
  const normalizedTitle = title ? normalizeContentText(title) : "";
  const normalizedContent = normalizeContentText(content);
  const compositeText = normalizedTitle
    ? `${normalizedTitle}:::${normalizedContent}`
    : normalizedContent;

  return createHash("sha256").update(compositeText).digest("hex");
}
