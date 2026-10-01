import { z } from "zod";

export const moderationVerdictSchema = z.object({
  status: z.enum(["APPROVED", "SENSITIVE", "BLOCKED"]),
  category: z.enum([
    "safe",
    "self_harm_distress",
    "apology_violence",
    "sexual_violence",
    "hate_speech",
    "illegal",
  ]),
  isSensitive: z.boolean(),
  reason: z.string().optional(),
});

export type ModerationVerdictOutput = z.infer<typeof moderationVerdictSchema>;
