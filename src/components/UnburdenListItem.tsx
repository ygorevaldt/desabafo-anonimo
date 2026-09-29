"use client";

import { UnburdenType } from "@/types/unburden.type";
import { Unburden } from "./Unburden";

type UnburdenListItemProps = {
  unburden: UnburdenType;
};

export function UnburdenListItem({ unburden }: UnburdenListItemProps) {
  return (
    <li className="list-none">
      <Unburden
        data={unburden}
        titleHref={`/unburden/${unburden.id}`}
        showSupportButton={true}
        className="hover:scale-[1.01] hover:border-rose-400/50 hover:shadow-soft-md transition-all duration-200"
      />
    </li>
  );
}
