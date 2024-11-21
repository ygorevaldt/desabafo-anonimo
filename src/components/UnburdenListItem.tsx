import { FaHashtag } from "react-icons/fa";

import { UnburdenType } from "@/types/unburden.type";
import { SupportButton } from "./SupportButton";

type UnburdenProps = {
  data: UnburdenType;
};

export function UnburdenListItem({ data }: UnburdenProps) {
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
              {data.supports_amount}{" "}
              {data.supports_amount === 1 ? "demonstração" : "demostrações"} de
              apoio
            </p>
          )}
        </>
      </div>
      <div className="flex justify-end mt-2">
        <SupportButton />
      </div>
    </li>
  );
}
