import { z } from "zod";

export const registerReportBodySchema = z.object({
  reason: z
    .string()
    .max(255, { message: "O motivo deve ter no máximo 255 caracteres." })
    .optional(),
});

export type RegisterReportBody = z.infer<typeof registerReportBodySchema>;
