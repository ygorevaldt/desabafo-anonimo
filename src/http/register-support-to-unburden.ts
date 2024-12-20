import { UnburdenType } from "@/types";
import axios from "axios";

export async function registerSupportToUnburden(unburden: UnburdenType) {
  if (unburden.supported) return;

  await axios({
    method: "POST",
    url: "/api/v1/support",
    data: {
      unburden_id: unburden.id,
    },
  });
}
