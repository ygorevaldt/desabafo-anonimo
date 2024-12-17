import { z as zod } from "zod";
import {
  UUID_INVALID_TYPE_MESSAGE,
  CONTENT_INVALID_TYPE_MESSAGE,
  CONTENT_MIN_LENGTH,
  CONTENT_MIN_LENGTH_MESSAGE,
  CONTENT_MAX_LENGTH,
  CONTENT_MAX_LENGTH_MESSAGE,
} from "@/app/api/constants/validation-constants";

export const registerSubcommentBodySchema = zod.object({
  comment_id: zod.string({
    invalid_type_error: UUID_INVALID_TYPE_MESSAGE,
  }),
  content: zod
    .string({
      invalid_type_error: CONTENT_INVALID_TYPE_MESSAGE,
    })
    .min(CONTENT_MIN_LENGTH, CONTENT_MIN_LENGTH_MESSAGE)
    .max(CONTENT_MAX_LENGTH, CONTENT_MAX_LENGTH_MESSAGE),
});
