import { UnburdenType } from "@/types/unburden.type";

type UnburdenProps = {
  data: UnburdenType;
};

export function Unburden({ data }: UnburdenProps) {
  return (
    <div>
      <h1 className="text-lg font-bold"> # {data.title}</h1>
      <p>{data.description}</p>
      <div className="flex justify-end">
        <button className="rose-button">Apoiar</button>
      </div>
    </div>
  );
}
