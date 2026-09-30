import { z as zod } from "zod";
import {
  UUID_INVALID_TYPE_MESSAGE,
  CONTENT_INVALID_TYPE_MESSAGE,
  COMMENT_CONTENT_MIN_LENGTH,
  COMMENT_CONTENT_MIN_LENGTH_MESSAGE,
  COMMENT_CONTENT_MAX_LENGTH,
  COMMENT_CONTENT_MAX_LENGTH_MESSAGE,
  REQUIRED_MESSAGE,
} from "@/app/api/constants/validation-constants";

export const registerCommentBodySchema = zod
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
    content: zod
      .string({
        invalid_type_error: CONTENT_INVALID_TYPE_MESSAGE,
        required_error: REQUIRED_MESSAGE,
      })
      .min(COMMENT_CONTENT_MIN_LENGTH, COMMENT_CONTENT_MIN_LENGTH_MESSAGE)
      .max(COMMENT_CONTENT_MAX_LENGTH, COMMENT_CONTENT_MAX_LENGTH_MESSAGE),
  })
  .refine((data) => Boolean(data.unburden_id || data.comment_id), {
    message: "É necessário informar unburden_id ou comment_id.",
  });
