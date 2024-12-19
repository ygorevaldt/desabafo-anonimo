import { FaHashtag } from "react-icons/fa";

import { UnburdenType } from "@/types/unburden.type";
import { SupportButton } from "./SupportButton";
import { useEffect, useState } from "react";
import axios from "axios";
import { Time } from "./Time";
import { SupportsAmount } from "./SupportsAmount";
import Link from "next/link";
import { Unburden } from "./Unburden";

type UnburdenListItemProps = {
  unburden: UnburdenType;
};

export function UnburdenListItem({ unburden }: UnburdenListItemProps) {
  const [data, setData] = useState(unburden);

  async function handleRegisterSupport() {
    try {
      if (unburden.supported) {
        alert("Você já apoiou este desabafo.");
        return;
      }

      await axios.post("/api/v1/support", { unburden_id: unburden.id });
      setData((currentState) => {
        return {
          ...currentState,
          supports_amount: currentState.supports_amount + 1,
          supported: true,
        };
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <li key={unburden.id}>
      <Link href={`/unburden/${data.id}`}>
        <Unburden data={unburden} className="hover:scale-102 duration-300" />
      </Link>
      <div className="flex justify-end mt-2">
        <SupportButton
          registerSupport={handleRegisterSupport}
          disabled={data.supported}
        />
      </div>
    </li>
  );
}
