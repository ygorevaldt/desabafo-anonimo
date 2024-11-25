"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { UnburdenType } from "@/types/unburden.type";

import { UnburdenListItem } from "./UnburdenListItem";
import { Loading } from "./Loading";

export function UnburdenList() {
  const [isLoading, setIsLoading] = useState(false);
  const [unburdens, setUnburdens] = useState<UnburdenType[]>([]);

  const supportedUnburdens = JSON.parse(
    localStorage.getItem("supportedUnburdens") || "[]",
  );

  console.log(supportedUnburdens);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("/api/v1/unburden")
      .then((response) => {
        setUnburdens(response.data.unburdens);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      {Array.isArray(unburdens) && unburdens[0] ? (
        <ul className="flex flex-col gap-6">
          {unburdens.map((unburden) => {
            const unburdenSupported: boolean = supportedUnburdens.includes(
              unburden.id,
            );

            return <UnburdenListItem unburden={unburden} key={unburden.id} />;
          })}
        </ul>
      ) : (
        <div className="text-center">
          <h1 className="text-zinc-500 text-xl">
            Tome a iniciativa e seja o primeiro a desabafar aqui
          </h1>
        </div>
      )}
      {isLoading && <Loading />}
    </>
  );
}
