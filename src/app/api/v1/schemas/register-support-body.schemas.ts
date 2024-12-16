import { z as zod } from "zod";
import {
  UUID_LENGTH_MESSAGE,
  UUID_LENGTH,
  UUID_INVALID_TYPE_MESSAGE,
  REQUIRED_MESSAGE,
} from "@/app/api/constants/validation-constants";

export const registerSupportBodySchema = zod
  .object({
    unburden_id: zod
      .string({
        invalid_type_error: UUID_INVALID_TYPE_MESSAGE,
      })
      .optional(),
    comment_id: zod
      .string({
        invalid_type_error: UUID_INVALID_TYPE_MESSAGE,
      })
      .optional(),
  })
  .refine((data) => data.unburden_id || data.comment_id, {
    message:
      "Pelo menos uma idêntificação de comentário ou desabafo deve ser fornecida.",
    path: ["unburden_id", "comment_id"],
  });
