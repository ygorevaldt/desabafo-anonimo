import { FaHashtag } from "react-icons/fa";

import { UnburdenType } from "@/types/unburden.type";
import { SupportButton } from "./SupportButton";
import { useState } from "react";
import axios from "axios";
import { Loading } from "./Loading";

type UnburdenProps = {
  unburden: UnburdenType;
};

export function UnburdenListItem({ unburden }: UnburdenProps) {
  const [data, setData] = useState(unburden);

  async function handleRegisterSupport() {
    try {
      await axios.post("/api/v1/support", { unburdenId: unburden.id });
      setData((currentState) => {
        return {
          ...currentState,
          supports_amount: currentState.supports_amount + 1,
        };
      });
      unburden.supports_amount += 1;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <li>
      <div
        className="
        flex flex-col gap-2
        border-2 border-zinc-300 
        rounded-lg p-4 pb-1
        hover:shadow-md duration-300
      "
      >
        <h1 className="text-xl font-bold text-rose-500 flex items-center gap-1">
          {<FaHashtag />} {unburden.title}
        </h1>
        <p className="px-1 whitespace-pre-wrap">{unburden.content}</p>
        <>
          {unburden.supports_amount === 0 ? (
            <p className="text-xs text-end text-zinc-500 mt-2">
              Seja o primeiro a demonstrar apoio
            </p>
          ) : (
            <p className="text-xs text-end text-zinc-500 mt-2">
              <span className="text-sm">{unburden.supports_amount} </span>
              {unburden.supports_amount === 1
                ? "demonstração"
                : "demostrações"}{" "}
              de apoio
            </p>
          )}
        </>
      </div>
      <div className="flex justify-end mt-2">
        <SupportButton registerSupport={handleRegisterSupport} />
      </div>
    </li>
  );
}
