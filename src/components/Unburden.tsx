import { UnburdenType } from "@/types/unburden.type";
import { SupportButton } from "./SupportButton";

type UnburdenProps = {
  data: UnburdenType;
};

export function Unburden({ data }: UnburdenProps) {
  return (
    <div
      className="
      border-2 border-zinc-300 
      rounded-lg p-2
      hover:scale-105 duration-300
    "
    >
      <h1 className="text-lg font-bold text-rose-500"> # {data.title}</h1>
      <p>{data.description}</p>
      <div className="flex justify-end">
        <SupportButton />
      </div>
    </div>
  );
}
