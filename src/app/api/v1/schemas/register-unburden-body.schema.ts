import { z as zod } from "zod";
import {
  CONTENT_INVALID_TYPE_MESSAGE,
  CONTENT_MAX_LENGTH,
  CONTENT_MAX_LENGTH_MESSAGE,
  CONTENT_MIN_LENGTH,
  CONTENT_MIN_LENGTH_MESSAGE,
  REQUIRED_MESSAGE,
  TITLE_INVALID_TYPE_MESSAGE,
  TITLE_MAX_LENGTH,
  TITLE_MAX_LENGTH_MESSAGE,
  TITLE_MIN_LENGTH,
  TITLE_MIN_LENGTH_MESSAGE,
} from "@/app/api/constants/validation-constants";

export const registerUnburdenBodySchema = zod.object({
  title: zod
    .string({
      invalid_type_error: TITLE_INVALID_TYPE_MESSAGE,
      required_error: REQUIRED_MESSAGE,
    })
    .min(TITLE_MIN_LENGTH, TITLE_MIN_LENGTH_MESSAGE)
    .max(TITLE_MAX_LENGTH, TITLE_MAX_LENGTH_MESSAGE),
  content: zod
    .string({
      invalid_type_error: CONTENT_INVALID_TYPE_MESSAGE,
      required_error: REQUIRED_MESSAGE,
    })
    .min(CONTENT_MIN_LENGTH, CONTENT_MIN_LENGTH_MESSAGE)
    .max(CONTENT_MAX_LENGTH, CONTENT_MAX_LENGTH_MESSAGE),
});
