"use client";

import Link from "next/link";
import { UnburdenType } from "@/types/unburden.type";
import { SupportButton } from "./SupportButton";
import { Unburden } from "./Unburden";

type UnburdenListItemProps = {
  unburden: UnburdenType;
};

export function UnburdenListItem({ unburden }: UnburdenListItemProps) {
  return (
    <li className="relative group list-none">
      <Link
        href={`/unburden/${unburden.id}`}
        title={`Acessar desabafo: ${unburden.title}`}
        className="block"
      >
        <Unburden
          data={unburden}
          className="hover:scale-[1.01] hover:border-rose-400/50 hover:shadow-soft-md transition-all duration-200"
        />
      </Link>
      <div className="absolute right-6 bottom-4 z-10">
        <SupportButton unburden={unburden} />
      </div>
    </li>
  );
}
