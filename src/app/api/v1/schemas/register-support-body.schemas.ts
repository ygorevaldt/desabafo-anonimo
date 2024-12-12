import { z as zod } from "zod";
import {
  UUID_LENGTH_MESSAGE,
  UUID_LENGTH,
  UUID_INVALID_TYPE_MESSAGE,
  REQUIRED_MESSAGE,
} from "@/app/api/constants/validation-constants";

export const registerSupportBodySchema = zod.object({
  unburden_id: zod
    .string({
      invalid_type_error: UUID_INVALID_TYPE_MESSAGE,
      required_error: REQUIRED_MESSAGE,
    })
    .length(UUID_LENGTH, UUID_LENGTH_MESSAGE),
});
