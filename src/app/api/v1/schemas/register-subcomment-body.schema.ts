import { z as zod } from "zod";
import {
  UUID_INVALID_TYPE_MESSAGE,
  CONTENT_INVALID_TYPE_MESSAGE,
  COMMENT_CONTENT_MIN_LENGTH,
  COMMENT_CONTENT_MIN_LENGTH_MESSAGE,
  COMMENT_CONTENT_MAX_LENGTH,
  COMMENT_CONTENT_MAX_LENGTH_MESSAGE,
} from "@/app/api/constants/validation-constants";

export const registerSubcommentBodySchema = zod.object({
  comment_id: zod.string({
    invalid_type_error: UUID_INVALID_TYPE_MESSAGE,
  }),
  content: zod
    .string({
      invalid_type_error: CONTENT_INVALID_TYPE_MESSAGE,
    })
    .min(COMMENT_CONTENT_MIN_LENGTH, COMMENT_CONTENT_MIN_LENGTH_MESSAGE)
    .max(COMMENT_CONTENT_MAX_LENGTH, COMMENT_CONTENT_MAX_LENGTH_MESSAGE),
});
