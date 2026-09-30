"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UnburdenType } from "@/types/unburden.type";
import { errorAlert } from "@/utils/alert";
import { Unburden } from "@/components/Unburden";
import { DinamicPage } from "@/components/DinamicPage";
import { CommentList } from "@/components/CommentList";
import { CommentForm } from "@/components/CommentForm";
import { CommentType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { FaArrowLeft } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setActiveUnburden,
  setComments,
  addComment,
} from "@/store/slices/activeUnburdenSlice";
import { updateFeedCommentCount } from "@/store/slices/feedSlice";
import { fetchUnburdenComments, fetchUniqueUnburden } from "@/http";
import { countTotalComments } from "@/utils/comment.util";

type Props = {
  params: Promise<{ id: string }>;
};

export default function Page({ params }: Props) {
  const dispatch = useAppDispatch();
  const { current: unburden, comments } = useAppSelector(
    (state) => state.activeUnburden,
  );
  const [isLoading, setIsLoading] = useState(!unburden);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        const resolvedParams = await params;
        const unburdenId = resolvedParams.id;

        const [fetchedUnburden, fetchedComments] = await Promise.all([
          fetchUniqueUnburden(unburdenId),
          fetchUnburdenComments(unburdenId),
        ]);

        if (isMounted) {
          dispatch(setActiveUnburden(fetchedUnburden));
          dispatch(setComments(fetchedComments));

          const totalComments = countTotalComments(fetchedComments);
          dispatch(
            updateFeedCommentCount({ unburdenId, count: totalComments }),
          );
        }
      } catch (error) {
        console.error(error);
        errorAlert(
          "Não foi possível carregar o desabafo. Tente novamente mais tarde.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [params, dispatch]);

  function handleNewComment() {}

  return (
    <DinamicPage className="max-w-4xl py-6 sm:py-10">
      <div className="mb-6">
        <Link
          href="/unburdens"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-rose-500 transition-colors"
        >
          <FaArrowLeft className="w-3 h-3" />
          <span>Voltar para todos os desabafos</span>
        </Link>
      </div>

      {isLoading && !unburden ? (
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-border/80 bg-card p-7 flex flex-col gap-4 shadow-soft">
            <Skeleton className="h-7 w-1/2 rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-44 w-full rounded-3xl" />
        </div>
      ) : unburden ? (
        <div className="flex flex-col gap-8">
          <Unburden
            data={unburden}
            showSensitiveButton={true}
            showSupportButton={true}
          />

          <section className="flex flex-col gap-8">
            <CommentForm
              unburdenId={unburden.id}
              onCommentRegistered={handleNewComment}
            />

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <h3 className="text-lg font-bold text-foreground">
                  Apoios da Comunidade ({countTotalComments(comments)})
                </h3>
              </div>
              <CommentList comments={comments} />
            </div>
          </section>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-sm">Desabafo não encontrado.</p>
        </div>
      )}
    </DinamicPage>
  );
}
