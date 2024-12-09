"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { UnburdenType } from "@/types/unburden.type";

import { UnburdenListItem } from "./UnburdenListItem";
import { Loading } from "./Loading";
import { LoadMoreButton } from "./LoadMoreButton";
import { truncateSync } from "fs";

export function UnburdenList() {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [unburdens, setUnburdens] = useState<UnburdenType[]>([]);
  const [showMoreUnburdensButton, setShowMoreUnburdensButton] = useState(true);

  async function handleFetchMoreUnburdens() {
    try {
      setIsLoading(true);
      const newPage = page + 1;
      setPage(newPage);

      const response = await axios.get(`/api/v1/unburden?page=${newPage}`);
      const updatedUnburdens = [...unburdens, ...response.data.unburdens];
      setUnburdens(updatedUnburdens);

      const isRecoveredAllTheUnburdens =
        response.data.total == updatedUnburdens.length;
      if (!isRecoveredAllTheUnburdens) return;

      setShowMoreUnburdensButton(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`/api/v1/unburden?page=${page}`, {
        withCredentials: true,
      })
      .then((response) => {
        const { unburdens, total } = response.data;
        setUnburdens(unburdens);

        const isRecoveredAllTheUnburdens = total == unburdens?.length;
        if (!isRecoveredAllTheUnburdens) return;

        setShowMoreUnburdensButton(false);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="w-full flex flex-col gap-10">
      {Array.isArray(unburdens) && unburdens[0] ? (
        <ul className="flex flex-col gap-6">
          {unburdens.map((unburden) => {
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
      {showMoreUnburdensButton && (
        <LoadMoreButton action={handleFetchMoreUnburdens} />
      )}
    </div>
  );
}
