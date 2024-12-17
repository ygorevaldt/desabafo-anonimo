import { z as zod } from "zod";
import {
  REQUIRED_MESSAGE,
  UUID_INVALID_TYPE_MESSAGE,
  UUID_LENGTH,
  UUID_LENGTH_MESSAGE,
} from "../../constants/validation-constants";

export const fetchCommentsParamsSchema = zod.object({
  unburden_id: zod
    .string({
      invalid_type_error: UUID_INVALID_TYPE_MESSAGE,
      required_error: REQUIRED_MESSAGE,
    })
    .length(UUID_LENGTH, UUID_LENGTH_MESSAGE),
});
