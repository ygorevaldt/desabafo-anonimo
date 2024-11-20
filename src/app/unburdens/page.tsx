"use client";

import { DinamicPage } from "@/components/DinamicPage";
import { Loading } from "@/components/Loading";
import { Unburden } from "@/components/Unburden";
import { UnburdenType } from "@/types/unburden.type";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

export default function Unburdens() {
  const [isLoading, setIsLoading] = useState(false);
  const [unburdens, setUnburdens] = useState<UnburdenType[]>([]);

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
      <DinamicPage className="flex flex-col gap-4 py-10">
        <header>
          <h1 className="text-xl font-semibold">Desabafos</h1>
        </header>
        <main>
          {unburdens[0] && (
            <ul className="flex flex-col gap-3">
              {unburdens.map((unburden) => {
                return (
                  <li key={unburden.id}>
                    <Unburden data={unburden} />
                  </li>
                );
              })}
            </ul>
          )}
        </main>
      </DinamicPage>
      {isLoading && <Loading />}
    </>
  );
}
