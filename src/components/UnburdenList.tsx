"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFeed, appendFeed } from "@/store/slices/feedSlice";
import { fetchUnburdensList } from "@/http";
import { errorAlert } from "@/utils/alert";
import { UnburdenListItem } from "./UnburdenListItem";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { FaFeather, FaHeart, FaSpinner } from "react-icons/fa";
import Link from "next/link";

export function UnburdenList() {
  const dispatch = useAppDispatch();
  const { items: unburdens, total, page, hasMore } = useAppSelector(
    (state) => state.feed,
  );
  const [isInitialLoading, setIsInitialLoading] = useState(unburdens.length === 0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    // Only fetch if store is empty or initial
    if (unburdens.length === 0) {
      setIsInitialLoading(true);
      axios
        .get(`/api/v1/unburden?page=1`, { withCredentials: true })
        .then((response) => {
          const { unburdens: fetchedItems, total: fetchedTotal } = response.data;
          dispatch(
            setFeed({
              items: fetchedItems || [],
              total: fetchedTotal || 0,
              page: 1,
            }),
          );
        })
        .catch((error) => {
          console.error(error);
          errorAlert(
            "Não foi possível carregar os desabafos. Tente recarregar a página.",
          );
        })
        .finally(() => {
          setIsInitialLoading(false);
        });
    } else {
      setIsInitialLoading(false);
    }
  }, [dispatch, unburdens.length]);

  async function handleFetchMore() {
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const response = await fetchUnburdensList({ page: nextPage });

      dispatch(
        appendFeed({
          items: response.unburdens || [],
          total: response.total,
          page: nextPage,
        }),
      );
    } catch (error) {
      console.error(error);
      errorAlert(
        "Serviço temporariamente indisponível. Tente novamente em instantes.",
      );
    } finally {
      setIsLoadingMore(false);
    }
  }

  // Loading skeleton state
  if (isInitialLoading && unburdens.length === 0) {
    return (
      <div className="w-full flex flex-col gap-6">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="rounded-3xl border border-border/80 bg-card p-6 flex flex-col gap-4 shadow-soft"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-1/3 rounded-xl" />
              <Skeleton className="h-4 w-20 rounded-xl" />
            </div>
            <Skeleton className="h-16 w-full rounded-2xl" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-4 w-24 rounded-lg" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!isInitialLoading && unburdens.length === 0) {
    return (
      <div className="w-full text-center py-16 px-4 bg-card/60 rounded-3xl border border-border/80 shadow-soft flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
          <FaHeart className="w-6 h-6 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-foreground">
          Nenhum desabafo registrado ainda
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Seja a primeira pessoa a abrir o coração neste espaço seguro e acolhedor.
        </p>
        <Link href="/unburden" className="mt-2">
          <Button variant="warm" size="lg" className="gap-2 font-semibold">
            <FaFeather className="w-4 h-4" />
            <span>Fazer o primeiro desabafo</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <ul className="flex flex-col gap-6 list-none p-0 m-0">
        {unburdens.map((unburden) => (
          <UnburdenListItem unburden={unburden} key={unburden.id} />
        ))}
      </ul>

      {hasMore && (
        <div className="flex justify-center pt-4 pb-8">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={handleFetchMore}
            disabled={isLoadingMore}
            className="gap-2.5 font-semibold text-sm rounded-full shadow-soft hover:shadow-soft-md"
          >
            {isLoadingMore ? (
              <>
                <FaSpinner className="w-4 h-4 animate-spin text-rose-500" />
                <span>Carregando mais desabafos...</span>
              </>
            ) : (
              <span>Carregar mais desabafos</span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
