import { UnburdenType } from "@/types/unburden.type";
import { FaHashtag } from "react-icons/fa";
import { Time } from "./Time";
import { SupportsAmount } from "./SupportsAmount";

type UnburdenProps = {
  data: UnburdenType;
  className?: string;
};

export function Unburden({ data, className }: UnburdenProps) {
  return (
    <div
      className={`
        flex flex-col gap-4
        border-2 border-zinc-300 
        rounded-lg p-4 pb-1
        shadow-md
        bg-white  
        ${className}
      `}
    >
      <div className="md:flex md:flex-row flex flex-col-reverse justify-between items-start">
        <h1
          className="
            text-xl font-bold text-rose-500
            flex items-start gap-1 pt-4
          "
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
  );
}
