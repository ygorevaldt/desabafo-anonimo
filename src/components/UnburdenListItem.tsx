import { FaHashtag } from "react-icons/fa";

import { UnburdenType } from "@/types/unburden.type";
import { SupportButton } from "./SupportButton";
import { useEffect, useState } from "react";
import axios from "axios";
import { Time } from "./Time";
import { SupportsAmount } from "./SupportsAmount";

type UnburdenProps = {
  unburden: UnburdenType;
};

export function UnburdenListItem({ unburden }: UnburdenProps) {
  const [data, setData] = useState(unburden);

  async function handleRegisterSupport() {
    try {
      if (unburden.supported) {
        alert("Você já apoiou este desabafo.");
        return;
      }

      await axios.post("/api/v1/support", { unburdenId: unburden.id });
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
    <li>
      <div
        className="
        flex flex-col gap-4
        border-2 border-zinc-300 
        rounded-lg p-4 pb-1
        hover:shadow-md duration-300
      "
      >
        <div className="md:flex md:flex-row flex flex-col-reverse justify-between items-start">
          <h1
            className="
            text-xl font-bold text-rose-500
            flex items-start gap-1 pt-4"
          >
            {<FaHashtag />} {data.title}
          </h1>
          <div className="w-full md:w-fit flex justify-end">
            <Time
              publishedAt={new Date(data.created_at)}
              className="text-zinc-400 text-xs"
            />
          </div>
        </div>
        <p className="px-1 whitespace-pre-wrap">{data.content}</p>
        <SupportsAmount
          amount={data.supports_amount}
          className="text-xs text-end text-zinc-400 mt-2"
        />
      </div>
      <div className="flex justify-end mt-2">
        <SupportButton
          registerSupport={handleRegisterSupport}
          disabled={data.supported}
        />
      </div>
    </li>
  );
}
