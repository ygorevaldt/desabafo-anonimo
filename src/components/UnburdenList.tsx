import { useEffect, useState } from "react";
import axios from "axios";

import { UnburdenType } from "@/types/unburden.type";

import { UnburdenListItem } from "./UnburdenListItem";
import { Loading } from "./Loading";

export function UnburdenList() {
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
      {unburdens[0] ? (
        <ul className="flex flex-col gap-6">
          {unburdens.map((unburden) => {
            return <UnburdenListItem unburden={unburden} key={unburden.id} />;
          })}
        </ul>
      ) : (
        <div className="text-center">
          <h1 className="text-zinc-500 text-xl">Nenhum desabafo registrado</h1>
        </div>
      )}
      {isLoading && <Loading />}
    </>
  );
}
