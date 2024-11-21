import { FaHashtag } from "react-icons/fa";

import { UnburdenType } from "@/types/unburden.type";
import { SupportButton } from "./SupportButton";
import { useState } from "react";
import axios from "axios";
import { Loading } from "./Loading";

type UnburdenProps = {
  data: UnburdenType;
};

export function UnburdenListItem({ data }: UnburdenProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegisterSupport() {
    setIsLoading(true);

    try {
      await axios.post("/api/v1/support", { unburdenId: data.id });
      data.supports_amount += 1;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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
          {<FaHashtag />} {data.title}
        </h1>
        <p className="px-1">{data.description}</p>
        <>
          {data.supports_amount === 0 ? (
            <p className="text-xs text-end text-zinc-500 mt-2">
              Seja o primeiro a demonstrar apoio
            </p>
          ) : (
            <p className="text-xs text-end text-zinc-500 mt-2">
              <span className="text-sm">{data.supports_amount} </span>
              {data.supports_amount === 1 ? "demonstração" : "demostrações"} de
              apoio
            </p>
          )}
        </>
      </div>
      <div className="flex justify-end mt-2">
        <SupportButton registerSupport={handleRegisterSupport} />
      </div>
      {isLoading && <Loading />}
    </li>
  );
}
